from datetime import datetime, timezone, timedelta
from app.models.schemas import Patient
from app.core.queue_manager import calculate_apqh_priority

def test_priority_increases_over_time():
    now = datetime.now(timezone.utc)
    # Simulate a Level 3 patient who arrived 30 minutes ago
    patient = Patient(
        id="P-TEST", name="John", age=40, primary_symptom="Pain", 
        triage_level=3, arrival_time=now - timedelta(minutes=30)
    )
    
    priority = calculate_apqh_priority(patient, now)
    
    # Base urgency for Level 3 is 60. Alpha is 1.0. 
    # 60 + (1.0 * 30 mins) = 90.0
    assert priority == 90.0