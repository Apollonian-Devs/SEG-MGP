import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const TeamCard = ({ imageSrc, name, profession }) => {
  // Motion values to track mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smoother animation (optional)
  const xSpring = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // Convert mouse x/y to rotation angles
  // Adjust [0, 300] to match the width/height of the card for best effect
  const rotateX = useTransform(ySpring, [0, 300], [15, -15]);
  const rotateY = useTransform(xSpring, [0, 300], [-15, 15]);

  // Handle mouse movement within the card
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Get x/y relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);
  };

  // Reset to center on mouse leave
  const handleMouseLeave = () => {
    // Choose the "center" of your [0, 300] range (150 here)
    mouseX.set(150);
    mouseY.set(150);
  };

  return (
    <div className="w-full px-4 md:w-1/2 xl:w-1/4" style={{ perspective: 1000 }}>
      <motion.div
        className="mx-auto mb-10 w-full max-w-[370px] bg-white dark:bg-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative">
          <img
            src={imageSrc}
            alt={`${name}'s photo`}
            className="w-full h-60 object-cover"
          />
          {/* Optional overlay for a subtle gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-40"></div>
        </div>
        <div className="p-5 text-center">
          <h3 className="text-xl font-semibold text-dark dark:text-white mb-1">
            {name}
          </h3>
          <p className="text-sm text-body-color dark:text-dark-6">
            {profession}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamCard;
