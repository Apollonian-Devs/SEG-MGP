import React, { useState, useEffect } from "react";
import TeamCard from "./TeamCard";
import GenericButton from "./GenericButton";

// Import all images
import JosiahImage1 from '../assets/Josiah.png';
import JosiahImage2 from '../assets/Rahat.png';
import JosiahImage3 from '../assets/Lucas.png';
import JosiahImage4 from '../assets/Dimitrios.png';
import JosiahImage5 from '../assets/Siddhant.png';
import JosiahImage6 from '../assets/Fahim.png';
import JosiahImage7 from '../assets/Ryan.png';
import JosiahImage8 from '../assets/Adam.png';

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

  // Team members data with unique images
  
  const teamMembers = [
    { name: "Josiah", profession: "Full Stack Developer", imageSrc: JosiahImage1 },
    { name: "Rahat", profession: "Web Developer", imageSrc: JosiahImage2 },
    { name: "Lucas", profession: "Web Developer", imageSrc: JosiahImage3 },
    { name: "Dimitrios", profession: "Web Developer", imageSrc: JosiahImage4 },
    { name: "Siddhant", profession: "Web Developer", imageSrc: JosiahImage5 },
    { name: "Fahim", profession: "Web Developer", imageSrc: JosiahImage6 },
    { name: "Ryan", profession: "React & Django Software Engineer", imageSrc: JosiahImage7 },
    { name: "Adam", profession: "Full Stack Programmer | Django & React JS", imageSrc: JosiahImage8 },
  ];

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
            {teamMembers.map((member, index) => (
              <TeamCard
                key={index}
                name={member.name}
                profession={member.profession}
                imageSrc={member.imageSrc}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Departments;


