// Mock mentorship data for development
export const mockMentorshipData = {
  id: 1,
  mentee: {
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'Junior Developer',
    email: 'sarah.johnson@company.com'
  },
  mentor: {
    name: 'Alex Smith',
    avatar: 'https://i.pravatar.cc/150?img=33',
    role: 'Senior Engineer',
    email: 'alex.smith@company.com'
  },
  originalGoal: 'Improve performance in React development and strengthen communication skills with stakeholders',
  topic: 'React & Frontend Development',
  status: 'active',
  startDate: '2024-09-01',
  totalSessions: 8,
  completedSessions: 6,
  currentWeek: 4,
  overallProgress: 75,
  
  sessions: [
    {
      id: 1,
      date: '2024-09-05',
      duration: 60,
      progressRating: 2,
      summary: 'Initial assessment. Sarah showed good understanding of JavaScript fundamentals but needs more practice with React Hooks. We discussed her learning goals and created a roadmap.',
      nextSteps: 'Study useState and useEffect hooks. Complete 2 practice exercises.',
      recordingUrl: 'https://example.com/recording/1',
      mentorNotes: 'Enthusiastic learner, good questions'
    },
    {
      id: 2,
      date: '2024-09-12',
      duration: 60,
      progressRating: 3,
      summary: 'Reviewed React Hooks exercises. Sarah completed both assignments and showed good grasp of useState. Introduced useEffect and lifecycle concepts.',
      nextSteps: 'Build a small counter app using hooks. Read about component lifecycle.',
      recordingUrl: 'https://example.com/recording/2',
      mentorNotes: 'Making steady progress, completed all homework'
    },
    {
      id: 3,
      date: '2024-09-19',
      duration: 60,
      progressRating: 3,
      summary: 'Code review of counter app - good implementation. Discussed state management patterns and when to lift state up. Introduced basic routing concepts.',
      nextSteps: 'Start building a todo app with multiple components. Implement routing.',
      recordingUrl: null,
      mentorNotes: 'Code quality improving, asking advanced questions'
    },
    {
      id: 4,
      date: '2024-09-26',
      duration: 60,
      progressRating: 4,
      summary: 'Excellent progress on todo app! Clean component structure and proper state management. Discussed API integration and async operations. Introduced error handling patterns.',
      nextSteps: 'Integrate a REST API into the todo app. Implement error boundaries.',
      recordingUrl: 'https://example.com/recording/4',
      mentorNotes: 'Significant improvement, ready for more complex topics'
    },
    {
      id: 5,
      date: '2024-10-03',
      duration: 60,
      progressRating: 4,
      summary: 'Reviewed API integration - well implemented with proper error handling. Discussed performance optimization and React.memo. Started covering testing basics with Jest.',
      nextSteps: 'Write unit tests for main components. Optimize re-renders in todo app.',
      recordingUrl: 'https://example.com/recording/5',
      mentorNotes: 'Strong technical growth, testing mindset developing'
    },
    {
      id: 6,
      date: '2024-10-10',
      duration: 60,
      progressRating: 5,
      summary: 'Outstanding session! Sarah presented her portfolio project - impressive work with advanced patterns. Great code organization and test coverage. Ready to contribute to team projects.',
      nextSteps: 'Start shadowing on team sprint. Pair programming sessions scheduled.',
      recordingUrl: 'https://example.com/recording/6',
      mentorNotes: 'Exceeded expectations, ready for production work'
    }
  ]
}

// Mock materials data
export const mockMaterials = [
  {
    id: 1,
    type: 'pdf',
    title: 'React Best Practices Guide',
    description: 'Comprehensive guide covering modern React patterns and best practices',
    url: 'https://example.com/react-guide.pdf',
    addedBy: 'Mentor',
    addedAt: new Date('2024-01-15'),
    downloads: 12
  },
  {
    id: 2,
    type: 'link',
    title: 'Official React Documentation',
    description: 'The official React docs - great reference material',
    url: 'https://react.dev',
    addedBy: 'Mentor',
    addedAt: new Date('2024-01-10'),
    downloads: 25
  },
  {
    id: 3,
    type: 'video',
    title: 'React Hooks Deep Dive',
    description: 'Video tutorial covering all React hooks in depth',
    url: 'https://youtube.com/watch?v=example',
    addedBy: 'Mentor',
    addedAt: new Date('2024-01-20'),
    downloads: 8
  }
]

