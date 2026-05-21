from datetime import datetime, timezone
from typing import List
from app.models.schemas import Patient

# Triage configuration mapping:
# { Triage Level: {"base_urgency": U_0, "alpha": growth_rate, "horizon_minutes": H} }
TRIAGE_CONFIG = {
    5: {"base_urgency": 100.0, "alpha": 0.0,  "horizon_minutes": 0},    # Resuscitation (Immediate attention, no wait growth needed)
    4: {"base_urgency": 80.0,  "alpha": 2.0,  "horizon_minutes": 10},   # Very Urgent
    3: {"base_urgency": 60.0,  "alpha": 1.0,  "horizon_minutes": 60},   # Urgent
    2: {"base_urgency": 40.0,  "alpha": 0.5,  "horizon_minutes": 120},  # Standard
    1: {"base_urgency": 20.0,  "alpha": 0.2,  "horizon_minutes": 240}   # Non-Urgent
}

def calculate_apqh_priority(patient: Patient, current_time: datetime) -> float:
    """
    Calculates the real-time calculated priority score P(t) for a Pydantic Patient object.
    Applies the mathematical formula: P(t) = U_0 + (alpha * t)
    
    If the elapsed wait time breaches the finite horizon (H), priority returns infinity.
    """
    config = TRIAGE_CONFIG.get(patient.triage_level, TRIAGE_CONFIG[1])
    
    # Calculate elapsed waiting time in minutes
    wait_time_delta = current_time - patient.arrival_time
    wait_time_minutes = max(0.0, wait_time_delta.total_seconds() / 60.0)
    
    # Finite Horizon Constraint Check
    horizon = config["horizon_minutes"]
    if horizon > 0 and wait_time_minutes >= horizon:
        return float('inf')
        
    # Accumulative Priority Math
    priority_score = config["base_urgency"] + (config["alpha"] * wait_time_minutes)
    return priority_score

def sort_patient_queue(patients: List[Patient], current_time: datetime = None) -> List[Patient]:
    """
    Takes a mutable list of Pydantic Patient objects, updates their priority scores 
    dynamically relative to the current timestamp, and returns the list sorted 
    from highest priority to lowest.
    """
    if current_time is None:
        current_time = datetime.now(timezone.utc)
        
    for patient in patients:
        patient.current_priority = calculate_apqh_priority(patient, current_time)
        
    # Sort in descending order (highest score or float('inf') at the top)
    return sorted(patients, key=lambda p: p.current_priority, reverse=True)