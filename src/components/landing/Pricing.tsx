import React, { useState } from 'react';
import { Check, Zap } from 'lucide-react';

interface PricingProps {
  onOpenAuth: (mode: 'register') => void;
}

export const Pricing: React.FC<PricingProps> = ({ onOpenAuth }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free Trial',
      price: '₹0',
      period: '4 Days Free',
      desc: 'Essential AI study tools & basic DSA sheet tracking for every student.',
      features: [
        '4 Days Full Access to basic tools',
        '5 AI Study Suite generations/month',
        '3 Placivo 375 DSA question AI solutions / day',
        'Attendance Manager & Timetable Scheduler',
        'Basic AI Academic Tutor & Standard Resume Builder',
      ],
      popular: false,
      cta: 'Start Free Trial',
    },
    {
      name: 'Pro Scholar',
      price: isAnnual ? '₹79' : '₹99',
      period: 'per month',
      desc: 'Unlimited AI study tutoring, DSA sheet solutions & full study suites for active students.',
      features: [
        'Unlimited AI Academic Tutor Chat with step-by-step logic',
        'Complete Placivo 375 DSA Roadmap Sheet access',
        '15 High-Score ATS Resume Scans per month',
        'Unlimited AI Study Suites & Flashcard Generators',
        'Smart Calendar Auto-Scheduler with exam alerts',
        '24/7 AI Tutor Chat Assistant for College Subjects',
      ],
      popular: true,
      cta: 'Upgrade to ₹99 Plan',
    },
    {
      name: 'Placivo Pro Ultimate',
      price: isAnnual ? '₹319' : '₹399',
      period: 'per month',
      desc: 'Complete placement & technical interview preparation pass with 1-on-1 AI placement coaching.',
      features: [
        'Everything in ₹99 Plan PLUS:',
        'Unlimited 1-on-1 Technical Interview Question Bank Access (256 Subjects)',
        'Unlimited High-Score ATS Resume Builder & Job Matcher',
        'Instant 375 DSA Code Coach (C++, Java, Python, TS)',
        '1-on-1 AI Placement Mentor & Company Interview Insights',
        'Verified Placivo Completion Certificate',
      ],
      popular: false,
      cta: 'Upgrade to ₹399 Plan',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-transparent border-t border-white/40">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50/80 backdrop-blur-md px-3 py-1 rounded-full border border-blue-200">
            Simple Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            Invest In Your Academic Future
          </h2>
          <p className="text-base text-slate-600 mt-3">
            Student-friendly plans designed to fit every college budget.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-blue-600 p-1 flex items-center transition-all cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
            <span className={`text-xs font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual <span className="text-emerald-700 bg-emerald-100/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-emerald-200">Save 25%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl bg-white/45 backdrop-blur-xl flex flex-col justify-between relative transition-all ${
                plan.popular
                  ? 'border-2 border-blue-500 bg-white/60 shadow-xl scale-105 z-10'
                  : 'border border-white/70 shadow-sm hover:bg-white/60'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Zap className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/ {plan.period}</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onOpenAuth('register')}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
