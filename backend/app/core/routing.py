from typing import List, Optional
from app.models.schemas import Hospital

AMBULANCE_SPEED_UNITS_PER_MIN = 1.5

def calculate_grid_travel_time(x1: float, y1: float, x2: float, y2: float) -> float:
    distance = abs(x2 - x1) + abs(y2 - y1)
    return distance / AMBULANCE_SPEED_UNITS_PER_MIN

def calculate_predictive_congestion(hospital: Hospital) -> float:
    """
    Calculates C_h = (Q_h + I_h) / B_h
    (Current Queue + Incoming) / Total Beds
    """
    incoming_en_route = hospital.total_beds - hospital.available_beds - hospital.active_queue_length
    # Prevent division by zero and negative incoming values
    incoming_en_route = max(0, incoming_en_route) 
    
    if hospital.total_beds <= 0:
        return float('inf')
        
    congestion_score = (hospital.active_queue_length + incoming_en_route) / hospital.total_beds
    return congestion_score

def find_best_hospital(patient_x: float, patient_y: float, patient_triage: int, hospitals: List[Hospital]) -> Optional[Hospital]:
    """
    Advanced Routing Engine.
    Minimizes PTT = T_travel + T_queue + R_deterioration
    Factors in C_h (Predictive Congestion) to balance the network.
    """
    if not hospitals:
        return None
        
    best_hospital = None
    lowest_ptt = float('inf')
    
    for hospital in hospitals:
        if hospital.available_beds <= 0:
            continue
            
        # 1. T_travel
        travel_time = calculate_grid_travel_time(patient_x, patient_y, hospital.location_x, hospital.location_y)
        
        # 2. R_deterioration (Clinical Risk)
        # Higher triage levels get exponentially penalized for longer travel times
        deterioration_risk = 0.0
        if patient_triage >= 4:
            deterioration_risk = travel_time * (patient_triage * 0.5)
            
        # 3. T_queue (adjusted by predictive congestion)
        congestion_multiplier = 1.0 + calculate_predictive_congestion(hospital)
        dynamic_queue_delay = hospital.current_wait_time_mins * congestion_multiplier
        
        # 4. Total PTT calculation
        ptt = travel_time + dynamic_queue_delay + deterioration_risk
        
        if ptt < lowest_ptt:
            lowest_ptt = ptt
            best_hospital = hospital
            
    return best_hospital