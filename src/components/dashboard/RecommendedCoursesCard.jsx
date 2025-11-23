import { GraduationCap, Star, Users, ExternalLink, BookOpen } from 'lucide-react'
import Card from '../Card'
import Badge from '../Badge'

export default function RecommendedCoursesCard({ 
  courses = [],
  platformUrl = "https://www.udemy.com/"
}) {
  return (
    <Card gradient hover padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[16px] flex items-center justify-center shadow-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-neutral-black">Recommended Courses</h3>
          <p className="text-xs text-neutral-gray-dark flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-indigo-500" />
            Personalized for your learning path
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {courses.map((course, index) => (
          <a
            key={index}
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 bg-gradient-to-br from-white to-indigo-50/50 rounded-[20px] border border-indigo-100/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-[14px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <course.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-black group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-neutral-gray-dark mt-1">{course.platform}</p>
                  </div>
                  <Badge variant="warning" className="text-xs ml-2">{course.tag}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-gray-dark">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{course.students} students</span>
                  </div>
                  <ExternalLink className="w-3 h-3 ml-auto group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200/50">
        <a 
          href={platformUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-baires-indigo hover:text-indigo-600 font-semibold flex items-center gap-2 transition-colors"
        >
          Explore more courses on Udemy
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </Card>
  )
}
