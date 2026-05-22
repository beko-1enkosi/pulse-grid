from fastapi.testclient import TestClient
from app.server import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_patient_intake_routing():
    # Clean, secure payload exactly as the frontend will send it
    payload = {
        "name": "Jane Doe",
        "age": 28,
        "primary_symptom": "Severe chest pain"
    }
    
    # Simulate patient at grid 10,10 (right next to H-1)
    response = client.post("/patients/intake?patient_x=10.0&patient_y=10.0", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    assert "P-" in data["id"]
    # We verify the backend correctly evaluated "Severe chest pain" to a 5
    assert data["triage_level"] == 5 
    assert data["assigned_hospital_id"] is not None