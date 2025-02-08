export const UserProfile = {
  id: '',
  name: '',
  age: 0,
  occupation: '',
  interests: [],
  lifestyle: {
    sleepSchedule: '',
    cleanliness: '',
    smoking: false,
    pets: false
  },
  location: '',
  budget: 0,
  bio: '',
  imageUrl: ''
};

export const MatchResult = {
  profile: UserProfile,
  compatibility: 0,
  matchReasons: []
};

export const UserPreferences = {
  ...UserProfile,
  isLoggedIn: false
};
