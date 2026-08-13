import React, { useState, useEffect } from 'react';
import { GraduationCap, Building2 } from 'lucide-react';
import { FirestoreService } from '../../lib/firestoreService';

export const TrustedBy: React.FC = () => {
  const [registeredCount, setRegisteredCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchCount = async () => {
      try {
        const users = await FirestoreService.getAllUsers();
        if (isMounted && users && Array.isArray(users)) {
          setRegisteredCount(users.length);
        }
      } catch (err) {
        console.warn('TrustedBy: Could not fetch user count from Firestore', err);
      }
    };

    fetchCount();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate student count: Base 2,500,000.
  const displayStudentCount = (2500000 + registeredCount).toLocaleString('en-IN');

  const indianUniversities = [
    'BITS Pilani',
    'DTU Delhi',
    'IIT Bombay',
    'VIT Vellore',
    'IIIT Hyderabad',
    'Delhi University',
    'SRM Institute',
    'NSUT Delhi',
    'Manipal Academy',
    'Anna University',
    'NIT Trichy',
    'RV College of Engineering',
    'Thapar Institute',
    'Chandigarh University',
    'PSG Tech Coimbatore',
  ];

  // Repeat array 3 times for a continuous, seamless running marquee loop
  const marqueeItems = [...indianUniversities, ...indianUniversities, ...indianUniversities];

  return (
    <section className="py-10 bg-white/20 backdrop-blur-md border-y border-white/40 overflow-hidden relative">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 text-center mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-700 inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/80 shadow-2xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Trusted by <span className="text-blue-600 font-black">1,200+</span> Colleges & <span className="text-blue-600 font-black">2.5M+</span> Students All Over India</span>
        </p>
      </div>

      {/* INFINITE RUNNING MARQUEE CONTAINER (LEFT TO RIGHT) */}
      <div className="relative w-full overflow-hidden py-2 select-none">
        
        {/* Left & Right Soft Fade Overlay Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#F7F2FD] via-[#F7F2FD]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#F7F2FD] via-[#F7F2FD]/80 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track moving Left-to-Right */}
        <div className="animate-marquee-ltr flex items-center gap-4 sm:gap-6">
          {marqueeItems.map((uni, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 shadow-2xs text-slate-800 font-extrabold text-xs sm:text-sm shrink-0 hover:border-blue-300 hover:shadow-md transition-all cursor-default"
            >
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{uni}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
