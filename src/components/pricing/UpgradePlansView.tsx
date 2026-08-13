import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  Award, 
  Star,
  CheckCircle2,
  QrCode,
  Flame,
  BookOpen,
  Briefcase,
  Code2,
  X,
  Clock,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { UserProfile } from '../../types';
import { SectionUsageBanner } from '../common/SectionUsageBanner';
import { calculatePlanDetails, PLAN_DEFINITIONS } from '../../lib/planUtils';
import { FirestoreService } from '../../lib/firestoreService';

interface UpgradePlansProps {
  user: UserProfile;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  onPlanPurchased?: (planName: string) => void;
}

export const UpgradePlansView: React.FC<UpgradePlansProps> = ({ user, onUpdateProfile, onPlanPurchased }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{
    id: string;
    name: string;
    price: string;
    rawPrice: number;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Subscription Plan Updated Successfully!');
  const [errorMessage, setErrorMessage] = useState('');

  // Congratulations state with 5-second countdown
  const [congratsState, setCongratsState] = useState<{
    show: boolean;
    planId: string;
    planName: string;
    price: string;
    rawPrice: number;
    pendingUpdateData: Partial<UserProfile>;
    countdown: number;
  } | null>(null);

  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);
  const [hasStartedCancel, setHasStartedCancel] = useState(false);

  const planDetails = calculatePlanDetails(user);

  // Handle countdown interval tick
  useEffect(() => {
    if (!congratsState || !congratsState.show) return;

    if (congratsState.countdown <= 0) {
      // 5-second countdown is over, apply the plan upgrade and clean up!
      const { pendingUpdateData, planId, planName, rawPrice } = congratsState;

      if (onUpdateProfile) {
        onUpdateProfile(pendingUpdateData);
      }

      if (user && user.uid) {
        const fullUpdatedProfile: UserProfile = {
          ...user,
          ...pendingUpdateData
        };
        FirestoreService.saveProfile(fullUpdatedProfile).catch(e => console.warn("Failed to save updated plan profile to Firestore:", e));

        if (planId !== 'free_trial') {
          FirestoreService.recordFinancialTransaction({
            userId: user.uid,
            userName: user.displayName || user.email?.split('@')[0] || 'Student',
            userEmail: user.email || '',
            itemType: 'subscription',
            itemId: planId,
            itemTitle: `Subscription Plan: ${planName}`,
            amount: rawPrice
          }).catch(e => console.warn("Failed to record subscription transaction in Firestore:", e));
        }
      }

      const boughtPlanName = planName;
      setToastMessage(planId === 'free_trial' ? '4-Day Free Trial activated successfully!' : `Upgraded to ${boughtPlanName} (Valid for 30 Days)!`);
      setShowSuccessToast(true);

      if (onPlanPurchased) {
        onPlanPurchased(boughtPlanName);
      }

      setCongratsState(null);
      return;
    }

    const timer = setTimeout(() => {
      setCongratsState(prev => prev ? { ...prev, countdown: prev.countdown - 1 } : null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [congratsState, onUpdateProfile, user, onPlanPurchased]);

  const handleConfirmCancelSubscription = async () => {
    setIsProcessingCancel(true);
    setHasStartedCancel(true);
    setErrorMessage('');

    // Update profile state immediately so UI updates instantly across app and admin panel
    const nowIso = new Date().toISOString();
    const trialExpiry = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString();
    if (onUpdateProfile) {
      onUpdateProfile({
        plan: 'free_trial',
        freeTrialStartedAt: nowIso,
        planStartedAt: nowIso,
        planExpiresAt: trialExpiry,
        planCancelled: false,
        planCancelledAt: nowIso
      });
    }

    try {
      if (user && user.uid) {
        await FirestoreService.cancelUserSubscriptionAndAdjustRevenue(user.uid, user.email);
      }
      setShowCancelModal(false);
      setToastMessage("Subscription cancelled successfully. As warned, paid amounts are non-refundable.");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 6000);
    } catch (err: any) {
      setErrorMessage("Failed to cancel subscription: " + (err.message || err));
    } finally {
      setIsProcessingCancel(false);
    }
  };

  const handleSelectPlan = (plan: typeof PLAN_DEFINITIONS[0]) => {
    setErrorMessage('');
    
    if (plan.id === 'free_trial') {
      if (planDetails.freeTrialUsed) {
        setErrorMessage('Free Trial is valid once per account for 4 days only. You have already used your trial! Please select the ₹99 or ₹399 plan.');
        return;
      }

      // Claim Free Trial (1-time, 4 days)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

      const pendingData: Partial<UserProfile> = {
        plan: 'free_trial',
        freeTrialUsed: true,
        freeTrialStartedAt: now.toISOString(),
        planStartedAt: now.toISOString(),
        planExpiresAt: expiresAt.toISOString()
      };

      setCongratsState({
        show: true,
        planId: 'free_trial',
        planName: '4-Day Free Trial Pass',
        price: '₹0',
        rawPrice: 0,
        pendingUpdateData: pendingData,
        countdown: 5
      });
      return;
    }

    setSelectedPlanForCheckout({
      id: plan.id,
      name: plan.name,
      price: billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly,
      rawPrice: plan.rawPrice || 99
    });
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForCheckout) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Proceed with Congratulations screen overlay instead of instant activation

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 Days Renewal

      const updatedData: Partial<UserProfile> = {
        plan: selectedPlanForCheckout.id,
        planStartedAt: now.toISOString(),
        planExpiresAt: expiresAt.toISOString(),
        planCancelled: false,
        planCancelledAt: undefined
      };

      if (onUpdateProfile) {
        // updated after congratulations countdown
      }

      if (false && user && user.uid) {
        const fullUpdatedProfile: UserProfile = {
          ...user,
          ...updatedData
        };
        FirestoreService.saveProfile(fullUpdatedProfile).catch(e => console.warn("Failed to save updated plan profile to Firestore:", e));

        FirestoreService.recordFinancialTransaction({
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'Student',
          userEmail: user.email || '',
          itemType: 'subscription',
          itemId: selectedPlanForCheckout.id,
          itemTitle: `Subscription Plan: ${selectedPlanForCheckout.name}`,
          amount: selectedPlanForCheckout.rawPrice
        }).catch(e => console.warn("Failed to record subscription transaction in Firestore:", e));
      }

      setCongratsState({
        show: true,
        planId: selectedPlanForCheckout.id,
        planName: selectedPlanForCheckout.name,
        price: selectedPlanForCheckout.price,
        rawPrice: selectedPlanForCheckout.rawPrice,
        pendingUpdateData: updatedData,
        countdown: 5
      });
      setSelectedPlanForCheckout(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Banner */}
      <SectionUsageBanner
        title="Placivo Upgrade & Subscription Plans"
        subtitle="Choose the ideal plan to accelerate your academic grades, DSA mastery, and placement success"
        purpose="Upgrade to unlock unlimited AI Academic Tutor Chat, full Placivo 375 DSA Roadmap Code Coach, unlimited ATS Resume Scans, and Technical Interview Prep."
        keyFeatures={[
          '3 Plans: 4-Day Free Trial (Choose When to Start), ₹99 & ₹399 Plans',
          '30-Day Auto Renewal Cycles for Pro Scholar & Ultimate Plans',
          'Unlimited AI Study Suites, AI Academic Tutor Chat & 375 DSA Sheet Solutions',
          'Instant Activation via UPI, QR Code, Net Banking, or Cards'
        ]}
        icon={<Zap className="w-6 h-6 text-white" />}
        badge="Subscription Portal"
      />

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <div>
              <p className="font-extrabold text-sm">{toastMessage}</p>
              <p className="text-xs text-emerald-100">Your account features have been updated in real-time.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSuccessToast(false)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error / Alert Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs font-bold">{errorMessage}</p>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-amber-500 hover:text-amber-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Current Active Plan Header Status (Only show when plan is active and not cancelled) */}
      {planDetails.hasActiveAccess && !user?.planCancelled && (
        <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-white/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500">Active Account Plan:</span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wide border ${
                  (planDetails.currentPlanId === 'plan_349' || planDetails.currentPlanId === 'plan_399')
                    ? 'bg-indigo-100 text-indigo-900 border-indigo-200'
                    : planDetails.currentPlanId === 'plan_199'
                    ? 'bg-blue-100 text-blue-900 border-blue-200'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                }`}>
                  {planDetails.planName}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200/80 shadow-3d-sm">
                  <Clock className="w-3 h-3" />
                  {`${planDetails.daysRemaining} Days Remaining`}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium mt-1">
                Started on: <span className="font-bold text-slate-900">{planDetails.formattedStartedAt}</span> • Valid until: <span className="font-bold text-slate-900">{planDetails.formattedExpiresAt}</span>
              </p>
            </div>
          </div>

          {/* Cancel Subscription & Cycle Switcher */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
            {(planDetails.currentPlanId === 'plan_199' || planDetails.currentPlanId === 'plan_349' || planDetails.currentPlanId === 'plan_399') && (
              <button
                onClick={() => {
                  setHasStartedCancel(false);
                  setShowCancelModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Cancel Subscription Any Time"
              >
                <X className="w-3.5 h-3.5 text-rose-600" />
                <span>Cancel Subscription</span>
              </button>
            )}

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30-Day Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-md font-extrabold">Save 20%</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3 Upgrade Plan Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {PLAN_DEFINITIONS.map((plan) => {
          const isCurrentActive = planDetails.currentPlanId === plan.id && !planDetails.isExpired;
          const isTrialUsed = plan.id === 'free_trial' && planDetails.freeTrialUsed;
          const displayPrice = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

          // Check if active plan is Ultimate or Scholar Pass
          const isUltimateActive = (planDetails.currentPlanId === 'plan_349' || planDetails.currentPlanId === 'plan_399') && planDetails.hasActiveAccess && !planDetails.isExpired;
          const isScholarActive = planDetails.currentPlanId === 'plan_199' && planDetails.hasActiveAccess && !planDetails.isExpired;

          // Check if this card is included in the user's active higher-level plan
          const isIncludedInActive = (isUltimateActive && (plan.id === 'free_trial' || plan.id === 'plan_199')) || (isScholarActive && plan.id === 'free_trial');

          let buttonText = 'Upgrade Now';
          let isDisabled = false;

          if (isIncludedInActive) {
            buttonText = isUltimateActive ? 'Included in Pro Ultimate' : 'Included in Pro Scholar';
            isDisabled = true;
          } else if (plan.id === 'free_trial') {
            if (isCurrentActive) {
              buttonText = 'Active Free Trial (4 Days Pass)';
              isDisabled = true;
            } else if (isTrialUsed) {
              buttonText = 'Trial Expired';
              isDisabled = true;
            } else {
              buttonText = 'Start 4-Day Free Trial (₹0)';
              isDisabled = false;
            }
          } else {
            if (isCurrentActive) {
              buttonText = 'Active Plan (Renew 30 Days)';
              isDisabled = false; // User can extend/renew anytime!
            } else {
              buttonText = `Upgrade to ${plan.priceMonthly} Plan`;
              isDisabled = false;
            }
          }

          // Let's configure beautiful styling tokens for each specific card
          let cardBgClass = '';
          let accentTextClass = '';
          let featureIconColor = '';
          let topBarGlow = null;
          let usageBoxBgClass = '';
          let usageBoxBorderClass = '';
          let badgeOverride = '';

          if (plan.id === 'free_trial') {
            cardBgClass = 'bg-gradient-to-br from-emerald-50/50 via-teal-50/5 to-white border border-emerald-200 shadow-3d-emerald hover:border-emerald-300';
            accentTextClass = 'text-emerald-700';
            featureIconColor = 'text-emerald-600';
            usageBoxBgClass = 'bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent';
            usageBoxBorderClass = 'border-emerald-200/60';
            badgeOverride = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            topBarGlow = (
              <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
            );
          } else if (plan.id === 'plan_199') {
            cardBgClass = 'bg-gradient-to-br from-blue-50/50 via-sky-50/5 to-white border-2 border-blue-600 shadow-3d-blue lg:-translate-y-2 z-10';
            accentTextClass = 'text-blue-700';
            featureIconColor = 'text-blue-600';
            usageBoxBgClass = 'bg-gradient-to-r from-blue-500/5 via-sky-500/5 to-transparent';
            usageBoxBorderClass = 'border-blue-200/60';
            badgeOverride = 'bg-blue-600 text-white border-transparent shadow-xs';
            topBarGlow = (
              <div className="absolute top-0 inset-x-0 h-2 rounded-t-3xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
            );
          } else {
            cardBgClass = 'bg-gradient-to-br from-purple-50/60 via-pink-50/10 to-white border-2 border-indigo-600 shadow-3d-indigo lg:-translate-y-2 z-10 overflow-hidden';
            accentTextClass = 'text-indigo-700';
            featureIconColor = 'text-purple-600';
            usageBoxBgClass = 'bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent';
            usageBoxBorderClass = 'border-indigo-200/60';
            badgeOverride = 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-transparent shadow-xs';
            topBarGlow = (
              <>
                <div className="absolute top-0 inset-x-0 h-2 rounded-t-3xl bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-amber-500" />
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-200/40 rounded-full blur-2xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-pink-200/30 rounded-full blur-2xl pointer-events-none" />
              </>
            );
          }

          return (
            <div
              key={plan.id}
              className={`p-7 rounded-3xl backdrop-blur-xl flex flex-col justify-between relative transition-all duration-300 card-3d ${cardBgClass}`}
            >
              {topBarGlow}
              <div>
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${badgeOverride}`}>
                    {plan.badge}
                  </span>
                  {isIncludedInActive ? (
                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" /> Included in Plan
                    </span>
                  ) : plan.popular ? (
                    <span className={`flex items-center gap-1 text-[11px] font-extrabold ${plan.id === 'plan_399' ? 'text-indigo-600' : 'text-blue-600'}`}>
                      <Star className={`w-3.5 h-3.5 ${plan.id === 'plan_399' ? 'fill-indigo-600 text-indigo-600' : 'fill-blue-600 text-blue-600'}`} /> Most Recommended
                    </span>
                  ) : null}
                </div>

                {/* Plan Name & Tagline */}
                <h3 className="text-xl font-black text-slate-800">{plan.name}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 min-h-[32px]">{plan.tagline}</p>

                {/* Price Display */}
                <div className="mt-5 mb-5 pb-5 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-800 tracking-tight">{displayPrice}</span>
                    <span className="text-xs font-bold text-slate-500">{plan.period}</span>
                  </div>
                </div>

                {/* Amount of Uses Badge Box */}
                <div className={`mb-5 p-3.5 rounded-2xl border ${usageBoxBgClass} ${usageBoxBorderClass} space-y-1.5`}>
                  <p className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center justify-between">
                    <span>Feature Usage Amounts:</span>
                    <span className={`${accentTextClass} font-black`}>{plan.period}</span>
                  </p>
                  <div className="grid grid-cols-1 gap-1 text-[11px] font-bold text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">AI Study Suites:</span>
                      <span className="text-slate-800 font-extrabold">{plan.usageLimits.studySuites}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">AI Academic Tutor:</span>
                      <span className="text-slate-800 font-extrabold">{plan.usageLimits.assignmentSolver}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">ATS Resume Scans:</span>
                      <span className="text-slate-800 font-extrabold">{plan.usageLimits.resumeScans}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">375 DSA Sheet AI:</span>
                      <span className="text-slate-800 font-extrabold">{plan.usageLimits.dsaSolutions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Interview Prep & Qs:</span>
                      <span className="text-slate-800 font-extrabold">{plan.usageLimits.interviewPrep}</span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">What's included:</p>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${featureIconColor}`} />
                      <span>{feat}</span>
                    </div>
                  ))}

                  {plan.notIncluded && plan.notIncluded.length > 0 && (
                    <div className="pt-2 space-y-2">
                      {plan.notIncluded.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs font-medium text-slate-400">
                          <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                          <span className="line-through">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action CTA Button */}
              <button
                disabled={isDisabled}
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isIncludedInActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-not-allowed shadow-2xs font-extrabold'
                    : isDisabled
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : plan.id === 'plan_199'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md btn-3d-blue'
                    : plan.id === 'plan_399'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md btn-3d-indigo'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md btn-3d-emerald'
                }`}
              >
                {isIncludedInActive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{buttonText}</span>
                  </>
                ) : isDisabled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{buttonText}</span>
                  </>
                ) : isCurrentActive ? (
                  <>
                    <RotateCw className="w-4 h-4 text-white shrink-0" />
                    <span>Renew Plan (+30 Days)</span>
                  </>
                ) : (
                  <>
                    <span>{buttonText}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Matrix Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-blue-600 fill-blue-600" /> Detailed Plan Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-extrabold">
                <th className="py-3 px-4 w-2/5">Feature / Capability</th>
                <th className="py-3 px-4 text-center">Free Trial (4 Days 1x)</th>
                <th className="py-3 px-4 text-center text-blue-600">Pro Scholar (₹99 / 30 Days)</th>
                <th className="py-3 px-4 text-center text-indigo-600">Placivo Pro Ultimate (₹399 / 30 Days)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> AI Study Suite Generations
                </td>
                <td className="py-3.5 px-4 text-center text-slate-600 font-extrabold">1 / Day</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-blue-600">5 / Week</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-indigo-600">10 / Week</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-600" /> Placivo 375 DSA Roadmap Sheet
                </td>
                <td className="py-3.5 px-4 text-center text-slate-600 font-extrabold">3 Solutions / day</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-blue-600">UNLIMITED Sheet AI</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-indigo-600">UNLIMITED Code Coach</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" /> ATS Resume Scans & Builder
                </td>
                <td className="py-3.5 px-4 text-center text-slate-600 font-extrabold">1 Audit / Day</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-blue-600">5 Scans / Month</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-indigo-600">10 Scans / Month</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" /> Technical Interview Prep Suite
                </td>
                <td className="py-3.5 px-4 text-center text-slate-600 font-extrabold">
                  <span className="line-through text-slate-400 font-medium">Subjects Question Bank</span>
                </td>
                <td className="py-3.5 px-4 text-center font-extrabold text-blue-600">Full Access (256 Subjects)</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-indigo-600">UNLIMITED (All 256 Subjects)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" /> AI Academic Tutor
                </td>
                <td className="py-3.5 px-4 text-center text-slate-600 font-extrabold">1 Session / Day</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-blue-600">3 / Day</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-indigo-600">10 / Week</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  Instant 30-Day Subscription
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Checkout: {selectedPlanForCheckout.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700">Selected Plan</p>
                <p className="text-sm font-extrabold text-blue-900">{selectedPlanForCheckout.name}</p>
                <p className="text-[10px] text-slate-500">Valid for 30 days from today</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-blue-600">{selectedPlanForCheckout.price}</p>
                <p className="text-[10px] text-slate-500 font-medium">Billed {billingCycle}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'upi'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>UPI ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qr')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'qr'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Cards</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. username@gpay or 9876543210@paytm"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>
              )}

              {paymentMethod === 'qr' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
                  <div className="w-32 h-32 bg-white p-2 mx-auto rounded-xl flex items-center justify-center border-4 border-blue-500 shadow-sm">
                    <QrCode className="w-24 h-24 text-slate-800" />
                  </div>
                  <p className="text-xs text-slate-700 font-bold">Scan with Google Pay, PhonePe, or Paytm</p>
                  <p className="text-[10px] text-slate-500">Merchant: Placivo AI Student Services</p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Card Number (4242 •••• •••• 4242)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Activate {selectedPlanForCheckout.name} ({selectedPlanForCheckout.price})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Cancellation Warning Modal */}
      {showCancelModal && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isProcessingCancel && !hasStartedCancel) {
              setShowCancelModal(false);
            }
          }}
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-rose-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 border-b border-rose-100 pb-4">
              <div className="p-2.5 bg-rose-100 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Cancel Subscription Warning</h3>
                <p className="text-xs text-rose-600 font-bold">Important Notice & Risk Acknowledgment</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <p className="text-xs font-black text-rose-900 leading-relaxed">
                ⚠️ Warning: The amount which has been paid will not be refunded any more so please cancel the subscription on your own risk.
              </p>
              <p className="text-[11px] text-rose-700 font-medium leading-normal">
                Once cancelled, your plan will revert to Free Tier and premium AI access will be revoked. Please note that subscription payments are strictly non-refundable and there is no money-back guarantee, so proceed at your own discretion. Trust Placivo AI to make your career better!
              </p>
            </div>

            {hasStartedCancel && (
              <div className="p-2.5 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0"></div>
                <span>Cancellation process started. 'Keep My Subscription' is blocked forever.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isProcessingCancel || hasStartedCancel}
                onClick={() => {
                  if (!isProcessingCancel && !hasStartedCancel) {
                    setShowCancelModal(false);
                  }
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isProcessingCancel || hasStartedCancel
                    ? 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed border border-slate-200 pointer-events-none'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
                }`}
                title={isProcessingCancel || hasStartedCancel ? "Keep My Subscription is blocked forever once cancellation starts" : "Keep My Subscription"}
              >
                Keep My Subscription
              </button>
              <button
                type="button"
                disabled={isProcessingCancel || hasStartedCancel}
                onClick={handleConfirmCancelSubscription}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessingCancel ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Cancelling Subscription...</span>
                  </>
                ) : (
                  <span>Cancel Subscription At My Own Risk</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations / Redirection Screen Overlay (5 Seconds Countdown) */}
      {congratsState && congratsState.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 text-center overflow-hidden shadow-2xl space-y-6">
            
            {/* Ambient Background Glows */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Animated particles simulating confetti */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, idx) => {
                const colors = ['#FCD34D', '#F472B6', '#60A5FA', '#34D399', '#A78BFA'];
                const randColor = colors[idx % colors.length];
                const randLeft = `${Math.random() * 100}%`;
                const randDelay = `${Math.random() * 2}s`;
                const randDuration = `${3 + Math.random() * 3}s`;
                return (
                  <div 
                    key={idx}
                    className="absolute w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: randColor,
                      left: randLeft,
                      top: `-10px`,
                      animationDelay: randDelay,
                      animationDuration: randDuration,
                      opacity: 0.7,
                    }}
                  />
                );
              })}
            </div>

            {/* Main Trophy Icon with Waves */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping" style={{ animationDuration: '2.5s' }} />
              <div className="absolute inset-2 bg-purple-500/5 rounded-full animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Award className="w-9 h-9 text-white animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
            </div>

            {/* Typographical Headings */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Zap className="w-3 h-3 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} /> Subscription Activated <Zap className="w-3 h-3 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
              </span>
              <h2 className="text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Congratulations!
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Your premium academic & career accelerator workspace is being unlocked.
              </p>
            </div>

            {/* Display Purchased Plan details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 max-w-sm mx-auto">
              <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Activated Premium Subscription</p>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-black text-slate-800">{congratsState.planName}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] text-indigo-600 font-bold">
                <span>30-Day Pass</span>
                <span>•</span>
                <span>{congratsState.price}</span>
              </div>
            </div>

            {/* Redirection countdown with a stylized progress bar */}
            <div className="space-y-3 max-w-xs mx-auto pt-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Syncing cloud access...</span>
                <span className="text-indigo-600 font-extrabold">Redirecting in {congratsState.countdown}s</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(congratsState.countdown / 5) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Applying model profiles, database sync, and unlocking academic features...
              </p>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

