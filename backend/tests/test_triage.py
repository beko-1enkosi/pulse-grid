from app.models.schemas import PatientCreate
from app.core.triage_logic import rule_based_explainable_inference

def test_triage_critical_stroke():
    # Notice we no longer pass 'triage_level' because the AI handles it
    patient = PatientCreate(name="Test", age=65, primary_symptom="slurred speech and facial drooping")
    score = rule_based_explainable_inference(patient)
    assert score == 5  # Should automatically upgrade to 5 based on keywords

def test_triage_minor_cough():
    patient = PatientCreate(name="Test", age=30, primary_symptom="mild cough")
    score = rule_based_explainable_inference(patient)
    assert score == 1  # Should remain 1