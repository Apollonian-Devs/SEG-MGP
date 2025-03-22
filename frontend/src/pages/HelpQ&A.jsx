import React from 'react';
import GenericDropdown from '../components/GenericDropdown';
import { motion } from 'framer-motion';
import { ArrowBigLeft } from 'lucide-react';

export const faqData = [
    {
      question: "How do I submit a ticket?",
      answer: "You can submit a ticket by logging into your account, navigating to the dashboard, and clicking on 'Submit a Ticket'. Provide the necessary details and submit your request.",
    },
    {
      question: "How can I check the status of my submitted ticket?",
      answer: "To check your ticket status, go to the 'My Tickets' section in your dashboard. Each ticket will display its current status: Open, In Progress, Awaiting Student, or Closed.",
    },
    {
      question: "What happens when my ticket is redirected to another officer?",
      answer: "If your ticket is redirected, you'll receive a notification. The new officer will review your request and continue assisting you. You can check the new assigned officer in the ticket details.",
    },
    {
      question: "Can I update or edit my ticket after submission?",
      answer: "Once a ticket is submitted, you cannot edit the original request. However, you can add comments or attach additional files by opening the ticket and posting a response.",
    },
    {
      question: "How will I be notified about ticket updates?",
      answer: "You'll receive notifications on your dashboard whenever an officer responds to your ticket or if there are important updates regarding your request.",
    },
    {
      question: "What should I do if my ticket is marked as 'Awaiting Student'?",
      answer: "If your ticket is in 'Awaiting Student' status, it means the assigned officer needs additional information. Open the ticket and provide the requested details to proceed.",
    },
    {
      question: "Who can access my support tickets?",
      answer: "Your tickets are visible only to you and the assigned support officer. If necessary, higher-level staff may access them for administrative purposes.",
    },
    {
      question: "How long does it take to resolve a ticket?",
      answer: "Resolution times depend on the complexity of the request and officer availability. Most tickets are addressed within 24-48 hours.",
    },
    {
      question: "Can I close my own ticket?",
      answer: "Currently, only assigned officers can mark a ticket as 'Closed'. However, if your issue is resolved, you can leave a comment requesting closure.",
    },
  ];
  
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
