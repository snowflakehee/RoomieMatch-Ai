const mockProfiles = [
  {
    profile: {
      id: "1",
      name: "Alex Chen",
      age: 25,
      occupation: "Software Engineer",
      interests: ["hiking", "photography", "cooking"],
      lifestyle: {
        sleepSchedule: "flexible",
        cleanliness: "very neat",
        smoking: false,
        pets: true,
      },
      location: "San Francisco, CA",
      budget: 1500,
      bio: "Tech enthusiast looking for a like-minded roommate. I enjoy cooking and maintaining a clean living space. I have a friendly cat named Luna.",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    },
    matchReasons: [
      "Similar cleanliness preferences",
      "Compatible sleep schedules",
      "Shared interests",
    ],
  },
  {
    profile: {
      id: "2",
      name: "Sarah Johnson",
      age: 28,
      occupation: "Graphic Designer",
      interests: ["art", "yoga", "travel"],
      lifestyle: {
        sleepSchedule: "early",
        cleanliness: "moderately neat",
        smoking: false,
        pets: false,
      },
      location: "San Francisco, CA",
      budget: 1800,
      bio: "Creative professional seeking a quiet and clean living space. Early riser who enjoys morning yoga and weekend art projects.",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    },
    matchReasons: [
      "Budget alignment",
      "Non-smoking preference",
      "Similar location",
    ],
  },
  {
    profile: {
      id: "3",
      name: "Michael Torres",
      age: 26,
      occupation: "Marketing Manager",
      interests: ["music", "fitness", "movies"],
      lifestyle: {
        sleepSchedule: "late",
        cleanliness: "relaxed",
        smoking: false,
        pets: true,
      },
      location: "San Francisco, CA",
      budget: 1600,
      bio: "Easy-going professional who loves music and staying active. Looking for a roommate who enjoys occasional movie nights and doesn't mind pets.",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
    },
    matchReasons: ["Pet friendly", "Similar interests", "Compatible budget"],
  },
  {
    profile: {
      id: "4",
      name: "Jessica Lee",
      age: 24,
      occupation: "Nurse",
      interests: ["reading", "meditation", "cooking"],
      lifestyle: {
        sleepSchedule: "early",
        cleanliness: "very neat",
        smoking: false,
        pets: false,
      },
      location: "Los Angeles, CA",
      budget: 1400,
      bio: "Friendly nurse who enjoys peaceful evenings. I prefer a clean and quiet environment with a respectful roommate.",
      imageUrl:
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&q=80",
    },
    matchReasons: ["Early riser", "Non-smoking", "Neat lifestyle"],
  },
  {
    profile: {
      id: "5",
      name: "David Kim",
      age: 27,
      occupation: "Financial Analyst",
      interests: ["investing", "sports", "travel"],
      lifestyle: {
        sleepSchedule: "flexible",
        cleanliness: "moderately neat",
        smoking: false,
        pets: false,
      },
      location: "New York, NY",
      budget: 2000,
      bio: "Finance professional looking for a responsible roommate. I enjoy discussing investments and staying active on weekends.",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    },
    matchReasons: [
      "Financial stability",
      "Shared interest in travel",
      "Flexible schedule",
    ],
  },
  {
    profile: {
      id: "6",
      name: "Emily Davis",
      age: 26,
      occupation: "Teacher",
      interests: ["volunteering", "reading", "cooking"],
      lifestyle: {
        sleepSchedule: "early",
        cleanliness: "very neat",
        smoking: false,
        pets: true,
      },
      location: "Chicago, IL",
      budget: 1200,
      bio: "Passionate educator who loves a structured and clean home environment. Looking for a kind and respectful roommate.",
      imageUrl:
        "https://images.unsplash.com/photo-1557053910-d9eadeed1c58?auto=format&fit=crop&q=80",
    },
    matchReasons: [
      "Clean and structured home",
      "Non-smoking",
      "Friendly with pets",
    ],
  },
];

export default mockProfiles;
