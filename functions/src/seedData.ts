/**
 * Seed Data for Firebase Emulators
 * This file contains sample data for testing the application
 */

export interface SeedUser {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  photoURL: string;
  userType: 'pm' | 'mentor' | 'mentee';
  onboardingCompleted: boolean;
  bio?: string;
  technologies?: Array<{ name: string; level: string }>;
  yearsOfExperience?: number;
  rating?: number;
  totalMentees?: number;
  department?: string;
  location?: string;
}

export const seedUsers: SeedUser[] = [
  // Project Managers
  {
    uid: 'pm-001',
    email: 'pm1@bairesdev.com',
    password: 'password123',
    displayName: 'Sarah Johnson',
    photoURL: 'https://i.pravatar.cc/150?img=1',
    userType: 'pm',
    onboardingCompleted: true,
    bio: 'Senior Project Manager with 10+ years of experience managing tech teams',
    department: 'Engineering',
    location: 'San Francisco, CA',
  },
  {
    uid: 'pm-002',
    email: 'pm2@bairesdev.com',
    password: 'password123',
    displayName: 'Michael Chen',
    photoURL: 'https://i.pravatar.cc/150?img=12',
    userType: 'pm',
    onboardingCompleted: true,
    bio: 'Agile PM specializing in cross-functional team coordination',
    department: 'Product',
    location: 'New York, NY',
  },

  // Mentors
  {
    uid: 'mentor-001',
    email: 'mentor1@bairesdev.com',
    password: 'password123',
    displayName: 'Dr. Emily Rodriguez',
    photoURL: 'https://i.pravatar.cc/150?img=5',
    userType: 'mentor',
    onboardingCompleted: true,
    bio: 'Full-stack architect with deep expertise in React and Node.js. Passionate about teaching clean code principles.',
    yearsOfExperience: 12,
    rating: 4.9,
    totalMentees: 23,
    technologies: [
      { name: 'React', level: 'expert' },
      { name: 'Node.js', level: 'expert' },
      { name: 'TypeScript', level: 'expert' },
      { name: 'Database Design', level: 'advanced' },
      { name: 'Git/DevOps', level: 'advanced' },
    ],
    location: 'Austin, TX',
  },
  {
    uid: 'mentor-002',
    email: 'mentor2@bairesdev.com',
    password: 'password123',
    displayName: 'James Wilson',
    photoURL: 'https://i.pravatar.cc/150?img=13',
    userType: 'mentor',
    onboardingCompleted: true,
    bio: 'Cloud Solutions Architect specializing in AWS and microservices. Love helping teams scale their applications.',
    yearsOfExperience: 10,
    rating: 4.8,
    totalMentees: 18,
    technologies: [
      { name: 'Cloud/AWS', level: 'expert' },
      { name: 'Python', level: 'expert' },
      { name: 'Database Design', level: 'expert' },
      { name: 'Git/DevOps', level: 'advanced' },
      { name: 'Kubernetes', level: 'advanced' },
    ],
    location: 'Seattle, WA',
  },
  {
    uid: 'mentor-003',
    email: 'mentor3@bairesdev.com',
    password: 'password123',
    displayName: 'Maria Garcia',
    photoURL: 'https://i.pravatar.cc/150?img=9',
    userType: 'mentor',
    onboardingCompleted: true,
    bio: 'Mobile development expert with focus on React Native and Flutter. Experienced in building production apps.',
    yearsOfExperience: 8,
    rating: 4.7,
    totalMentees: 15,
    technologies: [
      { name: 'Mobile Dev', level: 'expert' },
      { name: 'React', level: 'expert' },
      { name: 'Flutter', level: 'advanced' },
      { name: 'React Native', level: 'expert' },
      { name: 'Git/DevOps', level: 'intermediate' },
    ],
    location: 'Miami, FL',
  },
  {
    uid: 'mentor-004',
    email: 'mentor4@bairesdev.com',
    password: 'password123',
    displayName: 'David Kim',
    photoURL: 'https://i.pravatar.cc/150?img=14',
    userType: 'mentor',
    onboardingCompleted: true,
    bio: 'Frontend specialist passionate about UI/UX and modern JavaScript frameworks. Building beautiful interfaces for 9 years.',
    yearsOfExperience: 9,
    rating: 4.9,
    totalMentees: 20,
    technologies: [
      { name: 'Frontend', level: 'expert' },
      { name: 'React', level: 'expert' },
      { name: 'Vue.js', level: 'advanced' },
      { name: 'CSS/Tailwind', level: 'expert' },
      { name: 'TypeScript', level: 'advanced' },
    ],
    location: 'Los Angeles, CA',
  },
  {
    uid: 'mentor-005',
    email: 'mentor5@bairesdev.com',
    password: 'password123',
    displayName: 'Alex Thompson',
    photoURL: 'https://i.pravatar.cc/150?img=15',
    userType: 'mentor',
    onboardingCompleted: true,
    bio: 'Backend engineer with strong background in system design and scalability. Expert in Node.js and Python.',
    yearsOfExperience: 11,
    rating: 4.8,
    totalMentees: 16,
    technologies: [
      { name: 'Node.js', level: 'expert' },
      { name: 'Python', level: 'expert' },
      { name: 'Database Design', level: 'expert' },
      { name: 'Git/DevOps', level: 'advanced' },
      { name: 'Microservices', level: 'expert' },
    ],
    location: 'Boston, MA',
  },

  // Mentees
  {
    uid: 'mentee-001',
    email: 'mentee1@bairesdev.com',
    password: 'password123',
    displayName: 'Jessica Martinez',
    photoURL: 'https://i.pravatar.cc/150?img=10',
    userType: 'mentee',
    onboardingCompleted: true,
    bio: 'Junior Frontend Developer eager to learn React and modern web development',
    yearsOfExperience: 1,
    technologies: [
      { name: 'HTML/CSS', level: 'intermediate' },
      { name: 'JavaScript', level: 'beginner' },
      { name: 'React', level: 'beginner' },
    ],
    location: 'Chicago, IL',
  },
  {
    uid: 'mentee-002',
    email: 'mentee2@bairesdev.com',
    password: 'password123',
    displayName: 'Ryan Patel',
    photoURL: 'https://i.pravatar.cc/150?img=11',
    userType: 'mentee',
    onboardingCompleted: true,
    bio: 'Backend developer looking to improve Node.js and database skills',
    yearsOfExperience: 2,
    technologies: [
      { name: 'Node.js', level: 'beginner' },
      { name: 'JavaScript', level: 'intermediate' },
      { name: 'Database Design', level: 'beginner' },
    ],
    location: 'Denver, CO',
  },
  {
    uid: 'mentee-003',
    email: 'mentee3@bairesdev.com',
    password: 'password123',
    displayName: 'Sophie Anderson',
    photoURL: 'https://i.pravatar.cc/150?img=16',
    userType: 'mentee',
    onboardingCompleted: true,
    bio: 'Full-stack junior dev wanting to learn cloud deployment and DevOps',
    yearsOfExperience: 1.5,
    technologies: [
      { name: 'React', level: 'intermediate' },
      { name: 'Node.js', level: 'beginner' },
      { name: 'Cloud/AWS', level: 'beginner' },
    ],
    location: 'Portland, OR',
  },
  {
    uid: 'mentee-004',
    email: 'mentee4@bairesdev.com',
    password: 'password123',
    displayName: 'Carlos Mendez',
    photoURL: 'https://i.pravatar.cc/150?img=17',
    userType: 'mentee',
    onboardingCompleted: true,
    bio: 'Mobile development enthusiast learning React Native',
    yearsOfExperience: 1,
    technologies: [
      { name: 'React', level: 'beginner' },
      { name: 'Mobile Dev', level: 'beginner' },
      { name: 'JavaScript', level: 'intermediate' },
    ],
    location: 'Phoenix, AZ',
  },
  {
    uid: 'mentee-005',
    email: 'mentee5@bairesdev.com',
    password: 'password123',
    displayName: 'Emma Taylor',
    photoURL: 'https://i.pravatar.cc/150?img=18',
    userType: 'mentee',
    onboardingCompleted: true,
    bio: 'Computer Science graduate starting career in software development',
    yearsOfExperience: 0.5,
    technologies: [
      { name: 'Python', level: 'intermediate' },
      { name: 'Database Design', level: 'beginner' },
      { name: 'Git/DevOps', level: 'beginner' },
    ],
    location: 'Atlanta, GA',
  },
];


