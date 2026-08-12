import React from 'react';
import { motion } from 'motion/react';

interface ProfessionalWorkspaceSceneProps {
  imageSrc: string;
  onExploreDemo?: () => void;
}

export const ProfessionalWorkspaceScene: React.FC<ProfessionalWorkspaceSceneProps> = ({ 
  imageSrc
}) => {
  return (
    <div className="relative w-full flex items-center justify-center select-none bg-transparent">
      
      {/* Outer Luminous Glowing Backdrop Halo */}
      <motion.div 
        animate={{ 
          scale: [0.98, 1.03, 0.98],
          opacity: [0.55, 0.85, 0.55]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-sky-400/35 via-indigo-400/30 via-purple-400/25 to-pink-400/35 blur-2xl pointer-events-none"
      />

      {/* Glass Frame Container with Luminous Light Border */}
      <div className="relative w-full max-w-4xl rounded-3xl sm:rounded-[2.5rem] p-3 sm:p-5 md:p-6 bg-gradient-to-b from-white/95 via-sky-50/60 to-indigo-50/40 backdrop-blur-xl border-2 border-sky-300/90 shadow-[0_10px_40px_rgba(59,130,246,0.25),0_0_25px_rgba(99,102,241,0.25)] transition-all duration-500 hover:shadow-[0_15px_50px_rgba(59,130,246,0.38),0_0_35px_rgba(168,85,247,0.35)] group overflow-hidden">
        
        {/* Animated Traveling Luminous Beam on Top Border */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          className="absolute top-0 left-0 w-1/2 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 via-sky-300 to-transparent z-20 shadow-[0_0_14px_#38bdf8]"
        />

        {/* Animated Traveling Luminous Beam on Bottom Border */}
        <motion.div 
          animate={{ x: ['200%', '-100%'] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          className="absolute bottom-0 right-0 w-1/2 h-[3px] bg-gradient-to-r from-transparent via-purple-400 via-indigo-300 to-transparent z-20 shadow-[0_0_14px_#c084fc]"
        />

        {/* Corner Ambient Light Flares */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-sky-400/25 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-purple-400/25 rounded-full blur-xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-400/25 rounded-full blur-xl pointer-events-none" />

        {/* Main Image with Luminous Contour Drop-Shadow Glow */}
        <div className="relative w-full flex items-center justify-center bg-transparent z-10">
          <img
            src={imageSrc}
            alt="Placivo AI Student Scene"
            className="w-full h-auto max-h-[560px] object-contain transition-transform duration-700 hover:scale-[1.015]"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.5)) drop-shadow(0 0 28px rgba(99,102,241,0.35)) drop-shadow(0 15px 30px rgba(15,23,42,0.12))'
            }}
          />
        </div>

      </div>

    </div>
  );
};



