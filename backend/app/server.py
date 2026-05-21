from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from datetime import datetime, timezone
import uuid
import asyncio  
import random   

# Import our Pydantic blueprints
from app.models.schemas import PatientCreate, Patient, Hospital

# Import our core algorithmic engines
from app.core.triage_logic import evaluate_initial_triage
from app.core.routing import find_best_hospital
from app.core.queue_manager import sort_patient_queue

app = FastAPI(title="PulseGrid AI", version="1.0.0")

# Allow the React frontend to communicate with this backend securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# IN-MEMORY DATABASE (For High-Speed Simulation)
# ==========================================
db_hospitals: Dict[str, Hospital] = {
    "H-1": Hospital(id="H-1", name="Johannesburg Central", location_x=10.0, location_y=10.0, total_beds=50, available_beds=5, current_wait_time_mins=45.0),
    "H-2": Hospital(id="H-2", name="Pretoria East", location_x=30.0, location_y=40.0, total_beds=30, available_beds=12, current_wait_time_mins=10.0),
    "H-3": Hospital(id="H-3", name="Midrand Trauma Center", location_x=20.0, location_y=25.0, total_beds=20, available_beds=0, current_wait_time_mins=120.0)
}

db_patients: Dict[str, Patient] = {}
hospital_queues: Dict[str, List[Patient]] = {"H-1": [], "H-2": [], "H-3": []}

# ==========================================
# API ENDPOINTS
# ==========================================

@app.get("/")
def read_root():
    return {"status": "online", "system": "PulseGrid AI Core API Engine Active"}

@app.post("/patients/intake", response_model=Patient)
def intake_patient(patient_data: PatientCreate, patient_x: float = 0.0, patient_y: float = 0.0):
    """
    The main integration pipeline:
    1. Evaluates triage level via keyword scoring.
    2. Routes to the best hospital using PTT / Manhattan Distance.
    3. Injects the patient into the dynamic APQ-h queue.
    """
    # 1. AI Triage Gatekeeper
    triage_level = evaluate_initial_triage(patient_data)
    
    # 2. Network Routing Optimizer
    hospitals_list = list(db_hospitals.values())
    best_hospital = find_best_hospital(patient_x, patient_y, hospitals_list)
    
    if not best_hospital:
        raise HTTPException(status_code=503, detail="Critical Failure: Entire hospital network is at maximum capacity.")
        
    # 3. Generate Official Patient Record
    new_patient = Patient(
        id=f"P-{uuid.uuid4().hex[:6].upper()}",
        name=patient_data.name,
        age=patient_data.age,
        primary_symptom=patient_data.primary_symptom,
        triage_level=triage_level,
        arrival_time=datetime.now(timezone.utc),
        status="EN_ROUTE",
        assigned_hospital_id=best_hospital.id
    )
    
    # 4. Update the Grid
    db_patients[new_patient.id] = new_patient
    hospital_queues[best_hospital.id].append(new_patient)
    db_hospitals[best_hospital.id].available_beds -= 1
    
    return new_patient

@app.get("/hospitals/", response_model=List[Hospital])
def get_hospitals():
    """Returns the live load and capacity of all hospitals on the grid."""
    return list(db_hospitals.values())

@app.get("/hospitals/{hospital_id}/queue", response_model=List[Patient])
def get_hospital_queue(hospital_id: str):
    """
    Returns the actively sorted queue for a specific hospital.
    Every time this is called, the APQ-h math recalculates priorities based on elapsed time.
    """
    if hospital_id not in hospital_queues:
        raise HTTPException(status_code=404, detail="Hospital ID not recognized on the grid.")
        
    raw_queue = hospital_queues[hospital_id]
    optimized_queue = sort_patient_queue(raw_queue)
    
    return optimized_queue

# ==========================================
# BACKGROUND WORKERS (The Auto-Discharge Engine)
# ==========================================

async def discharge_loop():
    """
    Runs continuously in the background. 
    Simulates patients recovering and being discharged, freeing up hospital beds.
    """
    while True:
        await asyncio.sleep(4)  # Wait 4 seconds between network checks
        
        for hospital in db_hospitals.values():
            # If the hospital is not completely empty...
            if hospital.available_beds < hospital.total_beds:
                # 30% chance someone gets discharged every tick
                if random.random() < 0.3:
                    hospital.available_beds += 1
                    print(f"[*] DISCHARGE: 1 bed freed at {hospital.name} (Total Available: {hospital.available_beds})")

@app.on_event("startup")
async def startup_event():
    """Fires up the background workers the moment the FastAPI server starts."""
    asyncio.create_task(discharge_loop())