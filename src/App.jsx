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
    console.log("Mock Profiles Data:", mockProfiles);
    if (userPreferences) {
      localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
      console.log("User Preferences:", userPreferences);
      fetchCompatibility(userPreferences, mockProfiles);
    }
  }, [userPreferences]);

  useEffect(() => {
    console.log("Sorted Profiles Updated:", sortedProfiles);
  }, [sortedProfiles]);
  
  const fetchCompatibility = async (userProfile, candidates) => {
    const formattedUserProfile = {
      ...userProfile,
      budget: parseInt(userProfile.budget) || 0,  
    };

    console.log("Formatted User Profile:", formattedUserProfile);

    const formattedCandidates = candidates.map((p) => ({
      ...p.profile,
      age: parseInt(p.profile.age) || 0,
      budget: parseInt(p.profile.budget) || 0,
    }));

    console.log("Formatted Candidates:", formattedCandidates);

    try {
      const response = await fetch("http://127.0.0.1:8000/compute_compatibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_profile: formattedUserProfile,
          candidate_profiles: formattedCandidates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Data:", errorData);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      if (data?.all_matches?.length) {
        const mergedProfiles = candidates.map((profile) => {
          console.log("Profile Data:", profile);
          console.log("Match Data:", data.all_matches);

          const match = data.all_matches.find(
            (m) => typeof m.profile === "string" &&
                   m.profile.trim().toLowerCase() === profile.profile.name.trim().toLowerCase()
          );
          console.log("Match Found:", match);
          console.log("Profile Name:", profile.profile.name);
          console.log("Matched Names:", data.all_matches.map(m => m.profile));
          console.log("Raw Compatibility:", match ? match.compatibility : "No Match");

          const parsedCompatibility = parseFloat(match?.compatibility);
          console.log("Parsed Compatibility:", parsedCompatibility);
          return {
            profile: profile.profile,
            compatibility: !isNaN(parsedCompatibility) ? parsedCompatibility : 0,
            matchReasons: match ? match.matchReasons || [] : [],
          };
        });

        setSortedProfiles(
          mergedProfiles.sort((a, b) => b.compatibility - a.compatibility)
        );
      } else {
        setSortedProfiles(mockProfiles);
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
    if (sortedProfiles.length === 0) {
      console.log("Sorted profiles are empty.");
      return;
    }
    
    if (currentIndex + 1 < sortedProfiles.length) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      console.log("No more profiles available.");
    }
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
                    src={currentMatch.profile.imageUrl ?? "/default.jpg"} // Fallback Image
                    alt={currentMatch.profile.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-white">
                        {currentMatch.profile.name || "Unknown"}, {currentMatch.profile.age || "N/A"}
                      </h2>
                    <div className="bg-green-500 rounded-full px-3 py-1">
                      <span className="text-white font-semibold">
                        {currentMatch.compatibility ?? "N/A"}% Match
                      </span>
                    </div>
                    </div>
                    <p className="text-white/90">{currentMatch.profile.occupation || "No Occupation Info"}</p>
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
                 
                  <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Budget
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentMatch?.profile?.budget ? `$${currentMatch.profile.budget} per month` : "N/A"}
                  </p>
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
