import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowBigLeft, Search } from "lucide-react";
import KCLImage from "../assets/kcl_logo.jpg";
import departmentURLs from "../utils/departmentURLs"; // import your URL map
import handleApiError from "../utils/errorHandler";
import api from "../api";

/**
 * @component
 * Departments - A page displaying a list of King's College departments with interactive department cards.
 *
 * @state
 * - departments (array): Stores the list of departments retrieved from the API.
 *
 * @effects
 * - Fetches department data from the API on component mount and enriches it with URLs.
 *
 * @returns {JSX.Element}
 */

const Departments = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/api/departments/");
        const enriched = res.data.map((dept) => ({
          ...dept,
          url: departmentURLs[dept.name] || "#", // fallback to '#' if URL not found
        }));
        setDepartments(enriched);
      } catch (error) {
        handleApiError(error, "Error fetching departments");
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="min-w-[80%] flex flex-col gap-4 justify-center items-center">
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
            {departments.map((dept, index) => (
              <motion.li
                key={dept.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DepartmentCard
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


/**
 * @component
 * DepartmentCard - A flip-card component displaying department information.
 *
 * @props
 * - name (string): The name of the department.
 * - description (string): A brief description of the department.
 * - url (string): The external link to the department's webpage.
 * - imageSrc (string): The source URL for the department image.
 *
 * @state
 * - flipped (boolean): Tracks whether the card is flipped to show the back side.
 *
 * @returns {JSX.Element}
 */

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
