import { Star, Users, ExternalLink } from 'lucide-react'
import Card from '../Card'
import Badge from '../Badge'

export default function RecommendedCoursesCard({ 
  courses = [],
  platformUrl = "https://www.udemy.com/"
}) {
  return (
    <Card gradient hover padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-[16px] flex items-center justify-center shadow-lg border-2 border-purple-200/50">
            <img src="/udemy.png" alt="Udemy" className="w-9 h-9 object-contain" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-black">Recommended Courses</h3>
            <p className="text-xs text-neutral-gray-dark flex items-center gap-1">
              Curated courses from <span className="font-bold text-purple-600">Udemy</span>
            </p>
          </div>
        </div>
        <img src="/udemy.png" alt="Udemy" className="w-20 h-8 object-contain opacity-50" />
      </div>

      <div className="grid gap-4">
        {courses.map((course, index) => (
          <a
            key={index}
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 bg-gradient-to-br from-white to-purple-50/50 rounded-[20px] border border-purple-100/50 hover:border-purple-300/70 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-[14px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <course.icon className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-black group-hover:text-purple-600 transition-colors">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <img src="/udemy.png" alt="Udemy" className="w-12 h-3 object-contain opacity-60" />
                      <span className="text-xs text-neutral-gray-dark">• {course.platform}</span>
                    </div>
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
                  <div className="ml-auto flex items-center gap-1 text-xs text-purple-600 font-semibold group-hover:gap-2 transition-all">
                    View on Udemy
                    <ExternalLink className="w-3 h-3" />
                  </div>
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
          className="group flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-[14px] border border-purple-200/50 hover:border-purple-400/70 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <img src="/udemy.png" alt="Udemy" className="w-10 h-10 object-contain" />
            <div>
              <p className="text-sm font-bold text-neutral-black group-hover:text-purple-600 transition-colors">
                Explore more on Udemy
              </p>
              <p className="text-xs text-neutral-gray-dark">
                Thousands of courses available
              </p>
            </div>
          </div>
          <ExternalLink className="w-5 h-5 text-neutral-gray group-hover:text-purple-600 transition-colors" />
        </a>
      </div>
    </Card>
  )
}
