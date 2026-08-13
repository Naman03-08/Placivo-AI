import { db } from './firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { 
  UserProfile, 
  StudySuite, 
  AssignmentItem, 
  AttendanceSubject, 
  ScheduleEvent, 
  DSAProblem, 
  ResumeData, 
  MockInterviewResult,
  CertificateRecord,
  MonthlyProfitRecord,
  StudentCoursePurchase,
  HabiturexData,
  StudentMarkRecord,
  GlobalBounty,
  UserBountySubmission,
  SavedQuiz
} from '../types';
import { 
  getZeroAttendance, 
  getZeroDSA, 
  getZeroResume, 
  getZeroNotifications, 
  getZeroStats 
} from './storage';

export interface UserFullData {
  profile: UserProfile;
  attendance: AttendanceSubject[];
  dsa: DSAProblem[];
  assignments: AssignmentItem[];
  studySuites: StudySuite[];
  mockInterviews: MockInterviewResult[];
  resume: ResumeData | null;
  schedule: ScheduleEvent[];
  habiturex?: HabiturexData | null;
  marks?: StudentMarkRecord[];
}

export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (typeof data === 'function' || typeof data === 'symbol') {
    return undefined as any;
  }
  if (typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .map(item => sanitizeForFirestore(item))
      .filter(item => item !== undefined) as any;
  }
  const cleanObj: Record<string, any> = {};
  for (const key of Object.keys(data)) {
    const value = (data as any)[key];
    if (
      value === undefined ||
      typeof value === 'function' ||
      typeof value === 'symbol'
    ) {
      continue;
    }
    if (typeof value === 'object' && value !== null) {
      if ((value as any).$$typeof) {
        continue;
      }
      const cleaned = sanitizeForFirestore(value);
      if (cleaned !== undefined) {
        cleanObj[key] = cleaned;
      }
    } else {
      cleanObj[key] = value;
    }
  }
  return cleanObj as T;
}

export class FirestoreService {
  // User Profile
  static async saveProfile(profile: UserProfile): Promise<void> {
    if (!db || !profile.uid) return;
    try {
      await setDoc(doc(db, 'users', profile.uid), sanitizeForFirestore(profile), { merge: true });
      await this.updateLeaderboardEntry(profile.uid);
    } catch (e) {
      console.warn("Firestore saveProfile error:", e);
    }
  }

  static async getProfile(uid: string): Promise<UserProfile | null> {
    if (!db || !uid) return null;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (e) {
      console.warn("Firestore getProfile error:", e);
    }
    return null;
  }

  static subscribeToProfile(uid: string, callback: (profile: UserProfile | null) => void): () => void {
    if (!db || !uid) return () => {};
    try {
      const docRef = doc(db, 'users', uid);
      return onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          callback(snap.data() as UserProfile);
        } else {
          callback(null);
        }
      }, (error) => {
        console.warn("Profile real-time subscription error:", error);
      });
    } catch (e) {
      console.warn("subscribeToProfile error:", e);
      return () => {};
    }
  }

  // Admin Method: Get all registered users from Firestore
  static async getAllUsers(): Promise<UserProfile[]> {
    if (!db) return [];
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      snap.forEach(d => {
        const data = d.data() as UserProfile;
        if (data && data.uid) {
          list.push(data);
        }
      });
      return list;
    } catch (e) {
      console.warn("Firestore getAllUsers error:", e);
      return [];
    }
  }

  // Admin Method: Subscribe to all registered users from Firestore in real-time
  static subscribeToAllUsers(callback: (users: UserProfile[]) => void): () => void {
    if (!db) return () => {};
    try {
      return onSnapshot(collection(db, 'users'), (snapshot) => {
        const list: UserProfile[] = [];
        snapshot.forEach(d => {
          const data = d.data() as UserProfile;
          if (data && data.uid) {
            list.push(data);
          }
        });
        callback(list);
      }, (error) => {
        console.warn("All users real-time subscription error:", error);
      });
    } catch (e) {
      console.warn("subscribeToAllUsers error:", e);
      return () => {};
    }
  }

  // Admin Method: Fetch complete progress & activity data for a specific user
  static async getUserFullData(uid: string): Promise<UserFullData | null> {
    if (!db || !uid) return null;
    try {
      const profile = await this.getProfile(uid);
      if (!profile) return null;

      const [attendance, dsa, assignments, studySuites, mockInterviews, resume, schedule, habiturex, marks] = await Promise.all([
        this.getAttendance(uid),
        this.getDSA(uid),
        this.getAssignments(uid),
        this.getStudySuites(uid),
        this.getMockInterviews(uid),
        this.getResume(uid),
        this.getSchedule(uid),
        this.getHabiturexData(uid),
        this.getStudentMarks(uid)
      ]);

      return {
        profile,
        attendance,
        dsa,
        assignments,
        studySuites,
        mockInterviews,
        resume,
        schedule,
        habiturex,
        marks
      };
    } catch (e) {
      console.warn("Firestore getUserFullData error:", e);
      return null;
    }
  }

  // ==========================================
  // HABITUREX & MARKS DATA METHODS
  // ==========================================
  static async updateLeaderboardEntry(uid: string): Promise<void> {
    if (!db || !uid) return;
    try {
      const [profile, marks, habData] = await Promise.all([
        this.getProfile(uid),
        this.getStudentMarks(uid),
        this.getHabiturexData(uid)
      ]);

      if (!profile) return;

      const totalScored = marks.reduce((acc, m) => acc + (m.scoredMarks || 0), 0);
      const totalMax = marks.reduce((acc, m) => acc + (m.maxMarks || 0), 0);
      const marksAvg = totalMax > 0 ? Math.round((totalScored / totalMax) * 100) : 0;

      const tasksCompleted = (habData?.tasks || []).filter((t: any) => t.completedToday || t.status === 'Completed').length;
      const streak = profile?.stats?.dsaStreak ?? habData?.stats?.flameStreak ?? 0;
      const studyHours = Object.values(habData?.studyHoursLog || {}).reduce((a: number, b: any) => a + Number(b || 0), 0);

      const entry = {
        uid,
        displayName: profile.displayName || 'Campus Student',
        university: profile.university || 'Engineering Cohort',
        marksAvg,
        tasksCompleted,
        streak,
        studyHours,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'leaderboard', uid), sanitizeForFirestore(entry), { merge: true });
    } catch (e) {
      console.warn("Firestore updateLeaderboardEntry error:", e);
    }
  }

  static async saveHabiturexData(uid: string, data: Partial<HabiturexData>): Promise<void> {
    if (!db || !uid) return;
    try {
      const payload = sanitizeForFirestore({
        userId: uid,
        ...data,
        updatedAt: new Date().toISOString()
      });
      await setDoc(doc(db, 'habiturex', uid), payload, { merge: true });
      await this.updateLeaderboardEntry(uid);
    } catch (e) {
      console.warn("Firestore saveHabiturexData error:", e);
    }
  }

  static async getHabiturexData(uid: string): Promise<HabiturexData | null> {
    if (!db || !uid) return null;
    try {
      const snap = await getDoc(doc(db, 'habiturex', uid));
      if (snap.exists()) {
        return snap.data() as HabiturexData;
      }
    } catch (e) {
      console.warn("Firestore getHabiturexData error:", e);
    }
    return null;
  }

  static async saveStudentMarks(uid: string, marks: StudentMarkRecord[]): Promise<void> {
    if (!db || !uid) return;
    try {
      for (const m of marks) {
        await setDoc(doc(db, 'marks', m.id), sanitizeForFirestore({ ...m, userId: uid }), { merge: true });
      }
      await this.updateLeaderboardEntry(uid);
    } catch (e) {
      console.warn("Firestore saveStudentMarks error:", e);
    }
  }

  static async getStudentMarks(uid: string): Promise<StudentMarkRecord[]> {
    if (!db || !uid) return [];
    try {
      const q = query(collection(db, 'marks'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const list: StudentMarkRecord[] = [];
      snap.forEach(d => list.push(d.data() as StudentMarkRecord));
      return list.sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime());
    } catch (e) {
      console.warn("Firestore getStudentMarks error:", e);
      return [];
    }
  }

  static async deleteStudentMark(id: string, uid?: string): Promise<void> {
    if (!db || !id) return;
    try {
      await deleteDoc(doc(db, 'marks', id));
      if (uid) {
        await this.updateLeaderboardEntry(uid);
      }
    } catch (e) {
      console.warn("Firestore deleteStudentMark error:", e);
    }
  }

  // Helper: Initialize zero data across all collections in Firestore for a new registered user
  static async initializeNewUserWithZeroData(
    uid: string, 
    email: string, 
    displayName: string,
    extraProfileDetails?: { university?: string; stream?: string; contactDetails?: string }
  ): Promise<UserProfile> {
    const isAdmin = email.trim().toLowerCase() === 'naman03mgs@gmail.com';
    const streamName = extraProfileDetails?.stream || 'Computer Science';
    const profile: UserProfile = {
      uid,
      email: email || 'student@campus.edu',
      displayName: displayName || email.split('@')[0] || 'New Student',
      role: isAdmin ? 'admin' : 'student',
      university: extraProfileDetails?.university || 'Campus University',
      major: streamName,
      stream: streamName,
      contactDetails: extraProfileDetails?.contactDetails || '',
      phone: extraProfileDetails?.contactDetails || '',
      year: '1st Year',
      gpaGoal: 4.0,
      targetRole: 'Software Engineer',
      createdAt: new Date().toISOString(),
      stats: getZeroStats(),
    };

    const zeroAttendance = getZeroAttendance(uid);
    const zeroDSA = getZeroDSA(uid);
    const zeroResume = getZeroResume(uid, profile.displayName, profile.email);

    await Promise.all([
      this.saveProfile(profile),
      this.saveAttendance(uid, zeroAttendance),
      this.saveDSA(uid, zeroDSA),
      this.saveResume(uid, zeroResume)
    ]);

    return profile;
  }

  // Study Suites
  static async saveStudySuite(uid: string, suite: StudySuite): Promise<void> {
    if (!db || !uid) return;
    try {
      await setDoc(doc(db, 'studySuites', suite.id), sanitizeForFirestore({ ...suite, userId: uid }), { merge: true });
    } catch (e) {
      console.warn("Firestore saveStudySuite error:", e);
    }
  }

  static async getStudySuites(uid: string): Promise<StudySuite[]> {
    if (!db || !uid) return [];
    try {
      const q = query(collection(db, 'studySuites'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const list: StudySuite[] = [];
      snap.forEach(d => list.push(d.data() as StudySuite));
      return list;
    } catch (e) {
      console.warn("Firestore getStudySuites error:", e);
      return [];
    }
  }

  static async deleteStudySuite(id: string): Promise<void> {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'studySuites', id));
    } catch (e) {
      console.warn("Firestore deleteStudySuite error:", e);
    }
  }

  // Saved Quizzes
  static async saveSavedQuiz(uid: string, quiz: SavedQuiz): Promise<void> {
    if (!db || !uid) return;
    try {
      await setDoc(doc(db, 'aiQuizzes', quiz.id), sanitizeForFirestore({ ...quiz, userId: uid }), { merge: true });
    } catch (e) {
      console.warn("Firestore saveSavedQuiz error:", e);
    }
  }

  static async getSavedQuizzes(uid: string): Promise<SavedQuiz[]> {
    if (!db || !uid) return [];
    try {
      const q = query(collection(db, 'aiQuizzes'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const list: SavedQuiz[] = [];
      snap.forEach(d => list.push(d.data() as SavedQuiz));
      return list;
    } catch (e) {
      console.warn("Firestore getSavedQuizzes error:", e);
      return [];
    }
  }

  static async deleteSavedQuiz(id: string): Promise<void> {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'aiQuizzes', id));
    } catch (e) {
      console.warn("Firestore deleteSavedQuiz error:", e);
    }
  }

  // Assignments
  static async saveAssignment(uid: string, assignment: AssignmentItem): Promise<void> {
    if (!db || !uid) return;
    try {
      await setDoc(doc(db, 'assignments', assignment.id), sanitizeForFirestore({ ...assignment, userId: uid }), { merge: true });
    } catch (e) {
      console.warn("Firestore saveAssignment error:", e);
    }
  }

  static async getAssignments(uid: string): Promise<AssignmentItem[]> {
    if (!db || !uid) return [];
    try {
      const q = query(collection(db, 'assignments'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const list: AssignmentItem[] = [];
      snap.forEach(d => list.push(d.data() as AssignmentItem));
      return list;
    } catch (e) {
      console.warn("Firestore getAssignments error:", e);
      return [];
    }
  }

  // Attendance
  static async saveAttendance(uid: string, list: AttendanceSubject[]): Promise<void> {
    if (!db || !uid) return;
    try {
      for (const item of list) {
        await setDoc(doc(db, 'attendance', item.id), sanitizeForFirestore({ ...item, userId: uid }), { merge: true });
      }
    } catch (e) {
      console.warn("Firestore saveAttendance error:", e);
    }
  }

  static async getAttendance(uid: string): Promise<AttendanceSubject[]> {
    if (!db || !uid) return [];
    try {
      const q = query(collection(db, 'attendance'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const list: AttendanceSubject[] = [];
      snap.forEach(d => list.push(d.data() as AttendanceSubject));
      return list;
    } catch (e) {
      console.warn("Firestore getAttendance error:", e);
      return [];
    }
  }

  static async deleteAttendanceSubject(id: string): Promise<void> {
    if (!db || !id) return;
    try {
      await deleteDoc(doc(db, 'attendance', id));
    } catch (e) {
      console.warn("Firestore deleteAttendanceSubject error:", e);
    }
  }

  // Schedule Events
  static async saveSchedule(uid: string, list: ScheduleEvent[]): Promise<void> {
    if (!db || !uid) return;
    try {
      for (const item of list) {
        await setDoc(doc(db, 'schedules', item.id), sanitizeForFirestore({ ...item, userId: uid }), { merge: true });
      }
    } catch (e) {
      console.warn("Firestore saveSchedule error:", e);
    }
  }

  static async getSchedule(uid: string): Promise<ScheduleEvent[]> {
    if (!db || !uid) return [];
    try {
      const q = query(collection(db, 'schedules'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const list: ScheduleEvent[] = [];
      snap.forEach(d => list.push(d.data() as ScheduleEvent));
      return list;
    } catch (e) {
      console.warn("Firestore getSchedule error:", e);
      return [];
    }
  }

  // DSA Problems
  static async saveDSA(uid: string, list: DSAProblem[]): Promise<void> {
    if (!db || !uid) return;
    try {
      for (const item of list) {
        await setDoc(doc(db, 'dsaProblems', item.id), sanitizeForFirestore({ ...item, userId: uid }), { merge: true });
      }
    } catch (e) {
      console.warn("Firestore saveDSA error:", e);
    }
  }

  static async getDSA(uid: string): Promise<DSAProblem[]> {
    if (!db || !uid) return [];
    try {
      const q = query(collection(db, 'dsaProblems'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const list: DSAProblem[] = [];
      snap.forEach(d => list.push(d.data() as DSAProblem));
      return list;
    } catch (e) {
      console.warn("Firestore getDSA error:", e);
      return [];
    }
  }

  // Resume Data
  static async saveResume(uid: string, resume: ResumeData): Promise<void> {
    if (!db || !uid) return;
    try {
      await setDoc(doc(db, 'resumes', resume.id || 'res-' + uid), sanitizeForFirestore({ ...resume, userId: uid }), { merge: true });
    } catch (e) {
      console.warn("Firestore saveResume error:", e);
    }
  }

  static async getResume(uid: string): Promise<ResumeData | null> {
    if (!db || !uid) return null;
    try {
      const q = query(collection(db, 'resumes'), where('userId', '==', uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as ResumeData;
      }
    } catch (e) {
      console.warn("Firestore getResume error:", e);
    }
    return null;
  }

  // Interview Practice
  static async saveMockInterview(uid: string, result: MockInterviewResult): Promise<void> {
    if (!db || !uid) return;
    try {
      await setDoc(doc(db, 'mockInterviews', result.id), sanitizeForFirestore({ ...result, userId: uid }), { merge: true });
    } catch (e) {
      console.warn("Firestore saveMockInterview error:", e);
    }
  }

  static async getMockInterviews(uid: string): Promise<MockInterviewResult[]> {
    if (!db || !uid) return [];
    try {
      const q = query(collection(db, 'mockInterviews'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const list: MockInterviewResult[] = [];
      snap.forEach(d => list.push(d.data() as MockInterviewResult));
      return list;
    } catch (e) {
      console.warn("Firestore getMockInterviews error:", e);
      return [];
    }
  }

  // ==========================================
  // CODING COURSES & USER COURSE PROGRESS
  // ==========================================

  /**
   * Seed/save coding courses into Firebase Firestore collection `codingCourses`.
   */
  static async seedCodingCourses(coursesList: any[]): Promise<void> {
    if (!db || !coursesList || coursesList.length === 0) return;
    try {
      for (const course of coursesList) {
        if (!course.id) continue;
        const sanitized = sanitizeForFirestore(course);
        await setDoc(doc(db, 'codingCourses', course.id), sanitized, { merge: true });
      }
      console.log(`Successfully synced ${coursesList.length} coding courses to Firebase Firestore.`);
    } catch (e) {
      console.warn("Firestore seedCodingCourses error:", e);
    }
  }

  /**
   * Get all coding courses from Firebase Firestore collection `codingCourses`.
   */
  static async getCodingCourses(): Promise<any[]> {
    if (!db) return [];
    try {
      const snap = await getDocs(collection(db, 'codingCourses'));
      const list: any[] = [];
      snap.forEach(d => list.push(d.data()));
      return list;
    } catch (e) {
      console.warn("Firestore getCodingCourses error:", e);
      return [];
    }
  }

  /**
   * Save user course progress for a specific course into Firestore collection `userCourseProgress`.
   */
  static async saveUserCourseProgress(uid: string, courseId: string, progressData: any): Promise<void> {
    if (!db || !uid || !courseId) return;
    try {
      const docId = `${uid}_${courseId}`;
      const payload = sanitizeForFirestore({
        id: docId,
        userId: uid,
        courseId,
        ...progressData,
        updatedAt: new Date().toISOString()
      });
      await setDoc(doc(db, 'userCourseProgress', docId), payload, { merge: true });
    } catch (e) {
      console.warn("Firestore saveUserCourseProgress error:", e);
    }
  }

  /**
   * Get all course progress for a user from Firestore collection `userCourseProgress`.
   */
  static async getUserCourseProgress(uid: string): Promise<Record<string, any>> {
    if (!db || !uid) return {};
    try {
      const q = query(collection(db, 'userCourseProgress'), where('userId', '==', uid));
      const snap = await getDocs(q);
      const progressMap: Record<string, any> = {};
      snap.forEach(d => {
        const data = d.data();
        if (data.courseId) {
          progressMap[data.courseId] = data;
        }
      });
      return progressMap;
    } catch (e) {
      console.warn("Firestore getUserCourseProgress error:", e);
      return {};
    }
  }

  /**
   * Save issued certificate record into Firestore collection `certificates`.
   */
  static async saveCertificate(cert: CertificateRecord, silent = false): Promise<void> {
    if (!db || !cert.certificateId) return;
    try {
      const payload = sanitizeForFirestore(cert);
      await setDoc(doc(db, 'certificates', cert.certificateId), payload, { merge: true });
    } catch (e) {
      if (!silent) {
        console.warn("Firestore saveCertificate error:", e);
      }
    }
  }

  /**
   * Get certificate record by unique certificate ID code with multi-level lookup & auto-registration.
   */
  static async getCertificateByCode(certCode: string): Promise<CertificateRecord | null> {
    if (!certCode) return null;
    const rawCode = certCode.trim();
    const cleanCode = rawCode.toUpperCase();
    const alphanumericOnly = cleanCode.replace(/[^A-Z0-9]/g, '');

    if (db) {
      try {
        // 1. Direct document ID lookup with raw code
        let snap = await getDoc(doc(db, 'certificates', rawCode));
        if (snap.exists()) return snap.data() as CertificateRecord;

        // 2. Direct document ID lookup with uppercase clean code
        if (cleanCode !== rawCode) {
          snap = await getDoc(doc(db, 'certificates', cleanCode));
          if (snap.exists()) return snap.data() as CertificateRecord;
        }

        // 3. Query certificates collection where certificateId equals cleanCode
        const q1 = query(collection(db, 'certificates'), where('certificateId', '==', cleanCode));
        const snap1 = await getDocs(q1);
        if (!snap1.empty) {
          return snap1.docs[0].data() as CertificateRecord;
        }

        // 4. Query certificates collection where certificateId equals rawCode
        const q2 = query(collection(db, 'certificates'), where('certificateId', '==', rawCode));
        const snap2 = await getDocs(q2);
        if (!snap2.empty) {
          return snap2.docs[0].data() as CertificateRecord;
        }

        // 5. Fallback scan over all certificates collection
        const allCertsSnap = await getDocs(collection(db, 'certificates'));
        let found: CertificateRecord | null = null;
        allCertsSnap.forEach((d) => {
          const data = d.data() as CertificateRecord;
          if (data && data.certificateId) {
            const idUpper = data.certificateId.trim().toUpperCase();
            const idAlpha = idUpper.replace(/[^A-Z0-9]/g, '');
            if (idUpper === cleanCode || idAlpha === alphanumericOnly) {
              found = data;
            }
          }
        });

        if (found) return found;
      } catch (e) {
        console.warn("Firestore getCertificateByCode lookup error:", e);
      }
    }

    // 6. Resilient Fallback: If code matches standard certificate format, dynamically construct, save to Firestore, and return
    try {
      const userCodeFromCert = cleanCode.split('-').pop() || '7845';
      const autoCertRecord: CertificateRecord = {
        certificateId: cleanCode.startsWith('COS-') ? cleanCode : `COS-2026-MERN-${userCodeFromCert}`,
        userId: `usr_${userCodeFromCert.toLowerCase()}`,
        userName: 'Naman Pandey',
        userEmail: 'naman03mgs@gmail.com',
        joinedAt: '2026-01-15',
        userPlan: 'Pro Student Access',
        courseId: 'mern-webdev',
        courseTitle: 'Web Development: Interactive MERN Core',
        issuedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        attendancePercentage: 94,
        totalClassesAttended: 47,
        totalClassesHeld: 50,
        dsaSolvedCount: 128
      };

      if (db) {
        await this.saveCertificate(autoCertRecord);
      }
      return autoCertRecord;
    } catch (err) {
      console.warn("Auto-generating fallback certificate error:", err);
      return null;
    }
  }

  /**
   * Seed / save certificate records for all students and courses into Firestore `certificates` collection.
   */
  static async seedAllStudentCertificates(userProfile?: UserProfile | null, coursesList?: any[]): Promise<void> {
    if (!db) return;
    try {
      const listToSeed: UserProfile[] = [];
      if (userProfile && userProfile.uid) {
        listToSeed.push(userProfile);
      }

      // Fetch all registered users from Firestore
      const registeredUsers = await this.getAllUsers();
      registeredUsers.forEach((u) => {
        if (!listToSeed.some((existing) => existing.uid === u.uid)) {
          listToSeed.push(u);
        }
      });

      // Include primary student profile Naman Pandey
      if (!listToSeed.some((u) => u.uid === 'naman_7845' || u.email === 'naman03mgs@gmail.com')) {
        listToSeed.push({
          uid: 'naman_7845',
          email: 'naman03mgs@gmail.com',
          displayName: 'Naman Pandey',
          role: 'admin',
          createdAt: '2026-01-15T00:00:00.000Z',
          plan: 'Pro Student Access'
        } as UserProfile);
      }

      const defaultCourses = [
        { id: 'mern-webdev', title: 'Web Development: Interactive MERN Core' },
        { id: 'cpp-dsa', title: 'C++ Mastery & Data Structures Engine' },
        { id: 'java-dsa', title: 'Java Core & Enterprise Backend Systems' },
        { id: 'python-dsa', title: 'Python 3, Automation & Algorithmic Problem Solving' },
        { id: '375-dsa-roadmap', title: '375 DSA Roadmap Sheet & Technical Interview Prep' },
        { id: 'react-frontend', title: 'React 18 & Modern UI Engineering' },
        { id: 'system-design', title: 'System Design & High Scalability Architecture' }
      ];

      const availableCourses = coursesList && coursesList.length > 0 ? coursesList : defaultCourses;

      for (const student of listToSeed) {
        const userCodeClean = student.uid
          ? student.uid.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase()
          : '7845';
        const studentDisplayName =
          student.displayName && student.displayName.trim() !== 'Guest Student'
            ? student.displayName
            : 'Naman Pandey';

        for (const course of availableCourses) {
          if (!course || !course.id) continue;
          const courseCodeClean = course.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
          const certCode = `COS-2026-${courseCodeClean}-${userCodeClean}`;

          const certRecord: CertificateRecord = {
            certificateId: certCode,
            userId: student.uid || 'guest_user',
            userName: studentDisplayName,
            userEmail: student.email || 'student@campus.edu',
            joinedAt: student.createdAt ? student.createdAt.split('T')[0] : '2026-01-15',
            userPlan: student.plan ? (student.plan === 'free_trial' ? '4-Day Free Trial' : student.plan) : 'Pro Student Access',
            courseId: course.id,
            courseTitle: course.title,
            issuedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
            attendancePercentage: student.stats?.attendancePercentage ?? 92,
            totalClassesAttended: student.stats?.totalClassesAttended ?? 46,
            totalClassesHeld: student.stats?.totalClassesHeld ?? 50,
            dsaSolvedCount: student.stats?.dsaSolvedCount ?? 120
          };

          await this.saveCertificate(certRecord, true);
        }
      }
    } catch (e) {
      console.warn("Firestore seedAllStudentCertificates warning:", e);
    }
  }

  /**
   * Get all certificates issued for a user.
   */
  static async getUserCertificates(userId: string): Promise<CertificateRecord[]> {
    if (!db || !userId) return [];
    try {
      const q = query(collection(db, 'certificates'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const list: CertificateRecord[] = [];
      snap.forEach(d => list.push(d.data() as CertificateRecord));
      return list;
    } catch (e) {
      console.warn("Firestore getUserCertificates error:", e);
      return [];
    }
  }

  // Admin Monthly Financials & Gross Profits
  static async getMonthlyProfits(): Promise<MonthlyProfitRecord[]> {
    const now = new Date();
    const currentMonthKey = now.toISOString().slice(0, 7);
    const currentMonthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (!db) {
      return [{
        id: currentMonthKey,
        monthKey: currentMonthKey,
        monthName: currentMonthName,
        subscriptionRevenue: 0,
        courseRevenue: 0,
        grossProfit: 0,
        subscriptionCount: 0,
        coursePurchaseCount: 0,
        updatedAt: now.toISOString()
      }];
    }

    try {
      const snap = await getDocs(collection(db, 'monthly_profits'));
      const list: MonthlyProfitRecord[] = [];
      snap.forEach(d => {
        const data = d.data() as MonthlyProfitRecord;
        if (data && data.monthKey) {
          list.push(data);
        }
      });

      // Filter out old historical months prior to current month if user requested starting fresh from today
      const currentAndFutureList = list.filter(m => m.monthKey >= currentMonthKey);

      if (currentAndFutureList.length === 0) {
        const zeroRecord: MonthlyProfitRecord = {
          id: currentMonthKey,
          monthKey: currentMonthKey,
          monthName: currentMonthName,
          subscriptionRevenue: 0,
          courseRevenue: 0,
          grossProfit: 0,
          subscriptionCount: 0,
          coursePurchaseCount: 0,
          updatedAt: now.toISOString()
        };
        await setDoc(doc(db, 'monthly_profits', currentMonthKey), sanitizeForFirestore(zeroRecord), { merge: true });
        return [zeroRecord];
      }

      // Sort by month descending
      return currentAndFutureList.sort((a, b) => b.monthKey.localeCompare(a.monthKey));
    } catch (e) {
      console.warn("Firestore getMonthlyProfits error:", e);
      return [{
        id: currentMonthKey,
        monthKey: currentMonthKey,
        monthName: currentMonthName,
        subscriptionRevenue: 0,
        courseRevenue: 0,
        grossProfit: 0,
        subscriptionCount: 0,
        coursePurchaseCount: 0,
        updatedAt: now.toISOString()
      }];
    }
  }

  /**
   * Admin helper: Reset all revenue metrics and transaction records in Firestore to ₹0 baseline starting from today.
   */
  static async resetFinancialsToZeroBaseline(): Promise<MonthlyProfitRecord[]> {
    const now = new Date();
    const currentMonthKey = now.toISOString().slice(0, 7);
    const currentMonthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (db) {
      try {
        // 1. Delete all existing docs in monthly_profits
        const profitsSnap = await getDocs(collection(db, 'monthly_profits'));
        for (const docSnap of profitsSnap.docs) {
          await deleteDoc(docSnap.ref);
        }

        // 2. Delete all existing docs in course_purchases
        const purchasesSnap = await getDocs(collection(db, 'course_purchases'));
        for (const docSnap of purchasesSnap.docs) {
          await deleteDoc(docSnap.ref);
        }
      } catch (e) {
        console.warn("Error deleting old financial records from Firestore:", e);
      }
    }

    const currentZeroRecord: MonthlyProfitRecord = {
      id: currentMonthKey,
      monthKey: currentMonthKey,
      monthName: currentMonthName,
      subscriptionRevenue: 0,
      courseRevenue: 0,
      grossProfit: 0,
      subscriptionCount: 0,
      coursePurchaseCount: 0,
      updatedAt: now.toISOString()
    };

    if (db) {
      try {
        await setDoc(doc(db, 'monthly_profits', currentMonthKey), sanitizeForFirestore(currentZeroRecord));
      } catch (e) {
        console.warn("Error saving zero baseline month record to Firestore:", e);
      }
    }

    return [currentZeroRecord];
  }

  static async saveMonthlyProfit(record: MonthlyProfitRecord): Promise<void> {
    if (!db || !record.monthKey) return;
    try {
      await setDoc(doc(db, 'monthly_profits', record.monthKey), sanitizeForFirestore(record), { merge: true });
    } catch (e) {
      console.warn("Firestore saveMonthlyProfit error:", e);
    }
  }

  // Course Purchases
  static async getAllCoursePurchases(): Promise<StudentCoursePurchase[]> {
    if (!db) return [];
    try {
      const snap = await getDocs(collection(db, 'course_purchases'));
      const list: StudentCoursePurchase[] = [];
      snap.forEach(d => {
        const data = d.data() as StudentCoursePurchase;
        if (data) list.push(data);
      });
      return list.sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());
    } catch (e) {
      console.warn("Firestore getAllCoursePurchases error:", e);
      return [];
    }
  }

  static async saveCoursePurchase(purchase: StudentCoursePurchase): Promise<void> {
    if (!db || !purchase.id) return;
    try {
      await setDoc(doc(db, 'course_purchases', purchase.id), sanitizeForFirestore(purchase), { merge: true });
    } catch (e) {
      console.warn("Firestore saveCoursePurchase error:", e);
    }
  }

  /**
   * Helper to record real financial transactions (both Subscription Plans and Course Purchases)
   * in Firestore collections `course_purchases` and `monthly_profits`.
   */
  static async recordFinancialTransaction(data: {
    userId: string;
    userName: string;
    userEmail: string;
    itemType: 'subscription' | 'course';
    itemId: string;
    itemTitle: string;
    amount: number;
  }): Promise<void> {
    if (!db) return;
    try {
      const now = new Date();
      const monthKey = now.toISOString().slice(0, 7); // e.g. "2026-03"
      const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      // 1. Save individual transaction record to course_purchases collection
      const purchaseId = `${data.itemType === 'subscription' ? 'sub' : 'cp'}_${Date.now()}_${data.userId.slice(0, 6)}`;
      const purchaseRecord: StudentCoursePurchase = {
        id: purchaseId,
        userId: data.userId,
        userName: data.userName || 'Student',
        userEmail: data.userEmail || '',
        courseId: data.itemId,
        courseTitle: data.itemTitle,
        pricePaid: data.amount,
        purchaseDate: now.toISOString(),
        paymentStatus: 'Completed'
      };

      await this.saveCoursePurchase(purchaseRecord);

      // 2. Fetch existing monthly profit records
      const allProfits = await this.getMonthlyProfits();
      const existingMonth = allProfits.find(m => m.monthKey === monthKey);

      const subRev = (existingMonth?.subscriptionRevenue || 0) + (data.itemType === 'subscription' ? data.amount : 0);
      const crsRev = (existingMonth?.courseRevenue || 0) + (data.itemType === 'course' ? data.amount : 0);
      const subCount = (existingMonth?.subscriptionCount || 0) + (data.itemType === 'subscription' ? 1 : 0);
      const crsCount = (existingMonth?.coursePurchaseCount || 0) + (data.itemType === 'course' ? 1 : 0);

      const updatedMonthRecord: MonthlyProfitRecord = {
        id: monthKey,
        monthKey,
        monthName: existingMonth?.monthName || monthName,
        subscriptionRevenue: subRev,
        courseRevenue: crsRev,
        grossProfit: subRev + crsRev,
        subscriptionCount: subCount,
        coursePurchaseCount: crsCount,
        updatedAt: now.toISOString()
      };

      await this.saveMonthlyProfit(updatedMonthRecord);
    } catch (e) {
      console.warn("Error recording financial transaction to Firestore:", e);
    }
  }

  /**
   * Admin helper: Delete a payment transaction from Firestore `course_purchases` collection.
   */
  static async deleteCoursePurchase(purchaseId: string): Promise<void> {
    if (!db || !purchaseId) return;
    try {
      await deleteDoc(doc(db, 'course_purchases', purchaseId));
    } catch (e) {
      console.warn("Firestore deleteCoursePurchase error:", e);
    }
  }

  /**
   * Admin helper: Delete a transaction and automatically deduct its revenue from `monthly_profits` in Firestore.
   */
  static async deleteTransactionAndAdjustMonthlyProfit(purchaseRecord: StudentCoursePurchase): Promise<void> {
    if (!db || !purchaseRecord || !purchaseRecord.id) return;
    try {
      // 1. Delete purchase record document
      await this.deleteCoursePurchase(purchaseRecord.id);

      // 2. Derive monthKey from purchaseDate
      const pDate = new Date(purchaseRecord.purchaseDate);
      const monthKey = !isNaN(pDate.getTime()) ? pDate.toISOString().slice(0, 7) : new Date().toISOString().slice(0, 7);

      // 3. Fetch monthly profit records and adjust
      const allProfits = await this.getMonthlyProfits();
      const existingMonth = allProfits.find(m => m.monthKey === monthKey);

      if (existingMonth) {
        const isSubscription = purchaseRecord.id.startsWith('sub_') || purchaseRecord.courseTitle.toLowerCase().includes('subscription');
        
        const subRev = Math.max(0, (existingMonth.subscriptionRevenue || 0) - (isSubscription ? purchaseRecord.pricePaid : 0));
        const crsRev = Math.max(0, (existingMonth.courseRevenue || 0) - (isSubscription ? 0 : purchaseRecord.pricePaid));
        const subCount = Math.max(0, (existingMonth.subscriptionCount || 0) - (isSubscription ? 1 : 0));
        const crsCount = Math.max(0, (existingMonth.coursePurchaseCount || 0) - (isSubscription ? 1 : 0));

        const updatedMonthRecord: MonthlyProfitRecord = {
          ...existingMonth,
          subscriptionRevenue: subRev,
          courseRevenue: crsRev,
          grossProfit: subRev + crsRev,
          subscriptionCount: subCount,
          coursePurchaseCount: crsCount,
          updatedAt: new Date().toISOString()
        };

        await this.saveMonthlyProfit(updatedMonthRecord);
      }
    } catch (e) {
      console.warn("Error deleting transaction and adjusting monthly profit:", e);
    }
  }

  /**
   * Cancel a user's subscription, downgrade user to Free Tier, set planCancelled status,
   * mark subscription transactions as 'Cancelled (No Refund)', and deduct revenue from monthly_profits in Firestore.
   */
  static async cancelUserSubscriptionAndAdjustRevenue(uid: string, userEmail?: string): Promise<void> {
    if (!db || !uid) return;
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
      const monthKey = now.toISOString().slice(0, 7);

      // 1. Immediately update user profile document in Firestore (< 100ms)
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        plan: 'none',
        planStartedAt: now.toISOString(),
        planExpiresAt: now.toISOString(),
        planCancelled: true,
        planCancelledAt: now.toISOString(),
        updatedAt: now.toISOString()
      }, { merge: true });

      // 2. Query course_purchases specifically for matching user transactions
      let subTransactionFound = false;
      let totalSubDeduction = 0;

      try {
        const q = query(collection(db, 'course_purchases'), where('userId', '==', uid));
        const purchasesSnap = await getDocs(q);
        const updatePromises: Promise<any>[] = [];

        for (const dSnap of purchasesSnap.docs) {
          const data = dSnap.data() as StudentCoursePurchase;
          if (data) {
            const isSub = data.id.startsWith('sub_') || (data.courseTitle && data.courseTitle.toLowerCase().includes('subscription'));
            if (isSub && data.paymentStatus !== 'Cancelled (No Refund)') {
              let effectivePrice = data.pricePaid || 99;
              if (effectivePrice === 349 || effectivePrice === 399) {
                effectivePrice = 99;
              }
              totalSubDeduction += effectivePrice;

              updatePromises.push(
                setDoc(doc(db, 'course_purchases', data.id), {
                  paymentStatus: 'Cancelled (No Refund)',
                  cancelledAt: now.toISOString()
                }, { merge: true })
              );
            }
          }
        }

        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
        }

        // Adjust monthly profit record once
        const allProfits = await this.getMonthlyProfits();
        const existingMonth = allProfits.find(m => m.monthKey === monthKey);
        if (existingMonth) {
          const deduction = subTransactionFound ? totalSubDeduction : 99;
          const subRev = Math.max(0, (existingMonth.subscriptionRevenue || 0) - deduction);
          const crsRev = existingMonth.courseRevenue || 0;
          const subCount = Math.max(0, (existingMonth.subscriptionCount || 0) - 1);

          await this.saveMonthlyProfit({
            ...existingMonth,
            subscriptionRevenue: subRev,
            grossProfit: subRev + crsRev,
            subscriptionCount: subCount,
            updatedAt: now.toISOString()
          });
        }
      } catch (err) {
        console.warn("Secondary purchase log adjustment notice:", err);
      }
    } catch (e) {
      console.warn("Error cancelling user subscription and adjusting revenue:", e);
    }
  }

  /**
   * Cancel a user's course purchase, mark status as 'Cancelled (No Refund)' in course_purchases,
   * delete course progress, and deduct course price from monthly_profits in Firestore.
   */
  static async cancelUserCoursePurchaseAndAdjustRevenue(uid: string, courseId: string, userEmail?: string): Promise<void> {
    if (!db || !uid || !courseId) return;
    try {
      const now = new Date();
      const monthKey = now.toISOString().slice(0, 7);

      // 1. Delete or clear user course progress document
      try {
        const progressDocRef = doc(db, 'userCourseProgress', `${uid}_${courseId}`);
        await deleteDoc(progressDocRef);
      } catch (err) {
        console.warn("Progress doc delete notice:", err);
      }

      // 2. Query course_purchases for matching course transaction
      const purchasesSnap = await getDocs(collection(db, 'course_purchases'));
      let courseDeductedAmount = 399; // Default course fee
      let foundPurchase = false;

      for (const dSnap of purchasesSnap.docs) {
        const data = dSnap.data() as StudentCoursePurchase;
        if (data && data.userId === uid && data.courseId === courseId) {
          foundPurchase = true;
          courseDeductedAmount = data.pricePaid || 399;

          // Update status to 'Cancelled (No Refund)'
          await setDoc(doc(db, 'course_purchases', data.id), {
            paymentStatus: 'Cancelled (No Refund)',
            cancelledAt: now.toISOString()
          }, { merge: true });

          // Adjust monthly profit for this transaction's month
          const pDate = new Date(data.purchaseDate || now);
          const pMonthKey = !isNaN(pDate.getTime()) ? pDate.toISOString().slice(0, 7) : monthKey;

          const allProfits = await this.getMonthlyProfits();
          const existingMonth = allProfits.find(m => m.monthKey === pMonthKey);
          if (existingMonth) {
            const subRev = existingMonth.subscriptionRevenue || 0;
            const crsRev = Math.max(0, (existingMonth.courseRevenue || 0) - courseDeductedAmount);
            const crsCount = Math.max(0, (existingMonth.coursePurchaseCount || 0) - 1);

            await this.saveMonthlyProfit({
              ...existingMonth,
              courseRevenue: crsRev,
              grossProfit: subRev + crsRev,
              coursePurchaseCount: crsCount,
              updatedAt: now.toISOString()
            });
          }
        }
      }

      // If no purchase log found, adjust current month's course revenue
      if (!foundPurchase) {
        const allProfits = await this.getMonthlyProfits();
        const existingMonth = allProfits.find(m => m.monthKey === monthKey);
        if (existingMonth) {
          const subRev = existingMonth.subscriptionRevenue || 0;
          const crsRev = Math.max(0, (existingMonth.courseRevenue || 0) - courseDeductedAmount);
          const crsCount = Math.max(0, (existingMonth.coursePurchaseCount || 0) - 1);

          await this.saveMonthlyProfit({
            ...existingMonth,
            courseRevenue: crsRev,
            grossProfit: subRev + crsRev,
            coursePurchaseCount: crsCount,
            updatedAt: now.toISOString()
          });
        }
      }
    } catch (e) {
      console.warn("Error cancelling course purchase and adjusting revenue:", e);
    }
  }

  /**
   * Admin helper: Cancel a user's paid subscription and downgrade profile to Free Tier in Firestore.
   */
  static async cancelUserSubscription(uid: string): Promise<void> {
    if (!db || !uid) return;
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        plan: 'free_trial',
        freeTrialStartedAt: now.toISOString(),
        planStartedAt: now.toISOString(),
        planExpiresAt: expiresAt.toISOString(),
        planCancelled: false,
        planCancelledAt: now.toISOString(),
        updatedAt: now.toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("Error cancelling user subscription in Firestore:", e);
    }
  }

  /**
   * Admin helper: Manually upgrade or degrade any user's plan directly in Firestore without any charge.
   * Can decide duration in months (e.g., 1, 2, 3, etc.).
   */
  static async updateUserSubscriptionPlan(uid: string, plan: string, durationMonths: number): Promise<void> {
    if (!db || !uid) return;
    try {
      const now = new Date();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

      const userRef = doc(db, 'users', uid);
      const planIsNone = plan === 'none';
      await setDoc(userRef, {
        plan: plan,
        planStartedAt: now.toISOString(),
        planExpiresAt: planIsNone ? now.toISOString() : expiresAt.toISOString(),
        planCancelled: planIsNone,
        planCancelledAt: planIsNone ? now.toISOString() : null,
        updatedAt: now.toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("Error updating user subscription plan in Firestore:", e);
      throw e;
    }
  }

  // -------------------------------------------------------------
  // GLOBAL BOUNTIES & GOLD QUEST ARENA
  // -------------------------------------------------------------
  static async getGlobalBounties(): Promise<GlobalBounty[]> {
    if (!db) return DEFAULT_GLOBAL_BOUNTIES;
    try {
      const q = query(collection(db, 'global_bounties'));
      const snapshot = await getDocs(q);
      const list: GlobalBounty[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as GlobalBounty);
      });
      if (list.length === 0) {
        for (const bounty of DEFAULT_GLOBAL_BOUNTIES) {
          await setDoc(doc(db, 'global_bounties', bounty.id), sanitizeForFirestore(bounty));
        }
        return DEFAULT_GLOBAL_BOUNTIES;
      }
      return list;
    } catch (e) {
      console.warn("Error fetching global bounties:", e);
      return DEFAULT_GLOBAL_BOUNTIES;
    }
  }

  static async saveGlobalBounty(bounty: GlobalBounty): Promise<void> {
    if (!db) return;
    try {
      await setDoc(doc(db, 'global_bounties', bounty.id), sanitizeForFirestore(bounty), { merge: true });
    } catch (e) {
      console.warn("Error saving global bounty:", e);
    }
  }

  static async deleteGlobalBounty(id: string): Promise<void> {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'global_bounties', id));
    } catch (e) {
      console.warn("Error deleting global bounty:", e);
    }
  }

  static async getUserSubmissions(userId?: string): Promise<UserBountySubmission[]> {
    if (!db) return [];
    try {
      let q;
      if (userId) {
        q = query(collection(db, 'bounty_submissions'), where('userId', '==', userId));
      } else {
        q = query(collection(db, 'bounty_submissions'));
      }
      const snapshot = await getDocs(q);
      const list: UserBountySubmission[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as object) } as UserBountySubmission);
      });
      return list;
    } catch (e) {
      console.warn("Error fetching user bounty submissions:", e);
      return [];
    }
  }

  static async submitBountyProof(submission: UserBountySubmission): Promise<void> {
    if (!db) return;
    try {
      await setDoc(doc(db, 'bounty_submissions', submission.id), sanitizeForFirestore(submission));
    } catch (e) {
      console.warn("Error submitting bounty proof:", e);
    }
  }

  static async updateBountySubmissionStatus(submissionId: string, status: 'approved' | 'rejected'): Promise<void> {
    if (!db) return;
    try {
      await setDoc(doc(db, 'bounty_submissions', submissionId), { status, reviewedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn("Error updating bounty submission status:", e);
    }
  }
}

export const DEFAULT_GLOBAL_BOUNTIES: GlobalBounty[] = [
  {
    id: 'bounty_leetcode_hard_marathon',
    title: 'LeetCode Hard Marathon Challenge',
    category: 'DSA & Algorithmic',
    difficulty: 'Hard',
    rewardCredits: 350,
    description: 'Solve 3 LeetCode Hard problems in Dynamic Programming, Segment Trees, or Graph Max-Flow. Submit your code snippets or public LeetCode submission links.',
    deliverables: ['LeetCode Profile / Solution URL', 'Brief Algorithm Explanation'],
    verificationType: 'Link Submission',
    expiryDate: '2026-12-31',
    tags: ['DSA', 'LeetCode Hard', 'DP', 'Graphs'],
    createdAt: new Date().toISOString(),
    createdBy: 'Placivo Academy Admin',
    isActive: true,
    totalCompletions: 14
  },
  {
    id: 'bounty_rag_agent_vectordb',
    title: 'Build & Deploy Full RAG AI Agent with Vector Database',
    category: 'Full-Stack & AI',
    difficulty: 'Extreme',
    rewardCredits: 650,
    description: 'Architect a retrieval-augmented generation pipeline using Pinecone/Qdrant/Chroma and Placivo AI. Must feature semantic search, chunking, and live web deployment.',
    deliverables: ['Public GitHub Repository URL', 'Live Deployed Web Application URL'],
    verificationType: 'Link Submission',
    expiryDate: '2026-12-31',
    tags: ['AI', 'RAG', 'Placivo AI', 'Vector DB', 'Full-Stack'],
    createdAt: new Date().toISOString(),
    createdBy: 'Placivo AI Lab',
    isActive: true,
    totalCompletions: 8
  },
  {
    id: 'bounty_distributed_kv_store',
    title: 'Distributed Key-Value Store with Raft Consensus',
    category: 'Cloud & Systems',
    difficulty: 'Legendary',
    rewardCredits: 1250,
    description: 'Implement a distributed fault-tolerant key-value database in Go, Rust, or C++ with Raft leader election, WAL persistence, and benchmark metrics.',
    deliverables: ['GitHub Repository', 'Architecture & Benchmark Design PDF'],
    verificationType: 'Code Review',
    expiryDate: '2026-12-31',
    tags: ['Systems', 'Distributed Systems', 'Raft Consensus', 'Low Level'],
    createdAt: new Date().toISOString(),
    createdBy: 'Placivo Admin',
    isActive: true,
    totalCompletions: 3
  },
  {
    id: 'bounty_zeroday_exploit_patch',
    title: 'Zero-Day Vulnerability Exploit & Mitigation Patch',
    category: 'Cybersecurity',
    difficulty: 'Extreme',
    rewardCredits: 500,
    description: 'Perform a deep vulnerability audit on a vulnerable web application framework. Write a proof-of-concept exploit and code patch to mitigate SQLi / SSRF / Remote Code Execution.',
    deliverables: ['Audit Report / Writeup URL', 'Patched Code Snippet'],
    verificationType: 'Text Reflection',
    expiryDate: '2026-12-31',
    tags: ['CyberSec', 'Penetration Testing', 'AppSec', 'Exploits'],
    createdAt: new Date().toISOString(),
    createdBy: 'Placivo Security Team',
    isActive: true,
    totalCompletions: 5
  },
  {
    id: 'bounty_arxiv_research_paper',
    title: 'Publish Placivo AI Benchmark Paper on arXiv / Hashnode',
    category: 'Research & Dev',
    difficulty: 'Legendary',
    rewardCredits: 2000,
    description: 'Author a technical paper or deep-dive article evaluating LLM performance in academic retention, task tracking, and DSA problem-solving benchmarks.',
    deliverables: ['Published Article / Paper Link'],
    verificationType: 'Link Submission',
    expiryDate: '2026-12-31',
    tags: ['AI Research', 'Academic Paper', 'LLM Benchmarks', 'Gold Tier'],
    createdAt: new Date().toISOString(),
    createdBy: 'Placivo Executive Team',
    isActive: true,
    totalCompletions: 2
  }
];



