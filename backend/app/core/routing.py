from typing import List, Optional
from app.models.schemas import Hospital

# Simulated average ambulance speed in grid units per minute.
# In a real system, this would be updated live via traffic APIs.
AMBULANCE_SPEED_UNITS_PER_MIN = 1.5

def calculate_grid_travel_time(x1: float, y1: float, x2: float, y2: float) -> float:
    """
    Calculates the travel time between two grid coordinates.
    Uses Manhattan Distance to simulate navigating city blocks 
    (the standard A* heuristic for urban map routing).
    """
    distance = abs(x2 - x1) + abs(y2 - y1)
    travel_time_mins = distance / AMBULANCE_SPEED_UNITS_PER_MIN
    return travel_time_mins

def find_best_hospital(patient_x: float, patient_y: float, hospitals: List[Hospital]) -> Optional[Hospital]:
    """
    Core Routing Engine for the Healthcare Network.
    
    Instead of finding the closest geographic hospital, it calculates 
    the Predicted Time-to-Treatment (PTT) for every facility.
    
    PTT = Travel Time + Current APQ-h Queue Delay at the hospital.
    
    Returns the hospital that minimizes the PTT, actively balancing the network load.
    """
    if not hospitals:
        return None
        
    best_hospital = None
    lowest_ptt = float('inf')
    
    for hospital in hospitals:
        # Ignore hospitals with no available capacity to prevent catastrophic overload
        if hospital.available_beds <= 0:
            continue
            
        # 1. Calculate the dynamic travel time
        travel_time = calculate_grid_travel_time(patient_x, patient_y, hospital.location_x, hospital.location_y)
        
        # 2. Calculate the total Predicted Time-to-Treatment (PTT)
        ptt = travel_time + hospital.current_wait_time_mins
        
        # 3. Optimize and select the lowest PTT
        if ptt < lowest_ptt:
            lowest_ptt = ptt
            best_hospital = hospital
            
    return best_hospital