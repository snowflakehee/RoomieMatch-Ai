const mockProfiles = [
  {
    profile: {
      id: '1',
      name: 'Alex Chen',
      age: 25,
      occupation: 'Software Engineer',
      interests: ['hiking', 'photography', 'cooking'],
      lifestyle: {
        sleepSchedule: 'flexible',
        cleanliness: 'very neat',
        smoking: false,
        pets: true
      },
      location: 'San Francisco, CA',
      budget: 1500,
      bio: 'Tech enthusiast looking for a like-minded roommate. I enjoy cooking and maintaining a clean living space. I have a friendly cat named Luna.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
    },
    matchReasons: ['Similar cleanliness preferences', 'Compatible sleep schedules', 'Shared interests']
  },
  {
    profile: {
      id: '2',
      name: 'Sarah Johnson',
      age: 28,
      occupation: 'Graphic Designer',
      interests: ['art', 'yoga', 'travel'],
      lifestyle: {
        sleepSchedule: 'early',
        cleanliness: 'moderately neat',
        smoking: false,
        pets: false
      },
      location: 'San Francisco, CA',
      budget: 1800,
      bio: 'Creative professional seeking a quiet and clean living space. Early riser who enjoys morning yoga and weekend art projects.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
    },
    matchReasons: ['Budget alignment', 'Non-smoking preference', 'Similar location']
  },
  {
    profile: {
      id: '3',
      name: 'Michael Torres',
      age: 26,
      occupation: 'Marketing Manager',
      interests: ['music', 'fitness', 'movies'],
      lifestyle: {
        sleepSchedule: 'late',
        cleanliness: 'relaxed',
        smoking: false,
        pets: true
      },
      location: 'San Francisco, CA',
      budget: 1600,
      bio: 'Easy-going professional who loves music and staying active. Looking for a roommate who enjoys occasional movie nights and doesn\'t mind pets.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80'
    },
    matchReasons: ['Pet friendly', 'Similar interests', 'Compatible budget']
  }
];

export default mockProfiles;
