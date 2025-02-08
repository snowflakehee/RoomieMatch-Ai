import React from 'react';

function ProfileCard({ profile, compatibility, matchReasons }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
      <div className="relative h-96">
        <img
          src={profile.imageUrl}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {profile.name}, {profile.age}
              </h2>
              <p className="text-white/90">{profile.occupation}</p>
            </div>
            <div className="bg-green-500 rounded-full px-3 py-1">
              <span className="text-white font-semibold">
                {compatibility}% Match
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">About</h3>
          <p className="text-gray-600">{profile.bio}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Lifestyle</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Sleep:</span> {profile.lifestyle.sleepSchedule}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Cleanliness:</span> {profile.lifestyle.cleanliness}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Smoking:</span> {profile.lifestyle.smoking ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Pets:</span> {profile.lifestyle.pets ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Match Reasons</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {matchReasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Budget</h3>
          <p className="text-gray-600">${profile.budget}/month</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
