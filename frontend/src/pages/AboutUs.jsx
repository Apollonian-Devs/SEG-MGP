import React from 'react';
import { ArrowBigLeft, Lightbulb, Users, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import Adam from '/members/Adam.jpg';
import Siddhant from '/members/Siddhant.jpg';
import Josiah from '/members/Josiah.jpg';
import Dimitrios from '/members/Dimitrios.jpg';
import Fahim from '/members/Fahim.jpg';
import Lucas from '/members/Lucas.jpg';
import Rahat from '/members/Rahat.jpg';
import Ryan from '/members/Ryan.jpg';


const members = [
  { name: 'Josiah Chan', imageSrc: Josiah, link: 'https://github.com/josiahwkc'},
  { name: 'Rahat Chowdhury', imageSrc: Rahat, link: 'https://github.com/rahacho'},
  { name: 'Lucas Jaroenpanichying', imageSrc: Lucas, link: 'https://github.com/Lluc4s'},
  { name: 'Dimitrios Katsoulis', imageSrc: Dimitrios, link: 'https://github.com/DKatsoulis12'},
  { name: 'Siddhant Mohapatra', imageSrc: Siddhant, link: 'https://github.com/SiddyWiddy' },
  { name: 'Fahim Nouri Nasir', imageSrc: Fahim, link: 'https://github.com/FahimNN'},
  { name: 'Yau Ting Hiu Ryan', imageSrc: Ryan, link: 'https://github.com/abbyryan414'},
  { name: 'Adam Wood', imageSrc: Adam, link: 'https://github.com/Pluto-999'},
];

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center gap-4">
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
      <motion.div
        className="max-w-4xl mx-auto p-8 space-y-8 bg-gradient-to-br from-white to-slate-100 shadow-xl rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-center text-customOrange-dark">About This Project</h1>
        <p className="text-center text-gray-600 text-lg">
          Project Duration: <strong>13 January 2025</strong> – <strong>27 March 2025</strong><br />
          Contribution to Module Mark: <strong>80.75%</strong>
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-customOrange-dark">
            <Lightbulb size={20} /> Project Brief
          </h2>
          <p className="text-gray-700 text-balance">
            Universities are complex institutions where students often struggle to identify where to direct their queries—ranging from academics and welfare to finances and procedures. Programme officers and tutors frequently handle these questions, many of which could be better directed, require more context, or are repetitive.
          </p>
          <p className="text-gray-700 text-balance">
            This project aims to build a modern ticketing system that simplifies query management for programme officers. It reduces reliance on email and introduces ticket tracking to manage response workflows and overdue queries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-customOrange-dark">
            <Users size={20} /> Team Members
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {members.map((member, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <MemberCard name={member.name} imageSrc={member.imageSrc} link={member.link} />
              </motion.li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-customOrange-dark">
            <Bot size={20} /> Use of Generative AI
          </h2>
          <p className="text-gray-700 text-balance">
            We use AI to suggest the appropriate department or staff member to handle a ticket based on the query content. This intelligent routing can streamline operations and ensure that queries reach the right person more efficiently.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default AboutUs;

const MemberCard = ({ name, imageSrc, link }) => {
  return (
    <motion.div
      className="bg-customOrange-dark/60  rounded-lg shadow-md cursor-pointer"
      whileHover={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <a href={link} target="_blank" rel="noopener noreferrer" className='flex items-center gap-4 p-2'>
        <img src={imageSrc} alt={name} className="h-16 w-16 rounded-full shadow-md" />
        <h3 className="text-xl font-semibold text-gray-700">{name}</h3>
      </a>
    </motion.div>
  );
};
