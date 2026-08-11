import React, { useEffect } from 'react';

interface SEOHeadProps {
  activeTab?: string;
  customTitle?: string;
  customDescription?: string;
}

const TAB_SEO_CONFIG: Record<string, { title: string; description: string; keywords: string; path: string }> = {
  landing: {
    title: 'Placivo AI — #1 AI Quiz Generator, PDF Summarizer & Placement Prep Platform',
    description: 'Placivo AI is the ultimate AI operating system for college students. Generate instant practice quizzes from lecture PDFs, summarize study notes, practice DSA coding, create ATS resumes, and ace technical interviews.',
    keywords: 'Placivo AI, AI Quiz Generator, AI PDF Quiz Generator, Quiz from PDF, Generate MCQs from PDF, AI Study Tool, AI Notes Generator, AI Flashcards, AI Mind Maps, AI Learning Platform, AI Placement Preparation, Resume Builder AI, Interview Preparation AI, Student Productivity AI',
    path: '/'
  },
  dashboard: {
    title: 'Student Command Dashboard — Placivo AI Academic Portal',
    description: 'Your central AI study hub. Access recent study suites, track attendance goals, solve daily DSA problems, and manage course schedules in one unified student dashboard.',
    keywords: 'Student Dashboard, AI Study Hub, Academic Management, College Productivity, Course Tracker, Attendance Predictor',
    path: '/dashboard'
  },
  quiz: {
    title: 'AI Quiz Generator from PDF — Free Instant MCQ & Exam Prep Tool | Placivo AI',
    description: 'Upload any lecture slides, textbook PDF, or subject notes to automatically generate grounded MCQs, True/False, Fill in the Blanks, and Short Answer practice exams powered by Placivo AI.',
    keywords: 'AI Quiz Generator, AI PDF Quiz Generator, Quiz from PDF, Generate MCQs from PDF, Practice Test Generator, Exam Prep AI, Engineering Quiz Generator',
    path: '/ai-quiz-generator'
  },
  notes: {
    title: 'AI Notes Generator & PDF Summarizer — Instant Study Notes & Flashcards | Placivo AI',
    description: 'Transform lengthy research papers, textbook PDFs, and lecture slides into clean structured study notes, key concept summaries, interactive flashcards, and mind maps in seconds.',
    keywords: 'AI Notes Generator, AI PDF Summarizer, Flashcard Generator, AI Mind Maps, Lecture Summarizer, Study Guide Generator',
    path: '/ai-notes'
  },
  studyhub: {
    title: 'AI Academic Assistant & Multi-Document Chat Tutor | Placivo AI',
    description: 'Chat with your textbooks, lecture slides, and notes using an intelligent AI tutor. Get step-by-step mathematical proofs, conceptual explanations, and textbook citations.',
    keywords: 'AI Academic Tutor, Chat with PDF, AI Homework Helper, Multi-Document AI Chat, Engineering AI Tutor',
    path: '/study-hub'
  },
  coding: {
    title: 'AI Coding Hub & DSA Practice — 300+ Solved Placement Questions | Placivo AI',
    description: 'Master Data Structures & Algorithms with 300+ topic-wise coding challenges, Striver & Love Babbar sheet tracking, runtime execution, and step-by-step AI code explanations.',
    keywords: 'DSA Coding Hub, Placement Coding Practice, Data Structures and Algorithms, Solved Coding Questions, Tech Interview Coding',
    path: '/coding-hub'
  },
  courses: {
    title: 'AI Learning Platform & Guided CS Engineering Courses | Placivo AI',
    description: 'Free comprehensive computer science courses covering Full Stack Web Dev, Systems, DBMS, Machine Learning, Operating Systems, and Placement Aptitude.',
    keywords: 'CS Engineering Courses, Free Web Dev Course, System Design Tutorial, DBMS Placement Notes, AI Learning Courses',
    path: '/courses'
  },
  resumebuilder: {
    title: 'AI Resume Builder — Free ATS-Optimized Student Resume Maker | Placivo AI',
    description: 'Build single-page, ATS-compliant tech resumes for software engineering, data science, and product internships. Real-time ATS score analyzer and bullet point optimizer.',
    keywords: 'AI Resume Builder, Free ATS Resume Maker, Software Engineer Resume, Student Resume Builder, Placement Resume Generator',
    path: '/ai-resume-builder'
  },
  interviewprep: {
    title: 'AI Interview Preparation & Technical Mock Interview Simulator | Placivo AI',
    description: 'Practice real company-specific interview questions for Google, Microsoft, Amazon, TCS, Infosys, and startups with instant AI voice feedback and scorecards.',
    keywords: 'AI Interview Preparation, Mock Interview AI, Tech Interview Questions, HR Interview Practice, Placement Interview Prep',
    path: '/interview-prep'
  },
  placement: {
    title: 'Startup Jobs & Placement Opportunities Hub | Placivo AI',
    description: 'Explore off-campus hiring drives, startup internships, full-time job openings, and company-specific recruitment process roadmaps.',
    keywords: 'Off Campus Drive 2026, Startup Jobs India, Engineering Internships, College Placement Portal, Tech Jobs',
    path: '/placement-hub'
  },
  habiturex: {
    title: 'Smart Attendance Predictor & Focus Study Tracker | Placivo AI',
    description: 'Calculate exact attendance thresholds for college courses, track Pomodoro study focus sessions, and maintain daily study streaks with Habiturex.',
    keywords: 'Attendance Predictor, BTech Attendance Calculator, Pomodoro Study Timer, Habit Tracker for Students',
    path: '/attendance-tracker'
  },
  pricing: {
    title: 'Placivo AI Student Subscription — Upgrade Plans & Pricing',
    description: 'Affordable academic plans for college students. Get unlimited AI PDF processing, unlimited quiz generation, full ATS resume analysis, and priority support.',
    keywords: 'Placivo AI Pricing, Student AI Subscription, Affordable AI Study Tool',
    path: '/pricing'
  },
  settings: {
    title: 'Account Settings & Terms — Placivo AI',
    description: 'Manage your profile settings, subscription status, privacy policies, and official support contacts at Placivo AI.',
    keywords: 'Placivo AI Settings, Student Profile, Privacy Policy, Terms and Conditions',
    path: '/settings'
  }
};

export const SEOHead: React.FC<SEOHeadProps> = ({ activeTab = 'landing', customTitle, customDescription }) => {
  useEffect(() => {
    const config = TAB_SEO_CONFIG[activeTab] || TAB_SEO_CONFIG.landing;
    const siteName = 'Placivo AI';
    const baseUrl = 'https://placivo.ai';
    const currentUrl = `${baseUrl}${config.path}`;
    const pageTitle = customTitle || config.title;
    const pageDescription = customDescription || config.description;

    // 1. Update Title
    document.title = pageTitle;

    // Helper function to update or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, contentValue: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Helper function to update or create link tag
    const setLinkTag = (rel: string, hrefValue: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', hrefValue);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', pageDescription);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', config.keywords);
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('meta[name="author"]', 'name', 'author', 'Placivo AI Team');

    // 3. Canonical Link
    setLinkTag('canonical', currentUrl);

    // 4. Open Graph Tags (Facebook, LinkedIn, Discord)
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDescription);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', siteName);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', `${baseUrl}/og-image.png`);

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', `${baseUrl}/og-image.png`);

    // 6. Structured Data (JSON-LD Schemas)
    const jsonLdScriptId = 'placivo-jsonld-schema';
    let scriptElement = document.getElementById(jsonLdScriptId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = jsonLdScriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    const schemas = [
      // Organization Schema
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Placivo AI',
        'url': baseUrl,
        'logo': `${baseUrl}/logo.png`,
        'description': 'Placivo AI is the AI-first operating system for college students providing automated PDF quiz generation, notes summarizer, ATS resume builder, and technical interview preparation.',
        'contactPoint': {
          '@type': 'ContactPoint',
          'email': 'placivofficial@gmail.com',
          'contactType': 'customer support',
          'availableLanguage': ['English']
        },
        'sameAs': [
          'https://twitter.com/PlacivoAI',
          'https://linkedin.com/company/placivo-ai'
        ]
      },
      // SoftwareApplication Schema
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Placivo AI Platform',
        'operatingSystem': 'Web Browser, Android, iOS, Windows, macOS',
        'applicationCategory': 'EducationalApplication',
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'reviewCount': '12480'
        },
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      },
      // WebSite with SearchAction
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Placivo AI',
        'url': baseUrl,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${baseUrl}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      // BreadcrumbList Schema
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': baseUrl
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': config.title.split('—')[0].trim(),
            'item': currentUrl
          }
        ]
      },
      // FAQPage Schema
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'What is Placivo AI?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Placivo AI is an all-in-one AI platform for college students that provides instant PDF quiz generation, study notes summarization, flashcards, mind maps, attendance prediction, ATS resume building, and technical interview preparation.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How does the AI PDF Quiz Generator work in Placivo AI?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Simply upload your lecture slides, textbook PDF, or subject notes. Placivo AI uses grounded Placivo AI models to analyze the text and generate grounded MCQs, True/False questions, fill-in-the-blanks, and short answer practice tests.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Is Placivo AI free for college students?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes! Placivo AI offers a free tier for college students with instant access to AI notes summarizer, study hub chat, attendance calculator, and practice quizzes.'
            }
          }
        ]
      }
    ];

    scriptElement.textContent = JSON.stringify(schemas, null, 2);

  }, [activeTab, customTitle, customDescription]);

  return null;
};
