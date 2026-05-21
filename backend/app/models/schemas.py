from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

# --- PATIENT SCHEMAS ---
class PatientBase(BaseModel):
    name: str
    age: int
    primary_symptom: str
    triage_level: int = Field(..., ge=1, le=5, description="Triage level from 1 (lowest) to 5 (highest)")

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: str
    arrival_time: datetime
    current_priority: float = 0.0
    status: str = "WAITING" # WAITING, EN_ROUTE, TREATED
    assigned_hospital_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- HOSPITAL SCHEMAS ---
class Hospital(BaseModel):
    id: str
    name: str
    location_x: float  # Grid coordinates for mapping/routing
    location_y: float
    total_beds: int
    available_beds: int
    current_wait_time_mins: float = 0.0

    model_config = ConfigDict(from_attributes=True)

# --- AMBULANCE SCHEMAS ---
class Ambulance(BaseModel):
    id: str
    current_x: float
    current_y: float
    status: str = "IDLE" # IDLE, EN_ROUTE_PATIENT, EN_ROUTE_HOSPITAL
    assigned_patient_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)