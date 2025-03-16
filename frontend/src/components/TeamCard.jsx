

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const ProfileDetail = ({ name, profession, imageSrc, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center"
    >
      <img src={imageSrc} alt={name} className="w-40 h-40 mx-auto rounded-full mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{name}</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300">{profession}</p>
      <button
        onClick={onBack}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Go Back
      </button>
    </motion.div>
  );
};

const TeamCard = ({ imageSrc, name, profession }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Motion values for 3D effect
  const mouseX = useMotionValue(150);
  const mouseY = useMotionValue(150);
  const xSpring = useSpring(mouseX, { stiffness: 150, damping: 10 });
  const ySpring = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(ySpring, [0, 250], [20, -20]);
  const rotateY = useTransform(xSpring, [0, 250], [-20, 20]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(150);
    mouseY.set(150);
  };

  return (
    <AnimatePresence mode="wait">
      {showDetails ? (
        <ProfileDetail
          name={name}
          profession={profession}
          imageSrc={imageSrc}
          onBack={() => setShowDetails(false)}
        />
      ) : (
        <motion.div
          className="w-full px-4 md:w-1/2 xl:w-1/4"
          style={{ perspective: 1000 }}
          onClick={() => setShowDetails(true)}
        >
          <div
            className="relative mx-auto mb-10 w-full max-w-[370px] cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-xl bg-gray-300 shadow-xl"
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                scale: 1.05,
                y: '10px',
                x: '10px',
                zIndex: 0,
              }}
            />

            <motion.div
              className="relative w-full h-full rounded-xl overflow-hidden bg-white dark:bg-dark shadow-lg"
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                zIndex: 1,
              }}
            >
              <div className="relative">
                <img src={imageSrc} alt={name} className="w-full h-60 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-40" />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-dark dark:text-white mb-1">{name}</h3>
                <p className="text-sm text-body-color dark:text-gray-300">{profession}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamCard;

