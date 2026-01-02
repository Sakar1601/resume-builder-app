# ResumeBuilder

A modern, AI-powered resume builder application built with Next.js, TypeScript, and Supabase. Create professional, ATS-friendly resumes with real-time preview, AI-assisted content improvement, and seamless PDF export.

## Features

### Core Functionality
- **Live Resume Editor**: Real-time preview with side-by-side editing
- **Multiple Resume Sections**: Contact information, professional summary, work experience, education, skills, and projects
- **ATS-Friendly Design**: Optimized for applicant tracking systems
- **PDF Export**: High-quality PDF generation for printing and sharing
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### AI-Powered Features
- **Bullet Point Rewriting**: Enhance resume bullets with three different tones (impact-focused, concise, technical)
- **Job Tailoring**: Analyze job descriptions and suggest resume improvements, including missing keywords and tailored summaries
- **Smart Suggestions**: AI-generated improvements while preserving original content accuracy

### User Experience
- **Guest Mode**: Start building resumes immediately without registration (data stored locally)
- **User Authentication**: Secure account creation with Supabase Auth
- **Resume Management**: Create, edit, and organize multiple resumes
- **Auto-Save**: Automatic saving for both guest and authenticated users
- **Readiness Checklist**: Built-in validation to ensure resume completeness

## Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Smooth animations and transitions

### Backend & Database
- **Supabase**: PostgreSQL database with real-time subscriptions and authentication
- **Supabase Auth**: User authentication and authorization
- **Row Level Security (RLS)**: Database-level access control

### AI Integration
- **AI SDK**: Unified interface for AI providers
- **Groq**: Fast inference for AI-powered features
- **OpenAI**: Fallback AI provider

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **pnpm**: Package management
- **Vercel Analytics**: Usage tracking

## Architecture

### Project Structure
```
app/
├── api/                    # API routes
│   ├── ai/                # AI-powered endpoints
│   │   ├── rewrite-bullet/# Bullet rewriting
│   │   └── tailor/        # Job tailoring
│   ├── auth/              # Authentication routes
│   └── ...
├── dashboard/             # User dashboard
├── guest/                 # Guest mode routes
├── print/                 # PDF export routes
└── ...

components/
├── sections/              # Resume section editors
├── ui/                    # Reusable UI components
└── ...

lib/
├── supabase/             # Database client
├── types.ts              # TypeScript definitions
└── ...
```

### Database Schema
- **resumes**: Stores resume metadata and user ownership
- **resume_sections**: Stores individual resume sections as JSONB
- **profiles**: User profile information

### Authentication Flow
- **Guest Mode**: Local storage-based session management
- **Authenticated Mode**: Supabase JWT-based authentication with RLS

### AI Features Implementation
- **Bullet Rewriting**: Uses Groq API to generate 3 alternative versions of resume bullets
- **Job Tailoring**: Analyzes job descriptions against resume content to suggest improvements

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-builder-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
```

4. Set up the database:
Run the SQL scripts in the `scripts/` directory in order:
- `001_create_resumes_table.sql`
- `002_create_resume_sections.sql`
- `003_create_profiles_table.sql`
- `004_create_profile_trigger.sql`
- `005_add_data_column_to_resumes.sql`

5. Start the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Guests
1. Visit the homepage and click "Try as Guest"
2. Start building your resume immediately
3. Data is stored locally in your browser
4. Export as PDF when ready

### For Registered Users
1. Sign up for an account
2. Create multiple resumes
3. Access your resumes from any device
4. All data is securely stored in the cloud

### AI Features
- **Rewrite Bullets**: Select any bullet point and choose from impact, concise, or technical tones
- **Tailor to Job**: Paste a job description to get personalized suggestions

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Self-hosted with Docker


