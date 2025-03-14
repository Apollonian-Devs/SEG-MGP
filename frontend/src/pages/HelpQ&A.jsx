import React from 'react';
import GenericDropdown from '../components/GenericDropdown';

const faqData = [
  { question: 'What is this service about?', answer: 'This service provides useful information and tools for users.' },
  { question: 'How do I reset my password?', answer: 'You can reset your password from the login page by clicking on "Forgot Password?" and following the instructions.' },
  { question: 'Can I change my subscription plan?', answer: 'Yes, you can change your plan anytime from the account settings page.' },
  { question: 'How can I contact support?', answer: 'You can reach our support team via the contact page or email us at support@example.com.' },
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
