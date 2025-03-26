import React from 'react';
import  {GenericDropdown}  from '../components';
import { motion } from 'framer-motion';
import { ArrowBigLeft } from 'lucide-react';
import { faqData } from '../constants';

console.log(faqData);
  
const HelpQA = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <motion.a
        href="/"
        className="flex items-center gap-1 py-2 px-4 w-fit bg-customOrange-dark text-lg text-white font-semibold rounded-lg shadow-md hover:bg-customOrange-light transition-colors duration-500 ease-in-out"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        whileHover={{ scale: 1.1 }}
      >
        <ArrowBigLeft size={20} />
        Back
      </motion.a>

      <motion.div
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h1>

        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <GenericDropdown
                buttonName={faq.question}
                className="w-full text-left p-4 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition"
              >
                <div className="p-3 text-gray-700 border-t border-gray-200">{faq.answer}</div>
              </GenericDropdown>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HelpQA; 
