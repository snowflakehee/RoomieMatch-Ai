from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

class Profile(BaseModel):
    name: str
    budget: float
    lifestyle: dict
    interests: list

class CompatibilityRequest(BaseModel):
    user_profile: Profile
    candidate_profiles: list[Profile]

@app.post("/compute_compatibility")
def compute_compatibility(data: CompatibilityRequest):
    scores = []
    user_text = f"Budget: {data.user_profile.budget}, Lifestyle: {data.user_profile.lifestyle}, Interests: {', '.join(data.user_profile.interests)}"
    user_embedding = model.encode(user_text, convert_to_tensor=True)

    for candidate in data.candidate_profiles:
        candidate_text = f"Budget: {candidate.budget}, Lifestyle: {candidate.lifestyle}, Interests: {', '.join(candidate.interests)}"
        candidate_embedding = model.encode(candidate_text, convert_to_tensor=True)

        similarity_score = util.pytorch_cos_sim(user_embedding, candidate_embedding).item()
        match_reasons = []

        if similarity_score > 0.7:
            match_reasons.append("Strong compatibility based on overall profile match")
        elif similarity_score > 0.4:
            match_reasons.append("Moderate compatibility with some common aspects")
        else:
            match_reasons.append("Low compatibility due to differing aspects")

        scores.append({
            "profile": candidate.name,
            "compatibility": round(similarity_score * 100),
            "matchReasons": match_reasons
        })

    return {"all_matches": scores}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("master:app", host="127.0.0.1", port=8000, reload=True)
