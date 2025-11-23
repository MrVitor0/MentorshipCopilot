import { useAuth } from "./useAuth";

/**
 * Custom hook for managing user permissions based on user type
 * Follows SOLID principles - Single Responsibility
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const userType = user?.userType;

  // Permission checks
  const isMentor = userType === "mentor";
  const isPM = userType === "pm";
  const isMentee = userType === "mentee";

  // Feature permissions
  const permissions = {
    // Dashboard views
    canViewMentorDashboard: isMentor,
    canViewPMDashboard: isPM,
    canViewMenteeDashboard: isMentee,

    // Mentorship management
    canFindMentors: isMentee || isPM, // Only mentees and PMs can find mentors
    canCreateMentorship: isPM, // Only PMs can create mentorships
    canManageMentorships: isMentor || isPM, // Mentors and PMs can access /mentorship page
    canViewMentorshipAsMentor: isMentor || isPM, // Both can view mentor perspective
    canViewMentorshipAsPM: isPM, // Only PMs can view PM perspective

    // Teams and Projects management
    canManageTeams: isPM, // Only PMs can manage teams
    canManageProjects: isPM, // Only PMs can manage projects
    canViewTeams: isPM || isMentor, // PMs and Mentors can view teams
    canViewProjects: isPM || isMentor, // PMs and Mentors can view projects

    // Profile and settings
    canEditProfile: true, // Everyone can edit their profile
    canViewSettings: true, // Everyone can view settings

    // Sessions
    canScheduleSessions: isMentor || isPM, // Mentors and PMs can schedule
    canViewSessions: true, // Everyone can view their sessions

    // Content
    canAccessLearningMaterials: isMentee, // Only mentees see learning materials
    canAccessRecommendedCourses: isMentee, // Only mentees see course recommendations
    canViewSmartSuggestions: isMentor || isMentee, // Mentors and mentees see suggestions
    canViewAIOpportunities: true, // Everyone sees opportunities

    // User type flags
    isMentor,
    isPM,
    isMentee,
  };

  return permissions;
};

export default usePermissions;
