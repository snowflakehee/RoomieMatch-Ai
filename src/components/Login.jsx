import React, { useState } from 'react';

const Login = ({ setUserPreferences }) => {
  const [step, setStep] = useState(1);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    occupation: '',
    budget: '',
    lifestyle: {
      sleepSchedule: '',
      cleanliness: '',
      smoking: false,
      pets: false,
    },
    interests: '',
    about: '',
  });
  const [bestMatch, setBestMatch] = useState(null);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in userDetails.lifestyle) {
      setUserDetails({
        ...userDetails,
        lifestyle: { ...userDetails.lifestyle, [name]: type === 'checkbox' ? checked : value },
      });
    } else {
      setUserDetails({ ...userDetails, [name]: value });
    }
  };

  

  const encodeLifestyle = (lifestyle) => ({
    sleepSchedule: { early: 1, flexible: 2, late: 3 }[lifestyle.sleepSchedule] || 2,
    cleanliness: { "very neat": 3, "moderately neat": 2, relaxed: 1 }[lifestyle.cleanliness] || 2,
    smoking: lifestyle.smoking ? 1 : 0,
    pets: lifestyle.pets ? 1 : 0,
  });
  
  const computeSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
    return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
  };
  
  const tokenizeInterests = (interests) => {
    if (!Array.isArray(interests)) return [];
    return interests.map((interest) => nlp(interest.toLowerCase()).terms().out("array"));
  };
  
  
const aiCompatibility = (profile, userPreferences) => {
    if (!userPreferences) return { profile, compatibility: 0, matchReasons: [] };
  
    let compatibilityScore = 0;
    const reasons = [];
  
    const profileInterests = Array.isArray(profile.interests) ? profile.interests : [];
    const userInterests = Array.isArray(userPreferences.interests) ? userPreferences.interests : [];
  
    // Budget Score (20%)
    const budgetDiff = Math.abs(profile.budget - userPreferences.budget) / userPreferences.budget;
    const budgetScore = 1 - Math.min(budgetDiff, 1);
    compatibilityScore += budgetScore * 20;
    if (budgetScore > 0.8) reasons.push("Budget well-aligned");
  
    // Lifestyle Score (50%)
    const profileVec = Object.values(encodeLifestyle(profile.lifestyle));
    const userVec = Object.values(encodeLifestyle(userPreferences.lifestyle));
    const lifestyleScore = computeSimilarity(profileVec, userVec);
    compatibilityScore += lifestyleScore * 50;
    if (lifestyleScore > 0.6) reasons.push("Strong lifestyle match");
  
    // Interest Similarity (30%)
    const interestsVec = tokenizeInterests(profileInterests);
    const userInterestsVec = tokenizeInterests(userInterests);
    const sharedInterests = interestsVec.flat().filter((word) => userInterestsVec.flat().includes(word)).length;
    const interestScore = sharedInterests / Math.max(profileInterests.length, 1);
    compatibilityScore += interestScore * 30;
    if (sharedInterests > 0) reasons.push(`${sharedInterests} shared interests`);

    return { profile, compatibility: Math.round(compatibilityScore), matchReasons: reasons };
  };


  const handleSubmit = () => {
    const formattedInterests = userDetails.interests.split(',').map(interest => interest.trim());
    setUserPreferences({ ...userDetails, interests: formattedInterests, isLoggedIn: true });
    const bestMatch = aiCompatibility({ ...userDetails, interests: formattedInterests });
    setBestMatch(bestMatch);
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {step === 1 ? 'Enter Your Name, Email & Occupation' : step === 2 ? 'Set Your Budget & Lifestyle' : 'Enter Your Interests & About You'}
        </h2>

        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" value={userDetails.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your name" />

            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={userDetails.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your email" />

            <label className="block text-sm font-medium text-gray-700">Occupation</label>
            <input type="text" name="occupation" value={userDetails.occupation} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your profession" />
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <input type="number" name="budget" value={userDetails.budget} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your budget" />

            <label className="block text-sm font-medium text-gray-700">Sleep Schedule</label>
            <select name="sleepSchedule" value={userDetails.lifestyle.sleepSchedule} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="">Select your sleep schedule</option>
              <option value="early">Early</option>
              <option value="late">Late</option>
              <option value="flexible">Flexible</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">Cleanliness</label>
            <select name="cleanliness" value={userDetails.lifestyle.cleanliness} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
              <option value="">Select cleanliness preference</option>
              <option value="very neat">Very Neat</option>
              <option value="moderately neat">Moderately Neat</option>
              <option value="relaxed">Relaxed</option>
            </select>

            <label className="block text-sm font-medium text-gray-700">Smoking</label>
            <input type="checkbox" name="smoking" checked={userDetails.lifestyle.smoking} onChange={handleChange} />
            <span className="ml-2">Do you smoke?</span>

            <label className="block text-sm font-medium text-gray-700">Pets</label>
            <input type="checkbox" name="pets" checked={userDetails.lifestyle.pets} onChange={handleChange} />
            <span className="ml-2">Do you have pets?</span>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Interests</label>
            <input type="text" name="interests" value={userDetails.interests} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your interests, separated by commas" />

            <label className="block text-sm font-medium text-gray-700">About You</label>
            <textarea name="about" value={userDetails.about} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Tell us about yourself"></textarea>
          </div>
        )}

        <div className="flex justify-between items-center">
          {step > 1 && <button onClick={handlePrev} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Previous</button>}
          {step < 3 ? (
            <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Next</button>
          ) : (
            <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Submit</button>
          )}
        </div>

        {bestMatch && (
          <div className="mt-6 p-4 bg-gray-200 rounded-md">
            <h3 className="text-lg font-semibold">Best Match: {bestMatch.profile.name}</h3>
            <p>Compatibility: {bestMatch.compatibility}%</p>
            <p>Shared Interests: {bestMatch.matchReasons.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
