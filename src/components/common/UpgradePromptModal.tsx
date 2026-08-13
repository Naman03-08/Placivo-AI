import React from 'react';
import { Zap, Clock, Lock, ArrowRight, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../../types';
import { calculatePlanDetails } from '../../lib/planUtils';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onStartTrial: () => void;
  onNavigateToPricing: () => void;
  featureName?: string;
}

export const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({
  isOpen,
  onClose,
  user,
  onStartTrial,
  onNavigateToPricing,
  featureName = 'this AI feature'
}) => {
  if (!isOpen) return null;

  const planDetails = calculatePlanDetails(user);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800">
        
        {/* Top Header Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Feature Access Locked
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                Upgrade to Pro Plan Required
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-950 space-y-1">
            <p className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Please upgrade to a Pro Plan or start your 4-Day Free Trial</span>
            </p>
            <p className="text-xs text-blue-800/90 leading-relaxed pl-5">
              To unlock full access to <strong className="text-blue-950">{featureName}</strong>, study suites, DSA solutions, and AI study tools, please select an option below:
            </p>
          </div>

          {/* Action Options */}
          <div className="space-y-3">
            {!planDetails.freeTrialUsed && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-950">4-Day Free Trial Available</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                    Start your 4-day full access pass now (No credit card required).
                  </p>
                </div>

                <button
                  onClick={() => {
                    onStartTrial();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>Start 4-Day Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black text-blue-950">Pro Scholar & Ultimate Plans</span>
                </div>
                <p className="text-[11px] text-blue-800 font-medium mt-0.5">
                  Starting at ₹69/month for unlimited AI tools & interview prep.
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigateToPricing();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/30 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <span>Upgrade to Pro Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Features Highlights */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
              Pro Scholar Features Include:
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Unlimited AI Academic Tutor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Placivo 375 DSA Roadmap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>High-Score ATS Resume Scans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Technical Interview Prep Bank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            You can still browse website overview pages anytime.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Browse Only
          </button>
        </div>

      </div>
    </div>
  );
};
