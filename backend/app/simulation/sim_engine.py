import time
import random
import json
import urllib.request
from urllib.error import URLError

# The endpoint of our local FastAPI server
API_URL = "http://127.0.0.1:8000/patients/intake"

# Mock Data Generators
NAMES = ["Sipho", "Amara", "Thabo", "Chloe", "Farai", "Zanele", "Liam", "Fatima", "Kopano", "David"]
SURNAMES = ["Khumalo", "Okafor", "Mokoena", "van der Merwe", "Johnston", "Sithole", "Smith", "Patel", "Lekalake", "Ndlovu"]
SYMPTOMS = [
    ("Severe chest pain, left arm numbness", 5),
    ("Deep laceration on forearm, active bleeding", 4),
    ("Mild chronic cough, prescription refill", 1),
    ("High fever, lethargy", 3),
    ("Suspected fractured ankle from a fall", 2),
    ("Anaphylaxis, severe difficulty breathing", 5),
    ("Mild sore throat and body aches", 1),
    ("Continuous vomiting, severe dehydration", 3)
]

def generate_random_patient():
    """Generates a realistic emergency profile."""
    name = f"{random.choice(NAMES)} {random.choice(SURNAMES)}"
    symptom, default_triage = random.choice(SYMPTOMS)
    age = random.randint(5, 85)
    
    return {
        "name": name,
        "age": age,
        "primary_symptom": symptom,
        "triage_level": default_triage
    }

def send_patient_to_api(patient_data, x_coord, y_coord):
    """Fires the patient data to the Aegis Health API via HTTP POST."""
    url = f"{API_URL}?patient_x={x_coord}&patient_y={y_coord}"
    headers = {'Content-Type': 'application/json'}
    data = json.dumps(patient_data).encode('utf-8')
    
    try:
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            print(f"[SUCCESS] {result['name']} (Level {result['triage_level']}) -> Routed to {result['assigned_hospital_id']}")
    except URLError as e:
        print(f"[ERROR] Could not connect to API. Is the server running? {e}")

def run_standard_simulation(interval_seconds=4):
    """Simulates standard city traffic, spawning one patient every few seconds."""
    print(f"\n--- Starting Aegis Health City Simulation (1 event / {interval_seconds}s) ---")
    print("Press Ctrl+C to stop the simulation.\n")
    try:
        while True:
            patient = generate_random_patient()
            # Randomize grid location across a 50x50 map
            x_coord = round(random.uniform(0, 50), 1)
            y_coord = round(random.uniform(0, 50), 1)
            
            send_patient_to_api(patient, x_coord, y_coord)
            time.sleep(interval_seconds)
    except KeyboardInterrupt:
        print("\nSimulation paused.")

def trigger_mass_casualty_event(num_patients=50):
    """
    The Hackathon Flex: Instantly floods the network with critical patients 
    from a single geographic location to prove the load balancer works.
    """
    print(f"\n!!! TRIGGERING MASS CASUALTY EVENT: {num_patients} PATIENTS !!!\n")
    event_x = 25.0
    event_y = 25.0
    
    for _ in range(num_patients):
        patient = generate_random_patient()
        # Overwrite symptoms for the disaster scenario
        patient["primary_symptom"] = "Severe trauma from localized disaster"
        patient["triage_level"] = 5
        
        send_patient_to_api(patient, event_x, event_y)
        time.sleep(0.1)  # Micro-delay to prevent crashing local sockets

if __name__ == "__main__":
    print("==========================================")
    print("  AEGIS HEALTH: DISCRETE-EVENT SIMULATOR  ")
    print("==========================================")
    print("1. Standard Traffic Simulation (Continuous)")
    print("2. Mass Casualty Stress Test (Burst)")
    
    choice = input("\nSelect simulation mode (1 or 2): ")
    
    if choice == '1':
        run_standard_simulation(interval_seconds=3)
    elif choice == '2':
        trigger_mass_casualty_event(50)
    else:
        print("Invalid choice. Exiting.")