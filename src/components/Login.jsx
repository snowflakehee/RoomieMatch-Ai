import React, { useState } from 'react';
import mockProfiles from '../mockData'; // Import roommate profiles

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

  const calculateCompatibility = () => {
    let bestScore = 0;
    let bestProfile = null;

    mockProfiles.forEach((profile) => {
      let score = 0;

      if (userDetails.budget >= profile.profile.budget) score += 30;
      if (userDetails.lifestyle.sleepSchedule === profile.profile.lifestyle.sleepSchedule) score += 20;
      if (userDetails.lifestyle.cleanliness === profile.profile.lifestyle.cleanliness) score += 20;
      if (userDetails.lifestyle.smoking === profile.profile.lifestyle.smoking) score += 15;
      if (userDetails.lifestyle.pets === profile.profile.lifestyle.pets) score += 15;

      const commonInterests = userDetails.interests
        .split(',')
        .map((i) => i.trim())
        .filter((i) => profile.profile.interests.includes(i));
      score += commonInterests.length * 10;

      if (score > bestScore) {
        bestScore = score;
        bestProfile = profile;
      }
    });

    setBestMatch(bestProfile);
  };

  const handleSubmit = () => {
    setUserPreferences({ ...userDetails, isLoggedIn: true });
    calculateCompatibility();
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
