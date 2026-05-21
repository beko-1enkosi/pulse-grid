from typing import Dict
from app.models.schemas import PatientCreate

# Critical clinical keywords mapped to risk weights
CRITICAL_KEYWORDS = {
    "chest pain": 5, "numbness": 4, "difficulty breathing": 5, "anaphylaxis": 5,
    "slurred speech": 5, "stroke": 5, "bleeding": 4, "laceration": 3,
    "fracture": 2, "broken": 2, "fever": 2, "cough": 1, "vomiting": 2,
    "migraine": 2, "asthma": 4, "wheezing": 3, "unconscious": 5, "head injury": 4
}

def evaluate_initial_triage(patient_data: PatientCreate) -> int:
    """
    Analyzes a PatientCreate request and returns an optimized triage level (1-5).
    Combines symptom keyword matching with age-based risk factor adjustments.
    """
    symptom_text = patient_data.primary_symptom.lower()
    base_score = 1  # Default to non-urgent
    
    # 1. Keyword Weight Evaluation
    matched_weights = [weight for kw, weight in CRITICAL_KEYWORDS.items() if kw in symptom_text]
    if matched_weights:
        base_score = max(matched_weights)
        
    # 2. High-Risk Demographic Modifiers (Age-based adjustments)
    # If the case is already critical (5), we leave it. Otherwise, vulnerable ages bump priority.
    if base_score < 5:
        if patient_data.age >= 75 and base_score >= 3:
            base_score += 1  # Elderly patients with moderate symptoms get prioritized
        elif patient_data.age <= 5 and base_score >= 3:
            base_score += 1  # Infants/toddlers with moderate symptoms get prioritized

    # Bound the score strictly between 1 and 5
    final_triage_level = max(1, min(5, base_score))
    return final_triage_level