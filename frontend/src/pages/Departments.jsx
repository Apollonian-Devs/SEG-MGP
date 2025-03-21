import React, { useState, useEffect } from "react";
import TeamCard from "../components/TeamCard";
import GenericButton from "../components/GenericButton";
import KCLImage from "../assets/kclFaculty.png";

const Departments = () => {


  const [lightMode, setLightMode] = useState(false);



  useEffect(() => {
    if (lightMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [lightMode]);

  // List of departments with name, description, and URL
  const departmentFixtures = [
    { 
      name: 'Faculty of Arts & Humanities', 
      description: 'Covers literature, history, philosophy, and creative industries.', 
      url: 'https://www.kcl.ac.uk/artshums',
    },
    { 
      name: 'Faculty of Social Science & Public Policy', 
      description: 'Focuses on global affairs, politics, and public policy.', 
      url: 'https://www.kcl.ac.uk/sspp' 
    },
    { 
      name: 'Faculty of Natural, Mathematical & Engineering Sciences', 
      description: 'Includes mathematics, physics, informatics, and engineering.', 
      url: 'https://www.kcl.ac.uk/nmes' 
    },
    { 
      name: 'Faculty of Life Sciences & Medicine', 
      description: 'Covers medical biosciences, cardiovascular studies, and pharmaceutical sciences.', 
      url: 'https://www.kcl.ac.uk/lsm' 
    },
    { 
      name: "King's Business School", 
      description: 'Focuses on accounting, finance, marketing, and business strategy.', 
      url: 'https://www.kcl.ac.uk/business' 
    },
    { 
      name: 'The Dickson Poon School of Law', 
      description: 'Specializes in legal studies and research.', 
      url: 'https://www.kcl.ac.uk/law/index' 
    },
    { 
      name: 'Faculty of Dentistry, Oral & Craniofacial Sciences', 
      description: 'Covers dental sciences and oral healthcare.', 
      url: 'https://www.kcl.ac.uk/dentistry' 
    },
    { 
      name: 'Florence Nightingale Faculty of Nursing, Midwifery & Palliative Care', 
      description: 'Focuses on nursing, midwifery, and palliative care.', 
      url: 'https://www.kcl.ac.uk/nmpc' 
    },
    { 
      name: 'Institute of Psychiatry, Psychology & Neuroscience', 
      description: 'Researches mental health, neuroscience, and addiction studies.', 
      url: 'https://www.kcl.ac.uk/ioppn' 
    },
    { 
      name: 'IT', 
      description: 'Handles technical support, student portals, and system security.', 
      url: 'https://www.kcl.ac.uk/it/help-and-support' 
    },
    { 
      name: 'HR', 
      description: 'Manages staff recruitment, payroll, and work policies.', 
      url: 'https://www.kcl.ac.uk/professional-services/hr' 
    },
    { 
      name: 'Finance', 
      description: 'Handles tuition fees, scholarships, and financial aid.', 
      url: 'https://www.kcl.ac.uk/study/undergraduate/fees-and-funding/contact-us' 
    },
    { 
      name: 'Wellbeing', 
      description: 'Provides student counseling and wellbeing services.', 
      url: 'https://www.kcl.ac.uk/student-life/wellbeing' 
    },
    { 
      name: 'Maintenance', 
      description: 'Manages building maintenance, plumbing, and electrical repairs.', 
      url: 'https://self-service.kcl.ac.uk/article/KA-01949/en-us' 
    },
    { 
      name: 'Housing', 
      description: 'Oversees student accommodations, dorm assignments, and rent payments.', 
      url: "https://www.kclsu.org/help/advice/othersupport/housing/"
    },
    { 
      name: 'Admissions', 
      description: 'Manages student applications, enrollment, and transfers.', 
      url: 'https://www.kcl.ac.uk/study/undergraduate/how-to-apply/contact' 
    },
    { 
      name: 'Library Services', 
      description: 'Oversees book loans, research databases, and study spaces.', 
      url: 'https://www.kcl.ac.uk/library' 
    },
    { 
      name: 'Student Affairs', 
      description: 'Handles extracurricular activities, student unions, and student complaints.', 
      url: 'https://www.kcl.ac.uk/study-at-kings/student-services' 
    }
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

      {/* Departments Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <header className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Explore King's College Departments
            </h2>
          </header>

          {/* Department Cards */}
          <div className="flex flex-wrap -mx-4 justify-center">
            {departmentFixtures.map((dept, index) => (
              <TeamCard
                key={index}
                name={dept.name}
                description={dept.description}
                imageSrc={KCLImage}
                url={dept.url} 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Departments;
