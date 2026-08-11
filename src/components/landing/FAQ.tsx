import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What file formats are supported in the AI Study Hub?',
      a: 'Placivo AI supports PDF, DOCX, PPTX, TXT, images (PNG, JPG), and direct YouTube or syllabus text pastes. Our AI engine processes up to 1M context tokens seamlessly.',
    },
    {
      q: 'How does the AI Academic Tutor maintain study quality?',
      a: 'The tutor provides step-by-step conceptual guidance, logical proofs, and textbook citations to help you understand subjects thoroughly rather than simply memorizing standard answers.',
    },
    {
      q: 'How does the Attendance Predictor work?',
      a: 'You enter your weekly course schedule and target percentage (e.g., 75% or 80%). Placivo calculates your current percentage and computes exact mathematical thresholds for how many classes you can skip or MUST attend.',
    },
    {
      q: 'Can I export generated study suites and resumes to PDF?',
      a: 'Yes! All study notes, flashcards, and ATS resumes can be exported as clean, beautifully formatted PDFs with one click.',
    },
    {
      q: 'Is my uploaded data private and secure?',
      a: 'Absolutely. All user documents and profiles are stored securely with strict user isolation and Firestore security rules.',
    },
    {
      q: 'What is the refund policy for Placivo AI subscriptions?',
      a: 'All subscription payments are final and non-refundable (no money-back guarantee). Please pay at your own discretion. We invite you to place your trust in Placivo AI to empower your academic journey and placement career!',
    },
    {
      q: 'What is the official support contact info for Placivo AI?',
      a: 'You can reach our official support team via email at placivofficial@gmail.com for instant query resolution.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-transparent border-t border-white/40">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50/80 backdrop-blur-md px-3 py-1 rounded-full border border-blue-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/70 hover:bg-white/65 transition-all cursor-pointer shadow-2xs"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                </div>

                {isOpen && (
                  <p className="mt-3 pt-3 border-t border-slate-200/60 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
