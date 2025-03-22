from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from huggingface_hub import InferenceClient
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = InferenceClient(
    api_key="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",
)

model_name = "meta-llama/Meta-Llama-3-8B-Instruct"

class Profile(BaseModel):
    name: str
    budget: float
    lifestyle: dict
    interests: list

class CompatibilityRequest(BaseModel):
    user_profile: Profile
    candidate_profiles: list[Profile]

def extract_score(response):
    match = re.search(r"(\d{1,3})%", response)
    if match:
        return max(0, min(float(match.group(1)), 100))
    match = re.search(r"(\d+\.\d+|\d+)", response)
    return max(0, min(float(match.group(1)) if match else 0, 100))

@app.post("/compute_compatibility")
def compute_compatibility(data: CompatibilityRequest):
    print(f"Received data: {data}")
    scores = []
    user_text = f"Budget: {data.user_profile.budget}, Lifestyle: {data.user_profile.lifestyle}, Interests: {', '.join(data.user_profile.interests)}"
    
    for candidate in data.candidate_profiles:
        candidate_text = f"Budget: {candidate.budget}, Lifestyle: {candidate.lifestyle}, Interests: {', '.join(candidate.interests)}"
        prompt = f"Compare user: {user_text} with candidate: {candidate_text}. Provide only a numerical compatibility score (0-100)."

        response = client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
        )
        
        score = extract_score(response.choices[0].message.content)
        scores.append({"profile": candidate.name, "compatibility": score})
    
    print(scores)
    return {"all_matches": scores}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("master:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("master:app", host="127.0.0.1", port=8000, reload=True)

