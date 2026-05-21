from app.models.schemas import PatientCreate
from app.core.triage_logic import evaluate_initial_triage

def test_triage_critical_stroke():
    patient = PatientCreate(name="Test", age=65, primary_symptom="slurred speech and facial drooping", triage_level=1)
    score = evaluate_initial_triage(patient)
    assert score == 5  # Should automatically upgrade to 5 based on keywords

def test_triage_minor_cough():
    patient = PatientCreate(name="Test", age=30, primary_symptom="mild cough", triage_level=1)
    score = evaluate_initial_triage(patient)
    assert score == 1  # Should remain 1