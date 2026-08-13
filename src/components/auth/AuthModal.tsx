import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Mail, Lock, User, ArrowRight, CheckCircle2, Phone, Building2, BookOpen, Bot, KeyRound, ShieldCheck, RefreshCw, ExternalLink, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { auth, googleProvider, db } from '../../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDailyKey } from '../../lib/planUtils';
import { UserProfile } from '../../types';
import { StorageService } from '../../lib/storage';
import { FirestoreService } from '../../lib/firestoreService';
import logoImg from '../landing/Placivo-logo.png';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  onOpenTerms?: (tab?: 'terms' | 'privacy' | 'cancellation') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
  onOpenTerms,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'google-onboarding'>(initialMode);
  const [accountType, setAccountType] = useState<'general' | 'student'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [university, setUniversity] = useState('');
  const [stream, setStream] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [emailValidationError, setEmailValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // OTP Password Reset States
  const [otpStep, setOtpStep] = useState<1 | 2 | 3 | 4>(1); // 1: Email, 2: OTP Entry, 3: New Password, 4: Success
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [devOtpNotice, setDevOtpNotice] = useState('');
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Hold Google Auth User credentials when completing Google onboarding
  const [googleAuthUser, setGoogleAuthUser] = useState<any>(null);

  // Helper to check and increment daily auth rate limits
  const checkAndIncrementAuthLimit = async (emailStr: string): Promise<{ allowed: boolean; count: number }> => {
    const cleanEmail = emailStr.trim().toLowerCase();
    if (!cleanEmail) return { allowed: true, count: 0 };

    const dailyKey = getDailyKey();

    // 1. LocalStorage count check
    const localKey = `auth_attempts_${cleanEmail}_${dailyKey}`;
    const localCount = parseInt(localStorage.getItem(localKey) || '0', 10);

    if (localCount >= 5) {
      return { allowed: false, count: localCount };
    }

    // 2. Firestore count check (cross-device & persistent)
    let firestoreCount = 0;
    if (db) {
      try {
        const docRef = doc(db, 'authRateLimits', `${cleanEmail}_${dailyKey}`);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          firestoreCount = snap.data().count || 0;
        }
      } catch (e) {
        console.warn('Firestore check auth rate limit error:', e);
      }
    }

    const currentMax = Math.max(localCount, firestoreCount);

    if (currentMax >= 5) {
      if (localCount < currentMax) {
        localStorage.setItem(localKey, currentMax.toString());
      }
      return { allowed: false, count: currentMax };
    }

    // 3. Increment both local & Firestore
    const nextCount = currentMax + 1;
    localStorage.setItem(localKey, nextCount.toString());

    if (db) {
      try {
        const docRef = doc(db, 'authRateLimits', `${cleanEmail}_${dailyKey}`);
        await setDoc(docRef, {
          email: cleanEmail,
          date: dailyKey,
          count: nextCount,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Firestore increment auth rate limit error:', e);
      }
    }

    return { allowed: true, count: nextCount };
  };

  // Sync mode with initialMode and reset errors when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setEmailValidationError('');
    }
  }, [isOpen, initialMode]);

  // Cooldown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Dedicated Firebase Password Reset Handler
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailValidationError('');

    const cleanEmail = email.trim().toLowerCase();

    // 1. Validation Checks
    if (!cleanEmail) {
      setEmailValidationError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setEmailValidationError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // 2. Google Sign-In Detection
      if (auth) {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, cleanEmail);
          if (methods && methods.includes('google.com') && !methods.includes('password')) {
            setErrorMsg('This account uses Google Sign-In. Please continue using the "Sign in with Google" button.');
            setLoading(false);
            return;
          }
        } catch (checkErr: any) {
          console.warn('Google Sign-In check warning:', checkErr);
          if (checkErr?.code === 'auth/account-exists-with-different-credential') {
            setErrorMsg('This account uses Google Sign-In. Please continue using the "Sign in with Google" button.');
            setLoading(false);
            return;
          }
        }
      }

      // 3. Send Password Reset Email via Firebase Authentication
      if (auth) {
        try {
          await sendPasswordResetEmail(auth, cleanEmail);
          console.log('[Firebase Auth] Password reset email dispatched to:', cleanEmail);
        } catch (fbErr: any) {
          console.warn('[Firebase Auth] Password reset notice:', fbErr);
          if (fbErr?.code === 'auth/invalid-email' || fbErr?.code === 'auth/user-disabled') {
            throw fbErr;
          }
        }
      }

      // 4. Send Email & OTP via Backend Nodemailer Engine (ensures real SMTP delivery + Ethereal test inbox fallback)
      try {
        const res = await fetch('/api/auth/send-reset-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail }),
        });
        const data = await res.json();
        if (data.emailPreviewUrl) {
          setEmailPreviewUrl(data.emailPreviewUrl);
        }
        if (data.devOtp) {
          setDevOtpNotice(`OTP Code: ${data.devOtp}`);
        }
      } catch (apiErr) {
        console.warn('[Server Mailer] Notice sending backend reset mail:', apiErr);
      }

      setResetSent(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      const code = err?.code || '';
      if (code === 'auth/invalid-email') {
        setEmailValidationError('Please enter a valid email address.');
      } else if (code === 'auth/user-not-found') {
        setErrorMsg('No account found with this email address.');
      } else if (code === 'auth/too-many-requests') {
        setErrorMsg('Too many password reset requests. Please try again later.');
      } else if (code === 'auth/network-request-failed') {
        setErrorMsg('Network error. Please check your internet connection and try again.');
      } else if (code === 'auth/user-disabled') {
        setErrorMsg('This account has been disabled. Please contact support.');
      } else {
        setErrorMsg(err?.message || 'Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = async () => {
    if (mode === 'google-onboarding' || mode === 'register') {
      if (auth && auth.currentUser) {
        try {
          await auth.signOut();
        } catch (e) {
          // ignore signout errors
        }
      }
    }
    onClose();
  };

  // OTP Step 1: Request 6-Digit OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid student email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setDevOtpNotice('');
    setEmailPreviewUrl(null);

    try {
      let fbNotice = '';
      if (auth) {
        try {
          await sendPasswordResetEmail(auth, email.trim());
          console.log("[Firebase Auth] Password reset email dispatched directly to real inbox:", email.trim());
        } catch (fbErr: any) {
          console.warn("[Firebase Auth] Password reset email note:", fbErr);
          if (fbErr?.code === 'auth/user-not-found') {
            fbNotice = ' (Firebase Auth user account not found for this email, but 6-digit OTP code generated below).';
          }
        }
      }

      const res = await fetch('/api/auth/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to send OTP code.');
      }

      setOtpStep(2);
      setResendCooldown(60);
      if (data.emailPreviewUrl) {
        setEmailPreviewUrl(data.emailPreviewUrl);
      }
      if (data.devOtp) {
        setDevOtpNotice(`Real email & 6-digit OTP code dispatched to ${email.trim()}${fbNotice} (Dev OTP preview: ${data.devOtp}).`);
      } else {
        setDevOtpNotice(`Real email & 6-digit OTP code dispatched to ${email.trim()}.${fbNotice}`);
      }
    } catch (err: any) {
      console.error("OTP send error:", err);
      // Fallback: Also send standard Firebase password reset email
      if (auth) {
        try {
          await sendPasswordResetEmail(auth, email.trim());
          setResetSent(true);
        } catch (fbErr: any) {
          setErrorMsg(err.message || fbErr.message || 'Failed to send OTP reset code.');
        }
      } else {
        setErrorMsg(err.message || 'Failed to send OTP reset code.');
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP Step 2: Verify 6-Digit OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otpCode.trim() }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Invalid OTP code.');
      }

      setResetToken(data.resetToken);
      setOtpStep(3);
    } catch (err: any) {
      console.error("OTP verify error:", err);
      setErrorMsg(err.message || 'OTP verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Step 3: Complete Password Reset with New Password
  const handleCompletePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/reset-password-with-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          resetToken,
          newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to update password.');
      }

      // If user is currently signed in via Firebase, update password directly
      if (auth && auth.currentUser) {
        try {
          await updatePassword(auth.currentUser, newPassword);
        } catch (e) {
          // ignore if reauth is needed
        }
      }

      setOtpStep(4);
      setPassword(newPassword);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (auth) {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        
        const targetEmail = fbUser.email || '';
        if (targetEmail) {
          const limitCheck = await checkAndIncrementAuthLimit(targetEmail);
          if (!limitCheck.allowed) {
            setErrorMsg('Your limit is exceeded, please try after some time.');
            try {
              await auth.signOut();
            } catch (e) {}
            setLoading(false);
            return;
          }
        }

        // Try fetching existing profile from Firestore
        let existingProfile = await FirestoreService.getProfile(fbUser.uid);

        // Check if existing profile is complete with contact details, university & stream
        if (
          existingProfile && 
          existingProfile.contactDetails && 
          existingProfile.university && 
          (existingProfile.stream || existingProfile.major)
        ) {
          StorageService.saveProfile(existingProfile);
          StorageService.setIsLoggedIn(true);
          onSuccess(existingProfile);
          return;
        }

        // Needs Google Onboarding form to fill contact, stream, university, name & email
        setGoogleAuthUser(fbUser);
        setDisplayName(fbUser.displayName || existingProfile?.displayName || '');
        setEmail(fbUser.email || existingProfile?.email || '');
        if (existingProfile?.university) setUniversity(existingProfile.university);
        if (existingProfile?.stream || existingProfile?.major) setStream(existingProfile.stream || existingProfile.major || '');
        if (existingProfile?.contactDetails || existingProfile?.phone) setContactDetails(existingProfile.contactDetails || existingProfile.phone || '');
        
        setMode('google-onboarding');
      } else {
        // Fallback local Google Auth prompt
        const targetEmail = email || 'student@campus.edu';
        const limitCheck = await checkAndIncrementAuthLimit(targetEmail);
        if (!limitCheck.allowed) {
          setErrorMsg('Your limit is exceeded, please try after some time.');
          setLoading(false);
          return;
        }

        setGoogleAuthUser({
          uid: 'google_local_' + Date.now(),
          email: email || '',
          displayName: displayName || '',
        });
        setMode('google-onboarding');
      }
    } catch (err: any) {
      console.warn("Google Auth error:", err);
      if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        setErrorMsg('UNAUTHORIZED_DOMAIN');
      } else {
        setErrorMsg(err.message || 'Google Auth Error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInstantGuestLogin = async () => {
    setErrorMsg('');
    const targetEmail = email || 'student@campus.edu';
    const limitCheck = await checkAndIncrementAuthLimit(targetEmail);
    if (!limitCheck.allowed) {
      setErrorMsg('Your limit is exceeded, please try after some time.');
      return;
    }

    const profile: UserProfile = {
      uid: 'guest_' + Date.now(),
      email: email || 'student@campus.edu',
      displayName: displayName || 'Student User',
      role: 'student',
      university: university || 'Campus University',
      major: stream || 'Computer Science',
      stream: stream || 'Computer Science',
      contactDetails: contactDetails || '+91 9876543210',
      phone: contactDetails || '+91 9876543210',
      year: '1st Year',
      gpaGoal: 3.9,
      targetRole: 'Software Engineer',
      createdAt: new Date().toISOString(),
    };
    StorageService.saveProfile(profile);
    StorageService.setIsLoggedIn(true);
    onSuccess(profile);
  };

  const handleAdminInstantLogin = async () => {
    setErrorMsg('');
    const targetEmail = 'naman03mgs@gmail.com';
    const limitCheck = await checkAndIncrementAuthLimit(targetEmail);
    if (!limitCheck.allowed) {
      setErrorMsg('Your limit is exceeded, please try after some time.');
      return;
    }

    const profile: UserProfile = {
      uid: 'admin_naman03mgs',
      email: 'naman03mgs@gmail.com',
      displayName: 'Naman Pandey (Admin)',
      role: 'admin',
      university: 'Engineering Institute',
      major: 'Artificial Intelligence & Engineering',
      stream: 'Artificial Intelligence & Engineering',
      contactDetails: '+91 9876543210',
      phone: '+91 9876543210',
      year: '4th Year',
      gpaGoal: 4.0,
      targetRole: 'Platform Administrator',
      plan: 'pro_monthly',
      createdAt: new Date().toISOString(),
    };
    StorageService.saveProfile(profile);
    StorageService.setIsLoggedIn(true);
    onSuccess(profile);
  };

  const handleGoogleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // STRICT VALIDATION: If any form field is missing, fail registration and do NOT store user in Firebase
    if (!displayName.trim() || !email.trim() || !university.trim() || !stream.trim() || !contactDetails.trim()) {
      setErrorMsg('Sign up failed: Please fill in all required form fields (Full Name, Email, University, Stream, and Contact Details).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const uid = googleAuthUser?.uid || 'google_user_' + Date.now();
      const userEmail = googleAuthUser?.email || email;
      const userPhoto = googleAuthUser?.photoURL || undefined;

      let existingProfile = await FirestoreService.getProfile(uid);

      let profile: UserProfile;
      if (!existingProfile) {
        // Initialize user data with zero defaults & user details
        profile = await FirestoreService.initializeNewUserWithZeroData(uid, userEmail, displayName, {
          university,
          stream,
          contactDetails
        });
        profile.photoURL = userPhoto;
      } else {
        profile = {
          ...existingProfile,
          displayName: displayName || existingProfile.displayName,
          email: userEmail || existingProfile.email,
          university,
          major: stream,
          stream,
          contactDetails,
          phone: contactDetails,
          photoURL: userPhoto || existingProfile.photoURL,
        };
      }

      StorageService.saveProfile(profile);
      StorageService.setIsLoggedIn(true);
      await FirestoreService.saveProfile(profile);
      onSuccess(profile);
    } catch (err: any) {
      console.error("Google onboarding save error:", err);
      setErrorMsg('Sign up failed: ' + (err.message || 'Could not complete Google account registration.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'google-onboarding') {
      return handleGoogleOnboardingSubmit(e);
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'forgot') {
        if (auth) {
          await sendPasswordResetEmail(auth, email);
        }
        setResetSent(true);
        setLoading(false);
        return;
      }

      if (mode === 'login') {
        const targetEmail = email.trim().toLowerCase();
        if (!targetEmail) {
          setErrorMsg('Please enter your email address.');
          setLoading(false);
          return;
        }

        const limitCheck = await checkAndIncrementAuthLimit(targetEmail);
        if (!limitCheck.allowed) {
          setErrorMsg('Your limit is exceeded, please try after some time.');
          setLoading(false);
          return;
        }

        if (auth) {
          try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            let existingProfile = await FirestoreService.getProfile(res.user.uid);
            
            if (!existingProfile) {
              const init = StorageService.initializeZeroUserStorage(res.user.uid, res.user.email || email, res.user.displayName || email.split('@')[0], {
                university: university || 'Campus University',
                stream: stream || 'Computer Science',
                contactDetails: contactDetails || ''
              });
              existingProfile = await FirestoreService.initializeNewUserWithZeroData(res.user.uid, res.user.email || email, res.user.displayName || email.split('@')[0], {
                university: university || 'Campus University',
                stream: stream || 'Computer Science',
                contactDetails: contactDetails || ''
              });
            } else {
              StorageService.saveProfile(existingProfile);
            }

            StorageService.setIsLoggedIn(true);
            onSuccess(existingProfile);
            return;
          } catch (e: any) {
            console.warn("Firebase email login error:", e);
            setErrorMsg(e.message || 'Invalid email or password.');
            return;
          }
        }
        // Local fallback
        const init = StorageService.initializeZeroUserStorage('user_local_' + Date.now(), email || 'student@campus.edu', displayName || email.split('@')[0], {
          university,
          stream,
          contactDetails
        });
        StorageService.setIsLoggedIn(true);
        onSuccess(init.profile);
      } else {
        // Register New User - STRICT VALIDATION
        if (!displayName.trim() || !email.trim() || !password.trim() || !university.trim() || !stream.trim() || !contactDetails.trim()) {
          setErrorMsg('Sign up failed: Please fill in all required form fields (Full Name, Student Email, Password, University, Stream, and Contact Details).');
          setLoading(false);
          return;
        }

        if (auth) {
          try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const init = StorageService.initializeZeroUserStorage(res.user.uid, email, displayName, {
              university,
              stream,
              contactDetails
            });
            const profile = await FirestoreService.initializeNewUserWithZeroData(res.user.uid, email, displayName, {
              university,
              stream,
              contactDetails
            });

            StorageService.setIsLoggedIn(true);
            onSuccess(profile);
            return;
          } catch (e: any) {
            console.warn("Firebase registration error:", e);
            setErrorMsg('Sign up failed: ' + (e.message || 'Failed to create account in Firebase.'));
            return;
          }
        }
        const init = StorageService.initializeZeroUserStorage('user_' + Date.now(), email, displayName, {
          university,
          stream,
          contactDetails
        });
        StorageService.setIsLoggedIn(true);
        onSuccess(init.profile);
      }
    } catch (err: any) {
      setErrorMsg('Sign up failed: ' + (err.message || 'Authentication error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 relative overflow-hidden my-auto max-h-[92vh] sm:max-h-[90vh]">
        
        {/* Left Column - Dark Brand Panel */}
        <div className="md:col-span-5 bg-[#0B1736] text-white p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden selection:bg-blue-500 selection:text-white">
          {/* Top Brand Logo */}
          <div className="flex items-center gap-2.5 z-10">
            <img 
              src={logoImg} 
              alt="Placivo AI" 
              className="h-9 w-auto max-h-9 object-contain rounded-2xl" 
            />
          </div>

          {/* Main Hero Message */}
          <div className="my-6 space-y-3.5 z-10">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {mode === 'login' && 'Welcome back to the collective.'}
              {mode === 'register' && 'Join the next-gen academic network.'}
              {mode === 'google-onboarding' && 'Complete your student identity.'}
              {mode === 'forgot' && 'Account recovery & security.'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {mode === 'login' && 'Sign in to continue exploring verified AI study assistants, placement prep toolkits, 375 DSA sheet, and connecting with actual students.'}
              {mode === 'register' && 'Create your account to unlock full access to autonomous AI workspaces, company-wise interview archives, resume builders, and student intelligence.'}
              {mode === 'google-onboarding' && "We've verified your Google account credentials. Please complete your profile to customize your AI study environment."}
              {mode === 'forgot' && "Enter your registered student email address and we'll dispatch password reset instructions instantly."}
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3 pt-3">
              <div className="p-3.5 rounded-2xl bg-[#13234a]/90 border border-[#1e3468] flex items-start gap-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Autonomous AI Workspaces</h4>
                  <p className="text-[11px] text-slate-300 leading-normal mt-0.5">
                    Smart notes, AI resume builder & attendance tracker.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#13234a]/90 border border-[#1e3468] flex items-start gap-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Campus Placement Prep</h4>
                  <p className="text-[11px] text-slate-300 leading-normal mt-0.5">
                    375 DSA sheet, company interview questions & AI mock tests.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="text-[11px] text-slate-400 font-medium z-10 pt-2 border-t border-slate-800/80">
            © {new Date().getFullYear()} Placivo AI • Student Intelligence
          </div>

          {/* Ambient Decorative Accents */}
          <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Right Column - Form Area */}
        <div className="md:col-span-7 bg-white p-7 sm:p-9 flex flex-col justify-between relative overflow-y-auto max-h-[85vh] md:max-h-[88vh]">
          {/* Close Button */}
          <button
            onClick={handleModalClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            {/* Form Title & Switch Link */}
            <div className="pr-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {mode === 'login' && 'Sign In to Placivo AI'}
                {mode === 'register' && 'Create Your Student Account'}
                {mode === 'google-onboarding' && 'Complete Profile'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {mode === 'login' && (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setErrorMsg(''); setEmailValidationError(''); }}
                      className="text-blue-600 font-extrabold underline hover:text-blue-800 cursor-pointer"
                    >
                      Create Free Account
                    </button>
                  </>
                )}
                {mode === 'register' && (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMsg(''); setEmailValidationError(''); }}
                      className="text-blue-600 font-extrabold underline hover:text-blue-800 cursor-pointer"
                    >
                      Sign In Here
                    </button>
                  </>
                )}
                {mode === 'google-onboarding' && 'Please fill in your academic details to finish setting up your account.'}
                {mode === 'forgot' && 'Enter your student email address to receive reset instructions.'}
              </p>
            </div>

            {/* High-Visibility Mode Selector Tabs (Log In vs Create Account) */}
            {(mode === 'login' || mode === 'register') && (
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mt-4 mb-2 shadow-inner">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setEmailValidationError(''); }}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    mode === 'login'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); setEmailValidationError(''); }}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    mode === 'register'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </div>
            )}

            {/* Segmented Account Type Tabs */}
            {(mode === 'login' || mode === 'register') && (
              <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center gap-1 my-4 border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setAccountType('general')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    accountType === 'general'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>General User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('student')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    accountType === 'student'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>New-Gen Student</span>
                </button>
              </div>
            )}

        {errorMsg && (
          errorMsg === 'UNAUTHORIZED_DOMAIN' || errorMsg.includes('unauthorized-domain') ? (
            <div className="p-3.5 mb-4 text-xs rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <span>⚠️ Firebase Domain Not Authorized</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-700">
                Firebase Project <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">campusos01</code> requires authorizing this preview URL domain in Firebase Console:
              </p>
              <div className="bg-amber-100/70 p-2 rounded-xl text-[10px] font-mono text-amber-900 break-all select-all">
                {typeof window !== 'undefined' ? window.location.hostname : 'aistudio.google.com'}
              </div>
              <p className="text-[10px] text-amber-600">
                Fix in Firebase Console: <b>Authentication</b> &rarr; <b>Settings</b> &rarr; <b>Authorized domains</b> &rarr; <b>Add domain</b>.
              </p>
              <button
                type="button"
                onClick={handleInstantGuestLogin}
                className="w-full mt-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Continue as Guest / Local Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-3 mb-4 text-xs rounded-xl bg-red-50 text-red-600 border border-red-200 font-medium flex flex-col gap-2">
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={handleInstantGuestLogin}
                className="self-start text-[11px] font-bold text-red-700 underline hover:text-red-900"
              >
                Or Continue with Guest Demo Mode
              </button>
            </div>
          )
        )}

        {/* FORGOT PASSWORD VIA FIREBASE AUTHENTICATION */}
        {mode === 'forgot' ? (
          resetSent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-emerald-950">Password Reset Link Dispatched</h3>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  We have dispatched password reset instructions to <strong className="text-emerald-950">{email}</strong>. Please check your inbox and spam folder.
                </p>
              </div>

              {devOtpNotice && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Instant Reset OTP Code:</span>
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full">
                      Demo / Direct Reset
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black tracking-widest text-amber-950 font-mono bg-white py-1.5 px-3 rounded-lg border border-amber-300 shadow-xs">
                      {devOtpNotice.replace(/^OTP Code:\s*/i, '')}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const code = devOtpNotice.replace(/^OTP Code:\s*/i, '').trim();
                        setOtpCode(code);
                        setResetSent(false);
                        setOtpStep(2);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Use Code Now
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-800 font-medium">
                    Because custom SMTP email servers require environment credentials, this 6-digit OTP code is provided directly for instant account recovery.
                  </p>
                </div>
              )}

              {emailPreviewUrl && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-2 text-left">
                  <p className="font-bold flex items-center gap-1.5 text-blue-950">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Test Mail Server Preview Link Available:</span>
                  </p>
                  <a
                    href={emailPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-700 font-extrabold underline hover:text-blue-900 transition-colors cursor-pointer text-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Dispatched Email (Ethereal Preview Inbox)</span>
                  </a>
                </div>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetSent(false);
                    setOtpStep(2);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>Enter 6-Digit OTP Code to Reset Directly</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setResetSent(false);
                    setErrorMsg('');
                    setEmailValidationError('');
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Return to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailValidationError) setEmailValidationError('');
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="student@campus.edu"
                    className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 border transition-all focus:outline-none focus:ring-2 ${
                      emailValidationError
                        ? 'border-red-300 focus:ring-red-500/20'
                        : 'border-slate-200 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                {emailValidationError && (
                  <p className="text-[11px] font-semibold text-red-600 mt-1.5 flex items-center gap-1 animate-in fade-in duration-150">
                    <span>{emailValidationError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                    setEmailValidationError('');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Show Google Auth Button ONLY if not in google-onboarding mode */}
            {mode !== 'google-onboarding' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-3.5 px-5 rounded-2xl border-2 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 font-extrabold text-sm sm:text-base text-slate-800 flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99] disabled:opacity-60"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase my-2">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span>Or email</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
              </>
            )}

            {/* Google Onboarding Indicator Banner */}
            {mode === 'google-onboarding' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 text-blue-200" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-blue-900">Google Auth Verified</p>
                  <p className="text-[11px] text-blue-700">Please provide your university, stream & contact details.</p>
                </div>
              </div>
            )}

            {/* Full Name Field (In Register or Google Onboarding mode) */}
            {(mode === 'register' || mode === 'google-onboarding') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            {/* University & Stream Grid (In Register or Google Onboarding mode) */}
            {(mode === 'register' || mode === 'google-onboarding') && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">University / College</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. IIT Bombay"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stream / Branch</label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={stream}
                      onChange={(e) => setStream(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Details / Phone Field (In Register or Google Onboarding mode) */}
            {(mode === 'register' || mode === 'google-onboarding') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Details / Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={contactDetails}
                    onChange={(e) => setContactDetails(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.edu"
                  readOnly={mode === 'google-onboarding' && !!googleAuthUser?.email}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    mode === 'google-onboarding' && !!googleAuthUser?.email ? 'bg-slate-100 text-slate-600 font-semibold cursor-not-allowed' : 'bg-slate-50'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            {mode !== 'google-onboarding' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50/80 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* "Forgot Password?" link directly below password input field */}
                {mode === 'login' && (
                  <div className="mt-1.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg('');
                        setEmailValidationError('');
                        setResetSent(false);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white font-black text-base sm:text-lg tracking-wide shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed mt-4 border border-blue-500/30"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In to Account'}
                    {mode === 'register' && 'Create Free Account'}
                    {mode === 'google-onboarding' && 'Complete Profile Registration'}
                  </span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            {/* Terms and Privacy disclaimer note */}
            <p className="mt-3 text-[10px] text-center text-slate-400 leading-normal">
              By continuing, you agree to Placivo AI's{' '}
              <button
                type="button"
                onClick={() => onOpenTerms?.('terms')}
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Terms
              </button>,{' '}
              <button
                type="button"
                onClick={() => onOpenTerms?.('privacy')}
                className="font-semibold text-purple-600 hover:underline cursor-pointer"
              >
                Privacy
              </button>{' '}
              &{' '}
              <button
                type="button"
                onClick={() => onOpenTerms?.('cancellation')}
                className="font-semibold text-emerald-600 hover:underline cursor-pointer"
              >
                Refund Policies
              </button>.
            </p>
          </form>
        )}
          </div>

        {/* Footer Action Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={handleAdminInstantLogin}
            className="text-slate-500 font-semibold hover:text-slate-800 transition-colors cursor-pointer"
          >
            Admin? Sign in here →
          </button>

          {mode !== 'google-onboarding' && mode !== 'forgot' && (
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="text-slate-600 font-bold hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};
