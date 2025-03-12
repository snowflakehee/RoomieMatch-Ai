from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import re
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir="D:/huggingface_cache")
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto", cache_dir="D:/huggingface_cache")

class Profile(BaseModel):
    name: str
    budget: float
    lifestyle: dict
    interests: list

class CompatibilityRequest(BaseModel):
    user_profile: Profile
    candidate_profiles: list[Profile]

def extract_score(response: str):
    match = re.search(r"(\d{1,3})%", response)  # Extract percentage
    if match:
        score = float(match.group(1))
    else:
        match = re.search(r"(\d+\.\d+|\d+)", response)  # Extract any number
        score = float(match.group(1)) if match else random.uniform(30, 80)  # Fallback range

    return max(0, min(score, 100))  # Clamp between 0-100

@app.post("/compute_compatibility")
def compute_compatibility(data: CompatibilityRequest):
    print(f"Received data: {data}")
    scores = []
    user_text = f"Budget: {data.user_profile.budget}, Lifestyle: {data.user_profile.lifestyle}, Interests: {', '.join(data.user_profile.interests)}"
    
    for candidate in data.candidate_profiles:
        candidate_text = f"Budget: {candidate.budget}, Lifestyle: {candidate.lifestyle}, Interests: {', '.join(candidate.interests)}"
        prompt = (f"User Profile:\n{user_text}\n\n"
                  f"Candidate Profile:\n{candidate_text}\n\n"
                  f"Provide ONLY a numerical compatibility score from 0 to 100. No explanation, only a number.")

        inputs = tokenizer(prompt, return_tensors="pt").to("cuda" if torch.cuda.is_available() else "cpu")
        
        output = model.generate(
            **inputs, 
            max_new_tokens=5,  
            temperature=0.8,  # Increase randomness
            top_k=40,  
            penalty_alpha=0.6,  # Encourage diverse outputs
            return_dict_in_generate=True
        )

        compatibility_response = tokenizer.decode(output.sequences[0], skip_special_tokens=True).strip()
        score = extract_score(compatibility_response)
        
        scores.append({
            "profile": candidate.name,
            "compatibility": score
        })
    
    print(scores)
    return {"all_matches": scores}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("master:app", host="127.0.0.1", port=8000, reload=True)
