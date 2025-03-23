import React, { useState } from "react";
import KCLImage from "../assets/kcl_logo.jpg";
import { ArrowBigLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

const Departments = () => {

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
    <div className="min-w-[80%] flex flex-col gap-4 justify-center items-center" >
      <motion.a
        href="/"
        className="flex items-center gap-1 py-2 px-4 w-fit bg-customOrange-dark text-lg text-white font-semibold rounded-lg shadow-md hover:bg-customOrange-light transition-colors duration-500 ease-in-out"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.1 }}
      >
        <ArrowBigLeft size={20} />
        Back
      </motion.a>
      <motion.section
        className="p-10 bg-white text-black rounded-3xl shadow-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div className="flex flex-col gap-10">
          <h2 className="flex items-center text-3xl md:text-4xl font-bold justify-center gap-2">
            <Search size={40} className="max-sm:hidden" />
            Explore King's College Departments
          </h2>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentFixtures.map((dept, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <DepartmentCard
                  key={index}
                  index={index}
                  name={dept.name}
                  description={dept.description}
                  imageSrc={KCLImage}
                  url={dept.url}
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Departments;

const flipVariants = {
  front: { rotateX: 0 },
  back: { rotateX: 180 },
};

const DepartmentCard = ({ name, description, url, imageSrc }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      onClick={() => setFlipped(!flipped)}
      className="h-56 perspective cursor-pointer"
      whileHover={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <motion.div
        className="relative w-full h-full rounded-xl shadow-lg"
        variants={flipVariants}
        animate={flipped ? 'back' : 'front'}
        initial="front"
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <motion.div
          className="absolute w-full h-full backface-hidden bg-customOrange-dark/60 text-gray-700 rounded-xl p-4 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img src={imageSrc} alt={name} className="h-20 mb-4" />
          <h3 className="text-xl font-semibold text-center leading-5 text-pretty">{name}</h3>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute w-full h-full bg-neutral-300 text-gray-800 rounded-xl p-4 flex flex-col justify-center items-center gap-6"
          style={{ rotateX: '180deg', backfaceVisibility: 'hidden' }}
        >
          <p className="text-sm text-center text-pretty">{description}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-customOrange-dark text-white rounded-md hover:bg-customOrange-light"
          >
            Visit Site
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
