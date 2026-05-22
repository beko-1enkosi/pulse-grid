from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import List, Dict
from datetime import datetime, timezone
import uuid
import asyncio
import random
import json
import os
import httpx

# Import our Pydantic blueprints
from app.models.schemas import PatientCreate, Patient, Hospital
from app.models.schemas import ChatRequest

# Import our core algorithmic engines
from app.core.triage_logic import rule_based_explainable_inference
from app.core.routing import find_best_hospital
from app.core.queue_manager import sort_patient_queue

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# ==========================================
# WEBSOCKET MANAGER (Real-Time Comm Link)
# ==========================================
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Pushes JSON state updates to all connected frontend dashboards."""
        payload = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception:
                pass

manager = ConnectionManager()


# ==========================================
# IN-MEMORY DATABASE (The Grid)
# ==========================================
db_hospitals: Dict[str, Hospital] = {
    "H-1": Hospital(id="H-1", name="Johannesburg Central", location_x=10.0, location_y=10.0, total_beds=50, available_beds=50, current_wait_time_mins=0.0),
    "H-2": Hospital(id="H-2", name="Pretoria East", location_x=30.0, location_y=40.0, total_beds=30, available_beds=30, current_wait_time_mins=0.0),
    "H-3": Hospital(id="H-3", name="Midrand Trauma Center", location_x=20.0, location_y=25.0, total_beds=20, available_beds=20, current_wait_time_mins=0.0)
}

db_patients: Dict[str, Patient] = {}
hospital_queues: Dict[str, List[Patient]] = {"H-1": [], "H-2": [], "H-3": []}


# ==========================================
# EVENT-DRIVEN DISCRETE SIMULATION ENGINE
# ==========================================
async def network_lifecycle_loop():
    """
    The heartbeat of PulseGrid. Evaluates queues, updates statuses, 
    processes discharges, and clears memory leaks.
    """
    while True:
        await asyncio.sleep(2)  # Process network changes every 2 seconds
        
        state_changed = False
        
        for h_id, hospital in db_hospitals.items():
            queue = hospital_queues[h_id]
            if not queue:
                continue
                
            # 1. Enforce APQ-h Time-Decay Math
            optimized_queue = sort_patient_queue(queue)
            hospital_queues[h_id] = optimized_queue
            
            # 2. Process State Machine (EN_ROUTE -> WAITING -> TREATED)
            for patient in list(optimized_queue): # Use list() to allow safe removal during iteration
                if patient.status == "EN_ROUTE":
                    if random.random() < 0.6:  # Simulate ambulance arriving
                        patient.status = "WAITING"
                        state_changed = True
                        
                elif patient.status == "WAITING":
                    # Simulating treatment completion / Discharge
                    if random.random() < 0.15: 
                        patient.status = "TREATED"
                        hospital.available_beds += 1
                        
                        # THE FIX: Pop the patient out of memory to prevent infinite queue growth
                        hospital_queues[h_id].remove(patient)
                        state_changed = True
                        break # Only process one major discharge per tick for visual smoothness
            
            # 3. Update predictive congestion metrics
            hospital.active_queue_length = len(hospital_queues[h_id])
            
            # Simulate wait times going up as queues get longer
            hospital.current_wait_time_mins = float(hospital.active_queue_length * 5.0) 
            
        if state_changed:
            # Tell the React frontend to refresh its visual data!
            await manager.broadcast({"event": "NETWORK_UPDATE"})


# ==========================================
# APP INITIALIZATION
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(network_lifecycle_loop())
    yield
    task.cancel()

app = FastAPI(title="PulseGrid AI API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


# ==========================================
# API & WEBSOCKET ENDPOINTS
# ==========================================
@app.get("/")
def read_root():
    return {"status": "online", "system": "PulseGrid AI API Engine Active"}
    
@app.websocket("/ws/dashboard")
async def websocket_endpoint(websocket: WebSocket):
    """The live portal for the React frontend."""
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text() # Keeps connection open
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/patients/intake", response_model=Patient)
async def intake_patient(patient_data: PatientCreate, patient_x: float = 0.0, patient_y: float = 0.0):
    # 1. Explainable AI Triage
    triage_level = rule_based_explainable_inference(patient_data)
    
    # 2. Predictive PTT Routing
    hospitals_list = list(db_hospitals.values())
    best_hospital = find_best_hospital(patient_x, patient_y, triage_level, hospitals_list)
    
    if not best_hospital:
        raise HTTPException(status_code=503, detail="Grid overload. No safe route available.")
        
    # 3. Create Record
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
    
    # 4. Update the Database & Reserve Bed
    db_patients[new_patient.id] = new_patient
    hospital_queues[best_hospital.id].append(new_patient)
    db_hospitals[best_hospital.id].available_beds -= 1
    db_hospitals[best_hospital.id].active_queue_length = len(hospital_queues[best_hospital.id])
    
    # Push immediate WebSocket update to frontend
    await manager.broadcast({"event": "NEW_PATIENT", "data": new_patient.model_dump(mode='json')})
    
    return new_patient

@app.get("/hospitals/", response_model=List[Hospital])
def get_hospitals():
    return list(db_hospitals.values())

@app.get("/hospitals/{hospital_id}/queue", response_model=List[Patient])
def get_hospital_queue(hospital_id: str):
    if hospital_id not in hospital_queues:
        raise HTTPException(status_code=404, detail="Hospital ID not recognized.")
    return sort_patient_queue(hospital_queues[hospital_id])

# ==========================================
# AI CHATBOT ENDPOINT (Powered by Claude)
# ==========================================
@app.post("/chat")
async def chat_with_pulsegrid_ai(request: ChatRequest):
    """
    Acts as a secure proxy between the React frontend and OpenRouter (Claude).
    """
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key is missing from the server environment.")

    # We inject a hidden system prompt so Claude knows its exact role
    system_prompt = {
        "role": "system",
        "content": "You are the PulseGrid AI Command Assistant. You help emergency dispatchers monitor hospital congestion, explain triage logic, and verify ambulance routing. Be concise, professional, and highly technical."
    }
    
    # Combine the system prompt with the user's chat history
    messages = [system_prompt] + [msg.model_dump() for msg in request.messages]

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:8000", 
        "X-Title": "PulseGrid AI",
        "Content-Type": "application/json"
    }

    # Asynchronously call OpenRouter
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json={
                    # Updated to use Claude 3.5 Sonnet
                    "model": "anthropic/claude-3.5-sonnet", 
                    "messages": messages,
                },
                timeout=20.0  # Slightly increased timeout for heavier Claude models
            )
            response.raise_for_status()
            data = response.json()
            return {"reply": data["choices"][0]["message"]["content"]}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenRouter connection failed: {str(e)}")