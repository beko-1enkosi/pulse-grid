from typing import Dict
from app.models.schemas import PatientCreate

CRITICAL_KEYWORDS = {
    "chest pain": 5, "numbness": 4, "difficulty breathing": 5, "anaphylaxis": 5,
    "slurred speech": 5, "stroke": 5, "bleeding": 4, "laceration": 3,
    "fracture": 2, "broken": 2, "fever": 2, "cough": 1, "vomiting": 2,
    "migraine": 2, "asthma": 4, "wheezing": 3, "unconscious": 5, "head injury": 4
}

def rule_based_explainable_inference(patient_data: PatientCreate) -> int:
    """
    Evaluates patient severity using explainable keyword matching 
    and demographic risk modifiers.
    """
    symptom_text = patient_data.primary_symptom.lower()
    base_score = 1  
    
    matched_weights = [weight for kw, weight in CRITICAL_KEYWORDS.items() if kw in symptom_text]
    if matched_weights:
        base_score = max(matched_weights)
        
    if base_score < 5:
        if patient_data.age >= 75 and base_score >= 3:
            base_score += 1  
        elif patient_data.age <= 5 and base_score >= 3:
            base_score += 1  

    return max(1, min(5, base_score))