import React from 'react';
import GenericDropdown from '../components/GenericDropdown';

const faqData = [
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {faqData.map((faq, index) => (
          <GenericDropdown
            key={index}
            buttonName={faq.question}
            className="w-full text-left p-4 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition"
            >
          <div className="p-3 text-gray-700 border-t border-gray-200">{faq.answer}</div>
        </GenericDropdown>
        
        ))}
      </div>
    </div>
  );
};

export default HelpQA;
