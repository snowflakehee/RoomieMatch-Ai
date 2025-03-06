from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = pipeline("feature-extraction", model="sentence-transformers/all-MiniLM-L6-v2")

class Profile(BaseModel):
    name: str
    budget: float
    lifestyle: dict
    interests: list

class CompatibilityRequest(BaseModel):
    user_profile: Profile
    candidate_profiles: list[Profile]

def cosine_similarity(vecA, vecB):
    vecA, vecB = np.array(vecA), np.array(vecB)

    if np.linalg.norm(vecA) == 0 or np.linalg.norm(vecB) == 0:
        return 0  # Avoid division by zero

    similarity = np.dot(vecA, vecB) / (np.linalg.norm(vecA) * np.linalg.norm(vecB))

    return 0 if np.isnan(similarity) else similarity  # Ensure no NaN values

def encode_text(text):
    return np.array(model(text)[0]).mean(axis=0)  # Average pooling

@app.post("/compute_compatibility")
def compute_compatibility(data: CompatibilityRequest):
    user = data.user_profile
    scores = []

    # Encode user's lifestyle and interests using the model
    user_lifestyle_vec = encode_text(" ".join(f"{k}: {v}" for k, v in user.lifestyle.items()))
    user_interests_vec = encode_text(" ".join(user.interests))

    for candidate in data.candidate_profiles:
        reasons = []
        compatibility_score = 0

        # Budget Score (20%)
        budget_diff = abs(candidate.budget - user.budget) / max(user.budget, 1)
        budget_score = 1 - min(budget_diff, 1)
        compatibility_score += budget_score * 20
        if budget_score > 0.8:
            reasons.append("Budget well-aligned")

        # Lifestyle Score (50%) using model embeddings
        candidate_lifestyle_vec = encode_text(" ".join(f"{k}: {v}" for k, v in candidate.lifestyle.items()))
        lifestyle_score = cosine_similarity(user_lifestyle_vec, candidate_lifestyle_vec)
        compatibility_score += lifestyle_score * 50
        if lifestyle_score > 0.6:
            reasons.append("Strong lifestyle match")

        # Interest Similarity (30%) using model embeddings
        candidate_interests_vec = encode_text(" ".join(candidate.interests))
        interest_score = cosine_similarity(user_interests_vec, candidate_interests_vec)
        compatibility_score += interest_score * 30
        if interest_score > 0:
            reasons.append(f"{int(interest_score * len(user.interests))} shared interests")

        scores.append({
            "profile": candidate.name,
            "compatibility": round(max(0, min(compatibility_score, 100))),
            "matchReasons": reasons,
        })

    return {"all_matches": scores}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("master:app", host="127.0.0.1", port=8000, reload=True)
