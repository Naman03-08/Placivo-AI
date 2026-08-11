import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Scale, ExternalLink, CheckCircle, Search, Mail, Building2, Lock, GraduationCap } from 'lucide-react';
import placivoAILogo from '../landing/Placivo-logo.png';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'cancellation';
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cancellation'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const termsSections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `Welcome to Placivo AI ("Placivo AI", "we", "our", or "us").

These Terms & Conditions ("Terms") govern your access to and use of the Placivo AI website, applications, services, AI-powered tools, subscriptions, and related features.

By accessing or using Placivo AI, creating an account, or purchasing a subscription, you agree to be legally bound by these Terms. If you do not agree, you must not use Placivo AI.`
    },
    {
      id: 'eligibility',
      title: '2. Eligibility',
      content: `You represent that:
• You have the legal capacity to enter into these Terms.
• The information you provide is accurate and up to date.
• You will comply with all applicable laws while using Placivo AI.
• Where required by applicable law, users below the applicable age threshold must have appropriate parental or guardian consent.`
    },
    {
      id: 'registration',
      title: '3. Account Registration',
      content: `To access certain features, you may create an account using:
• Google Sign-In
• Email and Password

You are responsible for:
• Maintaining the confidentiality of your login credentials.
• All activities conducted through your account.
• Promptly notifying Placivo AI if you suspect unauthorized access.

We reserve the right to suspend or terminate accounts that violate these Terms or pose security risks.`
    },
    {
      id: 'services',
      title: '4. Services Provided',
      content: `Placivo AI provides educational and career-preparation services, including but not limited to:
• AI study assistance & Academic Tutor
• AI placement preparation & 375 DSA Roadmap
• ATS Resume builder & Resume ATS Analysis
• PDF summarization & AINotes Engine
• Technical interview preparation & Mock Interviews
• Coding practice & IDE sandboxes
• Learning resources, Course hubs, & Lecture notes
• Career guidance tools & Startup jobs hub
• Premium subscription features

Services may evolve over time, and we may add, modify, or discontinue features to enhance user experience.`
    },
    {
      id: 'subscriptions',
      title: '5. Paid Subscriptions',
      content: `Certain features require a paid subscription (such as Pro Scholar or Pro Ultimate).

By purchasing a subscription, you agree that:
• You will pay the applicable fees in full.
• Subscription benefits are available only during the active subscription period.
• Failure to complete payment may result in suspension of premium access.
• Prices may change for future subscription periods. Any changes will not affect an active subscription until renewal unless otherwise permitted by law.`
    },
    {
      id: 'payments',
      title: '6. Payments & Billing',
      content: `Payments are processed through trusted third-party payment gateways (including Razorpay, Stripe, and UPI processors).

Placivo AI does not store your complete payment card or bank account details.

You authorize the payment provider to process payments for your selected subscription tier.`
    },
    {
      id: 'user-content',
      title: '7. User Content & Uploads',
      content: `You may upload:
• Resumes & Cover letters
• PDFs & Study notes
• Assignments & Problem sets
• Documents & Custom questions
• Other educational materials

You retain ownership of your content.

By uploading content, you grant Placivo AI a limited, non-exclusive, revocable license to process, store, and display it solely to provide the requested services.

You are responsible for ensuring you have the necessary rights to upload any content.`
    },
    {
      id: 'ai-services',
      title: '8. AI Services & Generative Content',
      content: `Placivo AI uses artificial intelligence (powered by Placivo AI & proprietary ML pipelines) to generate educational content.

AI-generated responses:
• are generated automatically,
• may contain inaccuracies or outdated information,
• are provided for informational and educational purposes only,
• are not legal, medical, financial, or professional advice.

You are responsible for reviewing and verifying AI-generated content before relying on it.`
    },
    {
      id: 'acceptable-use',
      title: '9. Acceptable Use Policy',
      content: `You agree not to:
• Upload illegal, harmful, offensive, or malicious content.
• Upload malware, trojans, or computer viruses.
• Attempt unauthorized access to Placivo AI infrastructure.
• Reverse engineer, decompile, or interfere with Placivo AI software.
• Circumvent security measures or subscription controls.
• Abuse AI features or perform automated denial-of-service queries.
• Harass, threaten, or impersonate others.
• Use Placivo AI to violate any local, national, or international law.
• Scrape or automate data extraction without prior written permission.

Violation of these rules may result in immediate account suspension or permanent termination.`
    },
    {
      id: 'intellectual-property',
      title: '10. Intellectual Property Rights',
      content: `All rights, title, and interest in Placivo AI—including its software, branding, logos, interface designs, graphics, source code, documentation, course roadmaps, and content created by Placivo AI—are owned by Placivo AI or its licensors.

Except as expressly permitted, you may not:
• Copy, reproduce, or mirror any part of the platform.
• Sell, rent, lease, or redistribute the software.
• Modify, reverse engineer, or decompile the codebase.
• Create derivative works from Placivo AI without prior written consent.`
    },
    {
      id: 'user-feedback',
      title: '11. User Feedback',
      content: `If you submit suggestions, feature ideas, code improvements, or feedback, you grant Placivo AI the right to use, modify, and implement that feedback without any obligation to compensate or credit you.`
    },
    {
      id: 'privacy-ref',
      title: '12. Privacy Policy Integration',
      content: `Your use of Placivo AI is also governed by our Privacy Policy.

By using Placivo AI, you consent to the collection, storage, and processing of your information as described in our Privacy Policy.`
    },
    {
      id: 'service-availability',
      title: '13. Service Availability & Maintenance',
      content: `We strive to keep Placivo AI available 24/7 but do not guarantee uninterrupted access.

Services may be temporarily unavailable due to:
• Scheduled maintenance & infrastructure upgrades
• Platform updates & security patches
• Technical emergencies or server issues
• Unforeseen events beyond our reasonable control`
    },
    {
      id: 'termination',
      title: '14. Account Suspension & Termination',
      content: `We reserve the right to suspend or terminate your account if you:
• Violate these Terms & Conditions.
• Engage in fraudulent, deceptive, or abusive behavior.
• Threaten the security, integrity, or stability of Placivo AI.
• Use the platform for unlawful or unauthorized commercial purposes.

Termination may result in the forfeiture of active subscriptions and revocation of access.`
    },
    {
      id: 'limitation-liability',
      title: '15. Limitation of Liability',
      content: `To the fullest extent permitted by applicable law:
• Placivo AI is provided on an "as is" and "as available" basis.
• We do not guarantee that the platform will be error-free, uninterrupted, or suitable for every user requirement.
• We are not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of Placivo AI.
• We are not responsible for decisions made based on AI-generated content, user-generated content, or third-party information.`
    },
    {
      id: 'indemnification',
      title: '16. Indemnification',
      content: `You agree to indemnify and hold harmless Placivo AI, its owners, founders, employees, affiliates, and service providers from claims, damages, liabilities, and expenses (including legal fees) arising from:
• Your violation of these Terms.
• Your misuse of Placivo AI.
• Your infringement of third-party intellectual property or privacy rights.
• Content or documents you upload or share.`
    },
    {
      id: 'third-party',
      title: '17. Third-Party Services',
      content: `Placivo AI integrates with third-party providers, including Firebase Authentication, Firestore Database, Placivo AI, payment gateways, and cloud storage.

We are not responsible for the availability, content, or security practices of third-party services. Your use of those services is governed by their respective terms and policies.`
    },
    {
      id: 'changes',
      title: '18. Changes to Terms',
      content: `We may modify these Terms from time to time. Updated Terms will be posted on Placivo AI with a revised "Last Updated" date.

Your continued use of Placivo AI after the updated Terms become effective constitutes acceptance of the revised Terms.`
    },
    {
      id: 'governing-law',
      title: '19. Governing Law & Jurisdiction',
      content: `These Terms are governed by and construed in accordance with the laws of India.

Any dispute arising out of or relating to these Terms or the use of Placivo AI shall be subject to the exclusive jurisdiction of the competent courts in India.`
    },
    {
      id: 'severability',
      title: '20. Severability',
      content: `If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.`
    },
    {
      id: 'entire-agreement',
      title: '21. Entire Agreement',
      content: `These Terms, together with the Privacy Policy and any other official policies incorporated by reference, constitute the entire agreement between you and Placivo AI regarding your use of the platform.`
    },
    {
      id: 'contact',
      title: '22. Contact Information',
      content: `If you have any questions, feedback, or concerns regarding these Terms & Conditions, Privacy Policy, or Subscription Billing, please contact us:

• Official Email: placivofficial@gmail.com
• Official Portal: https://placivo.ai
• Platform: Placivo AI Student Intelligence Services`
    }
  ];

  const privacySections = [
    {
      id: 'privacy-intro',
      title: '1. Privacy Overview',
      content: `Placivo AI ("we", "our", "us") values your privacy. This Privacy Policy outlines how we collect, store, protect, and handle your personal information when you use Placivo AI.

By using Placivo AI, you consent to the data practices described in this policy.`
    },
    {
      id: 'privacy-collection',
      title: '2. Information We Collect',
      content: `We collect information necessary to provide and improve our educational services:

• Account Information: Name, email address, profile picture (via Google OAuth or Firebase Auth).
• Academic Profile: Target degree, college name, branch, expected graduation year.
• Uploaded Documents: Resumes, PDFs, notes, assignments, and queries uploaded for AI processing.
• Usage Data: Progress on DSA sheets, quiz scores, course completion, attendance logs, and feature interaction.
• Device & Technical Data: Browser type, operating system, and IP address for security and performance optimizations.`
    },
    {
      id: 'privacy-usage',
      title: '3. How We Use Your Information',
      content: `Your data is used strictly to deliver personalized educational experiences:

• Powering AI Study Assistant, AI Resume Builder, and AI Notes Summarizer.
• Tracking academic progress, attendance percentage, and DSA problem completion.
• Managing subscription status and processing payments securely via payment gateways.
• Improving platform performance, AI accuracy, and system security.`
    },
    {
      id: 'privacy-security',
      title: '4. Data Storage & Security',
      content: `• Firestore Encryption: Data is stored securely in Firebase Firestore with strict database security rules.
• Server-Side AI API: Placivo AI keys and sensitive AI calls are processed exclusively server-side.
• No Sale of Data: We NEVER sell, rent, or trade your personal information or uploaded documents to third parties or advertisers.`
    },
    {
      id: 'privacy-rights',
      title: '5. Your Data Rights & Control',
      content: `You have the right to:
• Access, update, or edit your profile data via Settings.
• Delete your account and associated cloud data at any time upon request.
• Export or download your created resumes, notes, and certificates.

For privacy requests, email placivofficial@gmail.com.`
    }
  ];

  const cancellationSections = [
    {
      id: 'cancellation-policy',
      title: '1. Subscription Cancellation Policy',
      content: `At Placivo AI, you can cancel your paid subscription (such as Pro Scholar or Pro Ultimate) at any time through your Account Settings or by contacting placivofficial@gmail.com.

Key details regarding subscription cancellation:
• Instant Processing: When you disable auto-renewal, your account remains active with full premium benefits until the end of your current active billing cycle.
• No Unexpected Automatic Charges: Cancelling auto-renewal prevents any future automatic debits or recurring billings.
• Simple Account Control: You can manage your subscription status anytime under Settings -> Upgrade Plans & Billing.`
    },
    {
      id: 'refund-policy',
      title: '2. Strict No-Refund Policy & Terms of Payment',
      content: `Please review our refund terms carefully before completing any transaction:

• Strict No Money-Back Guarantee: All payments made to Placivo AI for subscriptions, course roadmaps, or premium AI feature unlocks are strictly final and non-refundable. There is no money-back guarantee provided upon subscription purchase.
• Pay At Your Discretion: By proceeding with payment, you acknowledge that fees are non-refundable and agree to complete transactions at your own discretion.
• Dedicated to Your Success: We build Placivo AI with absolute dedication to empowering your academic and campus placement journey. Place your trust in Placivo AI, and let our AI tools, 375 DSA roadmap, ATS resume builder, and mock interview engines accelerate your career!`
    },
    {
      id: 'refund-request-process',
      title: '3. Duplicate Charge & Payment Reconciliation',
      content: `In the rare event of a technical payment failure, duplicate transaction, or if funds were debited from your account without activating your subscription:

1. Contact Support Immediately: Email placivofficial@gmail.com with your payment receipt or UPI reference ID.
2. Direct Verification: Our financial reconciliation team will verify transaction logs with Razorpay/Stripe payment gateways.
3. Fast Resolution: Verified duplicate charges will be refunded 100% to your original payment method within 24 to 48 hours.`
    },
    {
      id: 'non-refundable-conditions',
      title: '4. Summary & Contact Assistance',
      content: `If you have any questions before purchasing a subscription or need guidance choosing the right plan for your placement preparation:

• Email Support: placivofficial@gmail.com
• Official Website: https://placivo.ai`
    }
  ];

  const currentSections = 
    activeTab === 'terms' ? termsSections : 
    activeTab === 'privacy' ? privacySections : 
    cancellationSections;
  const filteredSections = currentSections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-4xl w-full flex flex-col my-auto max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0B1736] text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 relative shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src={placivoAILogo} 
              alt="Placivo AI" 
              className="h-9 w-auto max-h-9 object-contain rounded-2xl" 
            />
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Legal & Governance
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Official Document
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">Effective Date: July 30, 2026 • Last Updated: July 30, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Tab Switcher */}
            <div className="bg-slate-800/90 p-1 rounded-xl flex items-center gap-1 border border-slate-700 overflow-x-auto">
              <button
                onClick={() => setActiveTab('terms')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'terms' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Terms & Conditions
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'privacy' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveTab('cancellation')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'cancellation' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Refund & Cancellation
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-header with search */}
        <div className="bg-slate-50 border-b border-slate-200/80 p-3 sm:px-6 flex items-center justify-between gap-3 shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeTab === 'terms' ? 'Terms & Conditions' : activeTab === 'privacy' ? 'Privacy Policy' : 'Refund & Cancellation Policy'}...`}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-block">
            Showing {filteredSections.length} sections
          </span>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-xs leading-relaxed">
          {filteredSections.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="font-semibold">No clauses found matching "{searchQuery}".</p>
              <button onClick={() => setSearchQuery('')} className="mt-2 text-blue-600 font-bold hover:underline text-xs">
                Clear search query
              </button>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div key={section.id} id={section.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-200 transition-all">
                <h4 className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600 shrink-0" />
                  {section.title}
                </h4>
                <div className="whitespace-pre-line text-slate-600 font-medium leading-relaxed pl-6">
                  {section.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-200/80 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Protected by Placivo AI Legal & Compliance Standards</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="mailto:placivofficial@gmail.com"
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              Email Us
            </a>
            <button
              onClick={onClose}
              className="px-5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              I Understand & Accept
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
