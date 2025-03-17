from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
model_name = "meta-llama/Meta-Llama-3-8B-Instruct"
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
    match = re.search(r"(\d{1,3})%", response) 
    if match:
        score = float(match.group(1))
    else:
        match = re.search(r"(\d+\.\d+|\d+)", response)  
        score = float(match.group(1)) if match else 0

    return max(0, min(score, 100))  

@app.post("/compute_compatibility")
def compute_compatibility(data: CompatibilityRequest):
    print(f"Received data: {data}")
    scores = []
    user_text = f"Budget: {data.user_profile.budget}, Lifestyle: {data.user_profile.lifestyle}, Interests: {', '.join(data.user_profile.interests)}"
    
    for candidate in data.candidate_profiles:
        candidate_text = f"Budget: {candidate.budget}, Lifestyle: {candidate.lifestyle}, Interests: {', '.join(candidate.interests)}"
        prompt = f"Compare user: {user_text} with candidate: {candidate_text}. Provide only a numerical compatibility score (0-100)."

        inputs = tokenizer(prompt, return_tensors="pt").to("cuda" if torch.cuda.is_available() else "cpu")
        output = model.generate(**inputs, max_new_tokens=5)
        compatibility_response = tokenizer.decode(output[0], skip_special_tokens=True)
        
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

