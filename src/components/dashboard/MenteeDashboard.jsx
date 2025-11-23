import {
  BookOpen,
  FileText,
  Calendar,
  Target,
  Sparkles,
  GraduationCap,
  FileCheck,
  Code,
  Database,
  Zap,
  ArrowRight,
  Brain,
  BarChart3,
  Star,
  Image,
  Link as LinkIcon,
  Video,
  File,
} from "lucide-react";
import Card from "../Card";
import StatCard from "../StatCard";
import WelcomeHeroSection from "./WelcomeHeroSection";
import QuickActionsSection from "./QuickActionsSection";
import RecommendedCoursesCard from "./RecommendedCoursesCard";
import SupportMaterialsCard from "./SupportMaterialsCard";
import NextSessionHighlight from "./NextSessionHighlight";
import LearningStatsCard from "./LearningStatsCard";
import UpcomingSessionsCard from "./UpcomingSessionsCard";
import LoadingDashboard from "./LoadingDashboard";

// Recommended courses from Udemy
const recommendedCourses = [
  {
    title: "Complete React Developer",
    platform: "Udemy",
    rating: 4.8,
    students: "125K",
    icon: Code,
    url: "https://www.udemy.com/topic/react/",
    tag: "Popular",
  },
  {
    title: "Node.js Masterclass",
    platform: "Udemy",
    rating: 4.7,
    students: "98K",
    icon: Database,
    url: "https://www.udemy.com/topic/nodejs/",
    tag: "Trending",
  },
  {
    title: "TypeScript Complete Guide",
    platform: "Udemy",
    rating: 4.9,
    students: "87K",
    icon: FileText,
    url: "https://www.udemy.com/topic/typescript/",
    tag: "New",
  },
];

// Helper function to get icon and color based on material type
const getMaterialIconAndColor = (type) => {
  const typeMap = {
    pdf: { icon: FileText, color: "red" },
    image: { icon: Image, color: "purple" },
    link: { icon: LinkIcon, color: "blue" },
    video: { icon: Video, color: "orange" },
    document: { icon: FileCheck, color: "green" },
    code: { icon: Code, color: "yellow" },
  };

  const lowerType = type?.toLowerCase() || "document";
  return typeMap[lowerType] || { icon: File, color: "blue" };
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export default function MenteeDashboard({
  user,
  upcomingSessions,
  mentorships,
  loading,
  materials = [],
}) {
  const currentMentorship = mentorships[0]; // Mentees typically have one active mentorship
  const progress = currentMentorship?.progress || 0;

  // Loading State
  if (loading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <WelcomeHeroSection
          title={`Welcome ${user?.displayName || ""}!`}
          subtitle="Your personal learning journey powered by AI matching. Track your progress, engage with mentors, and achieve your professional goals."
          primaryAction={{
            icon: BookOpen,
            label: currentMentorship
              ? "Continue Learning"
              : "Start Learning Journey",
            path: currentMentorship
              ? `/mentorship/${currentMentorship.id}`
              : "/mentorship",
            endIcon: ArrowRight,
          }}
          secondaryAction={{
            icon: Calendar,
            label: "View Sessions",
            path: "/mentorship",
          }}
          features={[
            {
              icon: Brain,
              title: "AI-Matched Mentors",
              description: "Expert guidance",
            },
            {
              icon: BarChart3,
              title: "Track Progress",
              description: "Monitor growth",
            },
            {
              icon: Zap,
              title: "Quick Resources",
              description: "Learn faster",
            },
          ]}
        />

        <QuickActionsSection
          title="Quick Actions"
          description="Everything you need to manage your learning journey"
          actions={[
            {
              icon: BookOpen,
              title: "My Mentorship",
              description: currentMentorship
                ? `${progress}% complete`
                : "Not started yet",
              path: currentMentorship
                ? `/mentorship/${currentMentorship.id}`
                : "/mentorship",
            },
            {
              icon: Calendar,
              title: "Upcoming Sessions",
              description: `${upcomingSessions.length} sessions scheduled`,
              path: "/mentorship",
            },
            {
              icon: GraduationCap,
              title: "Learning Resources",
              description: "Access courses & materials",
              path: "#resources",
            },
          ]}
        />
      </div>

      {/* Current Mentorship Overview */}
      <div className="space-y-6 md:space-y-8">
        {/* Next Session Highlight */}
        {upcomingSessions.length > 0 && (
          <NextSessionHighlight
            session={upcomingSessions[0]}
            onJoinSession={(session) => {
              console.log("Join session:", session);
              // Add join logic here
            }}
          />
        )}

        {/* Recommended Courses */}
        <RecommendedCoursesCard courses={recommendedCourses} />

        {/* Support Materials */}
        <SupportMaterialsCard
          materials={materials.map((material) => {
            const { icon, color } = getMaterialIconAndColor(material.type);
            return {
              ...material,
              icon,
              color,
              size: formatFileSize(material.fileSize),
            };
          })}
        />

        {/* All Upcoming Sessions */}
        <UpcomingSessionsCard
          upcomingSessions={upcomingSessions}
          loading={false}
          onCancelSession={(sessionId) => {
            console.log("Cancel session:", sessionId);
          }}
        />
      </div>
    </div>
  );
}
