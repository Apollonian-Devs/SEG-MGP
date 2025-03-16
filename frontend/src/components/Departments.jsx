import React, { useState, useEffect } from "react";
import TeamCard from "./TeamCard";
import GenericButton from "./GenericButton";

const Departments = () => {
  // State for light/dark mode
  const [lightMode, setLightMode] = useState(false);

  // Effect to apply the dark mode class to <html> dynamically
  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [lightMode]);

  return (
<div className={`${lightMode ? "bg-white text-black" : "bg-gray-900 text-white"} min-h-screen transition-colors duration-500 ease-in-out`}>

      {/* Toggle Button */}
      <div className="flex justify-center py-6">
        <GenericButton
          onClick={() => setLightMode(!lightMode)}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          {lightMode ? "Dark Mode" : "Light Mode"}
        </GenericButton>
      </div>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <p className="text-lg font-semibold text-primary mb-2">
              Our Team
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Meet Our Awesome Team
            </h2>
            <p className="mt-4 text-base max-w-2xl mx-auto">
              Our team of professionals is committed to excellence and ready to help you reach your goals.
            </p>
          </header>

          {/* Team Members */}
          <div className="flex flex-wrap -mx-4 justify-center">
            <TeamCard name="Coriss Ambady" profession="Web Developer" imageSrc="https://i.ibb.co/T1J9LD4/image-03-2.jpg" />
            <TeamCard name="Coriss Ambady" profession="Web Developer" imageSrc="https://i.ibb.co/8P6cvVy/image-01-1.jpg" />
            <TeamCard name="Coriss Ambady" profession="Web Developer" imageSrc="https://i.ibb.co/30tGtjP/image-04.jpg" />
            <TeamCard name="Coriss Ambady" profession="Web Developer" imageSrc="https://i.ibb.co/yVVT0Dp/image-02-2.jpg" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Departments;