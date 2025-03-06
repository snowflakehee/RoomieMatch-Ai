// import React, { useState, useEffect } from 'react';
// import mockProfiles from './mockData';
// import { Home, Search, MessageCircle, UserCircle, Heart, X } from 'lucide-react';
// import Login from './components/Login';
// import nlp from "compromise";

// function App() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [matches, setMatches] = useState([]);
//   const [showContactDialog, setShowContactDialog] = useState(false);
//   const [userPreferences, setUserPreferences] = useState(() => {
//     const saved = localStorage.getItem('userPreferences');
//     return saved ? JSON.parse(saved) : null;
//   });

//   useEffect(() => {
//     if (userPreferences) {
//       localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
//     }
//   }, [userPreferences]);

//   const handleLogout = () => {
//     setUserPreferences(null);
//     localStorage.removeItem('userPreferences');
//   };


//   const encodeLifestyle = (lifestyle) => ({
//     sleepSchedule: { early: 1, flexible: 2, late: 3 }[lifestyle.sleepSchedule] || 2,
//     cleanliness: { "very neat": 3, "moderately neat": 2, relaxed: 1 }[lifestyle.cleanliness] || 2,
//     smoking: lifestyle.smoking ? 1 : 0,
//     pets: lifestyle.pets ? 1 : 0,
//   });
  
//   const computeSimilarity = (vecA, vecB) => {
//     const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
//     const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
//     const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
//     return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
//   };
  
//   const tokenizeInterests = (interests) => {
//     if (!Array.isArray(interests)) return [];
//     return interests.map((interest) => nlp(interest.toLowerCase()).terms().out("array"));
//   };
  
  
// const aiCompatibility = (profile, userPreferences) => {
//     if (!userPreferences) return { profile, compatibility: 0, matchReasons: [] };
  
//     let compatibilityScore = 0;
//     const reasons = [];
  
//     const profileInterests = Array.isArray(profile.interests) ? profile.interests : [];
//     const userInterests = Array.isArray(userPreferences.interests) ? userPreferences.interests : [];
  
//     // Budget Score (20%)
//     const budgetDiff = Math.abs(profile.budget - userPreferences.budget) / userPreferences.budget;
//     const budgetScore = 1 - Math.min(budgetDiff, 1);
//     compatibilityScore += budgetScore * 20;
//     if (budgetScore > 0.8) reasons.push("Budget well-aligned");
  
//     // Lifestyle Score (50%)
//     const profileVec = Object.values(encodeLifestyle(profile.lifestyle));
//     const userVec = Object.values(encodeLifestyle(userPreferences.lifestyle));
//     const lifestyleScore = computeSimilarity(profileVec, userVec);
//     compatibilityScore += lifestyleScore * 50;
//     if (lifestyleScore > 0.6) reasons.push("Strong lifestyle match");
  
//     // Interest Similarity (30%)
//     const interestsVec = tokenizeInterests(profileInterests);
//     const userInterestsVec = tokenizeInterests(userInterests);
//     const sharedInterests = interestsVec.flat().filter((word) => userInterestsVec.flat().includes(word)).length;
//     const interestScore = sharedInterests / Math.max(profileInterests.length, 1);
//     compatibilityScore += interestScore * 30;
//     if (sharedInterests > 0) reasons.push(`${sharedInterests} shared interests`);

//     return { profile, compatibility: Math.round(compatibilityScore), matchReasons: reasons };
//   };
  
  
//   const sortedProfiles = mockProfiles.map((p) => aiCompatibility(p.profile, userPreferences)).sort((a, b) => b.compatibility - a.compatibility);

//   const currentMatch = sortedProfiles[currentIndex];

//   const handleLike = () => {
//     setShowContactDialog(true);
//   };

//   const handleConfirmContact = () => {
//     setMatches([...matches, currentMatch.profile.id]);
//     setShowContactDialog(false);
//     handleNext();
//   };

//   const handlePass = () => {
//     handleNext();
//   };

//   const handleNext = () => {
//     setCurrentIndex(prevIndex => prevIndex + 1);
//   };

//   if (!userPreferences?.isLoggedIn) {
//     return <Login setUserPreferences={setUserPreferences}/>;
//   }

//   if (!currentMatch || currentIndex >= sortedProfiles.length) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-xl shadow-lg text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">No More Profiles</h2>
//           <p className="text-gray-600">You've viewed all available matches!</p>
//           {matches.length > 0 && (
//             <div className="mt-4">
//               <p className="text-green-600 font-semibold">
//                 You matched with {matches.length} potential roommates!
//               </p>
//             </div>
//           )}
//           <button
//             onClick={handleLogout}
//             className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-5xl mx-auto px-4">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex space-x-8">
//               <Home className="w-6 h-6 text-green-600" />
//               <Search className="w-6 h-6 text-gray-400" />
//               <MessageCircle className="w-6 h-6 text-gray-400" />
//               <UserCircle className="w-6 h-6 text-gray-400" />
//             </div>
//             <div className="text-green-600 font-semibold">
//               RoomieMatch AI
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto px-4 py-8">
//         <div className="flex flex-col items-center">
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
//             <div className="relative h-96">
//               <img
//                 src={currentMatch.profile.imageUrl}
//                 alt={currentMatch.profile.name}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
//                 <div className="flex justify-between items-end">
//                   <div>
//                     <h2 className="text-2xl font-bold text-white">
//                       {currentMatch.profile.name}, {currentMatch.profile.age}
//                     </h2>
//                     <p className="text-white/90">{currentMatch.profile.occupation}</p>
//                   </div>
//                   <div className="bg-green-500 rounded-full px-3 py-1">
//                     <span className="text-white font-semibold">
//                       {currentMatch.compatibility}% Match
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="mb-4">
//                 <h3 className="font-semibold text-gray-700 mb-2">About</h3>
//                 <p className="text-gray-600">{currentMatch.profile.bio}</p>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-semibold text-gray-700 mb-2">Lifestyle</h3>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="text-sm text-gray-600">
//                     <span className="font-medium">Sleep:</span> {currentMatch.profile.lifestyle.sleepSchedule}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <span className="font-medium">Cleanliness:</span> {currentMatch.profile.lifestyle.cleanliness}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <span className="font-medium">Smoking:</span> {currentMatch.profile.lifestyle.smoking ? 'Yes' : 'No'}
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     <span className="font-medium">Pets:</span> {currentMatch.profile.lifestyle.pets ? 'Yes' : 'No'}
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-semibold text-gray-700 mb-2">Match Reasons</h3>
//                 <ul className="list-disc list-inside text-sm text-gray-600">
//                   {currentMatch.matchReasons.map((reason, index) => (
//                     <li key={index}>{reason}</li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="mb-4">
//                 <h3 className="font-semibold text-gray-700 mb-2">Budget</h3>
//                 <p className="text-gray-600">${currentMatch.profile.budget}/month</p>
//               </div>

//               <div className="flex justify-center gap-4 mt-6">
//                 <button
//                   onClick={handlePass}
//                   className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                 >
//                   <X className="w-6 h-6 text-gray-600" />
//                 </button>
//                 <button
//                   onClick={handleLike}
//                   className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
//                 >
//                   <Heart className="w-6 h-6 text-green-600" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showContactDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">
//               Contact {currentMatch.profile.name}?
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Would you like to initiate contact with {currentMatch.profile.name}? This will add them to your matches.
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setShowContactDialog(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmContact}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Confirm Contact
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import mockProfiles from "./mockData";
import {
  Home,
  Search,
  MessageCircle,
  UserCircle,
  Heart,
  X,
} from "lucide-react";
import Login from "./components/Login";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [userPreferences, setUserPreferences] = useState(() => {
    const saved = localStorage.getItem("userPreferences");
    return saved ? JSON.parse(saved) : null;
  });

  const [sortedProfiles, setSortedProfiles] = useState([]);

  useEffect(() => {
    if (userPreferences) {
      localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
      fetchCompatibility(userPreferences, mockProfiles);
    }
  }, [userPreferences]);

const fetchCompatibility = async (userProfile, candidates) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/compute_compatibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_profile: userProfile,
        candidate_profiles: candidates.map((p) => p.profile),
      }),
    });

    const data = await response.json();
    console.log("API Response:", data); 

    if (data.all_matches) {
      const mergedProfiles = candidates.map((profile) => {
        const match = data.all_matches.find((m) => m.profile === profile.profile.name);

        return {
          profile: {
            name: profile.profile.name,
            age: profile.profile.age || "N/A",
            occupation: profile.profile.occupation || "Unknown",
            imageUrl: profile.profile.imageUrl || "/default.jpg",
            bio: profile.profile.bio || "No bio available.",
          },
          compatibility: match ? match.compatibility : 0,
          matchReasons: match ? match.matchReasons : [],
        };
      });

      console.log("Merged Profiles:", mergedProfiles);

      setSortedProfiles(mergedProfiles.sort((a, b) => b.compatibility - a.compatibility));
    }
  } catch (error) {
    console.error("Error fetching compatibility:", error);
    setSortedProfiles(mockProfiles); 
  }
};

const handleLogout = () => {
  setUserPreferences(null);
  localStorage.removeItem("userPreferences"); 
  setSortedProfiles([]); 
  setMatches([]); 
  setCurrentIndex(0); 
};



  const currentMatch = sortedProfiles[currentIndex];

  const handleLike = () => {
    setShowContactDialog(true);
  };

  const handleConfirmContact = () => {
    setMatches([...matches, currentMatch.profile.id]);
    setShowContactDialog(false);
    handleNext();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  if (!userPreferences?.isLoggedIn) {
    return <Login setUserPreferences={setUserPreferences} />;
  }

  if (!currentMatch || currentIndex >= sortedProfiles.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No More Profiles
          </h2>
          <p className="text-gray-600">You've viewed all available matches!</p>
          {matches.length > 0 && (
            <div className="mt-4">
              <p className="text-green-600 font-semibold">
                You matched with {matches.length} potential roommates!
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              <Home className="w-6 h-6 text-green-600" />
              <Search className="w-6 h-6 text-gray-400" />
              <MessageCircle className="w-6 h-6 text-gray-400" />
              <UserCircle className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-green-600 font-semibold">RoomieMatch AI</div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
            {currentMatch?.profile ? (
              <>
                <div className="relative h-96">
                  <img
                    src={currentMatch.profile.imageUrl || "/default.jpg"} // Fallback Image
                    alt={currentMatch.profile.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {currentMatch.profile.name || "Unknown"},{" "}
                          {currentMatch.profile.age || "N/A"}
                        </h2>
                        <p className="text-white/90">
                          {currentMatch.profile.occupation ||
                            "No Occupation Info"}
                        </p>
                      </div>
                      <div className="bg-green-500 rounded-full px-3 py-1">
                        <span className="text-white font-semibold">
                          {currentMatch.compatibility || 0}% Match
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">About</h3>
                    <p className="text-gray-600">
                      {currentMatch.profile.bio || "No bio available."}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Match Reasons
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {currentMatch.matchReasons?.length > 0 ? (
                        currentMatch.matchReasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))
                      ) : (
                        <li>No specific reasons provided.</li>
                      )}
                    </ul>
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={handleNext}
                      className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                    <button
                      onClick={handleLike}
                      className="p-4 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                    >
                      <Heart className="w-6 h-6 text-green-600" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Profile Found</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showContactDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Contact {currentMatch?.profile?.name}?
            </h3>
            <p className="text-gray-600 mb-6">
              Would you like to initiate contact with{" "}
              {currentMatch?.profile?.name}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowContactDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmContact}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
