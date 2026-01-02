"use client"

import type { ResumeData } from "@/lib/types"

interface ResumePreviewProps {
  data: ResumeData
}

export function ResumePreview({ data }: ResumePreviewProps) {
  const { contact, summary, skills, experience, projects, education } = data

  return (
    <div className="bg-white text-black p-8 space-y-6 print:p-0">
      {/* Contact Information */}
      {contact && (
        <div className="space-y-2 border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-gray-900">{contact.name || "Your Name"}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {contact.email && <span>{contact.email}</span>}
            {contact.phone && <span>{contact.phone}</span>}
            {contact.location && <span>{contact.location}</span>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {contact.linkedin && <span>{contact.linkedin}</span>}
            {contact.github && <span>{contact.github}</span>}
          </div>
        </div>
      )}

      {/* Professional Summary */}
      {summary && (
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Summary</h2>
          <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Skills</h2>
          <div className="space-y-1">
            {skills.map((category) => (
              <div key={category.id} className="text-sm">
                <span className="font-semibold text-gray-900">{category.category}:</span>{" "}
                <span className="text-gray-800">{category.skills}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Experience</h2>
          {experience.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{item.role}</h3>
                  <p className="text-sm text-gray-700">
                    {item.company}
                    {item.location && ` • ${item.location}`}
                  </p>
                </div>
                <p className="text-sm text-gray-600 whitespace-nowrap">
                  {item.startDate} - {item.endDate}
                </p>
              </div>
              {item.bullets && item.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-sm text-gray-800 leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Projects</h2>
          {projects.map((item) => (
            <div key={item.id} className="space-y-1">
              <div>
                <h3 className="font-bold text-gray-900">
                  {item.name}
                  {item.link && (
                    <>
                      {" • "}
                      <span className="font-normal text-sm text-gray-600">{item.link}</span>
                    </>
                  )}
                </h3>
                {item.techStack && <p className="text-sm text-gray-700">{item.techStack}</p>}
              </div>
              {item.bullets && item.bullets.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-sm text-gray-800 leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Education</h2>
          {education.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{item.school}</h3>
                  <p className="text-sm text-gray-700">{item.degree}</p>
                </div>
                <p className="text-sm text-gray-600 whitespace-nowrap">
                  {item.startDate} - {item.endDate}
                </p>
              </div>
              {item.details && <p className="text-sm text-gray-800">{item.details}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!contact &&
        !summary &&
        (!skills || skills.length === 0) &&
        (!experience || experience.length === 0) &&
        (!projects || projects.length === 0) &&
        (!education || education.length === 0) && (
          <div className="flex items-center justify-center h-64 text-center">
            <p className="text-gray-400">Start adding information to see your resume preview</p>
          </div>
        )}
    </div>
  )
}
