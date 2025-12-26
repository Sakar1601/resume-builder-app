export interface Resume {
  id: string
  user_id: string
  title: string
  template: string
  created_at: string
  updated_at: string
}

export interface ResumeSection {
  id: string
  resume_id: string
  section_type: "personal" | "summary" | "experience" | "education" | "skills" | "projects" | "certifications"
  content: Record<string, any>
  display_order: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface ContactInfo {
  name: string
  email: string
  phone: string
  linkedin: string
  github: string
  location: string
}

export interface ExperienceItem {
  id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface ProjectItem {
  id: string
  name: string
  link: string
  techStack: string
  bullets: string[]
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  startDate: string
  endDate: string
  details: string
}

export interface SkillCategory {
  id: string
  category: string
  skills: string
}

export interface ResumeData {
  contact?: ContactInfo
  summary?: string
  skills?: SkillCategory[]
  experience?: ExperienceItem[]
  projects?: ProjectItem[]
  education?: EducationItem[]
}
