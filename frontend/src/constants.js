import Adam from '/members/Adam.jpg';
import Siddhant from '/members/Siddhant.jpg';
import Josiah from '/members/Josiah.jpg';
import Dimitrios from '/members/Dimitrios.jpg';
import Fahim from '/members/Fahim.jpg';
import Lucas from '/members/Lucas.jpg';
import Rahat from '/members/Rahat.jpg';
import Ryan from '/members/Ryan.jpg';

export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh";

export const members = [
  { name: 'Josiah Chan', imageSrc: Josiah, link: 'https://github.com/josiahwkc'},
  { name: 'Rahat Chowdhury', imageSrc: Rahat, link: 'https://github.com/rahacho'},
  { name: 'Lucas Jaroenpanichying', imageSrc: Lucas, link: 'https://github.com/Lluc4s'},
  { name: 'Dimitrios Katsoulis', imageSrc: Dimitrios, link: 'https://github.com/DKatsoulis12'},
  { name: 'Siddhant Mohapatra', imageSrc: Siddhant, link: 'https://github.com/SiddyWiddy' },
  { name: 'Fahim Nouri Nasir', imageSrc: Fahim, link: 'https://github.com/FahimNN'},
  { name: 'Yau Ting Hiu Ryan', imageSrc: Ryan, link: 'https://github.com/abbyryan414'},
  { name: 'Adam Wood', imageSrc: Adam, link: 'https://github.com/Pluto-999'},
];

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

// List of departments with name, description, and URL
export const departmentFixtures = [
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