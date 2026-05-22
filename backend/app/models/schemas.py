from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

# --- PATIENT SCHEMAS ---
class PatientBase(BaseModel):
    name: str
    age: int
    primary_symptom: str
    # Removed triage_level from the base! The backend dictates this now.

class PatientCreate(PatientBase):
    pass # Clean, secure intake payload

class Patient(PatientBase):
    id: str
    triage_level: int = Field(..., ge=1, le=5)
    arrival_time: datetime
    current_priority: float = 0.0
    status: str = "WAITING" # WAITING, EN_ROUTE, ADMITTED, DISCHARGED
    assigned_hospital_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- HOSPITAL SCHEMAS ---
class Hospital(BaseModel):
    id: str
    name: str
    location_x: float
    location_y: float
    total_beds: int
    available_beds: int
    current_wait_time_mins: float = 0.0
    active_queue_length: int = 0  # NEW: Tracks Q_h for predictive math

    model_config = ConfigDict(from_attributes=True)

# --- AMBULANCE SCHEMAS ---
class Ambulance(BaseModel):
    id: str
    current_x: float
    current_y: float
    status: str = "IDLE"
    assigned_patient_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- CHATBOT SCHEMAS ---
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]