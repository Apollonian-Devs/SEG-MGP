student_fixtures = [
    {'username': '@johndoe', 'email': 'john.doe@example.org', 'first_name': 'John', 'last_name': 'Doe', 'is_staff': False, 'is_superuser': False},
    {'username': '@janedoe', 'email': 'jane.doe@example.org', 'first_name': 'Jane', 'last_name': 'Doe', 'is_staff': False, 'is_superuser': False},
    {'username': '@charlie', 'email': 'charlie.johnson@example.org', 'first_name': 'Charlie', 'last_name': 'Johnson', 'is_staff': False, 'is_superuser': False},
]

officer_fixtures = [
    {'username': '@officer1', 'email': 'officer1@example.org', 'first_name': 'Officer', 'last_name': 'One', 'is_staff': True, 'is_superuser': False, 'department': 'IT'},
    {'username': '@officer2', 'email': 'officer2@example.org', 'first_name': 'Officer', 'last_name': 'Two', 'is_staff': True, 'is_superuser': False, 'department': 'HR'},
    {'username': '@officer3', 'email': 'officer3@example.org', 'first_name': 'Officer', 'last_name': 'Three', 'is_staff': True, 'is_superuser': False, 'department': 'Finance'},
    {'username': '@officer4', 'email': 'officer4@example.org', 'first_name': 'Officer', 'last_name': 'Four', 'is_staff': True, 'is_superuser': False, 'department': 'IT'},
]

chief_officer_fixtures = [

    {'username': '@chiefofficer1', 'email': 'chiefofficer1@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'One', 'is_staff': True, 'is_superuser': False, 'is_department_head': True,'department': 'IT'},

    {'username': '@chiefofficer2', 'email': 'chiefofficer2@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Two', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'HR'},

    {'username': '@chiefofficer3', 'email': 'chiefofficer3@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Three', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Finance'},

    {'username': '@chiefofficer4', 'email': 'chiefofficer4@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Four', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Wellbeing'},
    
    {'username': '@chiefofficer5', 'email': 'chiefofficer5@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Five', 'is_staff': True, 'is_superuser': False, 'is_department_head': True,'department': 'Maintenance'},

    {'username': '@chiefofficer6', 'email': 'chiefofficer6@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Six', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Housing'},

    {'username': '@chiefofficer7', 'email': 'chiefofficer7@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Seven', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Admissions'},

    {'username': '@chiefofficer8', 'email': 'chiefofficer8@example.org', 'first_name': 'ChiefOfficer', 'last_name': 'Eight', 'is_staff': True, 'is_superuser': False, 'is_department_head': True, 'department': 'Library Services'},
]


admin_fixtures = [
    {'username': '@admin1', 'email': 'admin1@example.org', 'first_name': 'Admin', 'last_name': 'One', 'is_staff': True, 'is_superuser': True},
]

department_fixtures = [
    # King's College London Faculties
    {'name': 'Faculty of Arts & Humanities', 'description': 'Covers literature, history, philosophy, and creative industries.'},
    {'name': 'Faculty of Social Science & Public Policy', 'description': 'Focuses on global affairs, politics, and public policy.'},
    {'name': 'Faculty of Natural, Mathematical & Engineering Sciences', 'description': 'Includes mathematics, physics, informatics, and engineering.'},
    {'name': 'Faculty of Life Sciences & Medicine', 'description': 'Covers medical biosciences, cardiovascular studies, and pharmaceutical sciences.'},
    {'name': "King's Business School", 'description': 'Focuses on accounting, finance, marketing, and business strategy.'},
    {'name': 'The Dickson Poon School of Law', 'description': 'Specializes in legal studies and research.'},
    {'name': 'Faculty of Dentistry, Oral & Craniofacial Sciences', 'description': 'Covers dental sciences and oral healthcare.'},
    {'name': 'Florence Nightingale Faculty of Nursing, Midwifery & Palliative Care', 'description': 'Focuses on nursing, midwifery, and palliative care.'},
    {'name': 'Institute of Psychiatry, Psychology & Neuroscience', 'description': 'Researches mental health, neuroscience, and addiction studies.'},

    # Administrative & Service Departments
    {'name': 'IT', 'description': 'Handles technical support, student portals, and system security.'},
    {'name': 'HR', 'description': 'Manages staff recruitment, payroll, and work policies.'},
    {'name': 'Finance', 'description': 'Handles tuition fees, scholarships, and financial aid.'},
    {'name': 'Wellbeing', 'description': 'Provides student counseling and wellbeing services.'},
    {'name': 'Maintenance', 'description': 'Manages building maintenance, plumbing, and electrical repairs.'},
    {'name': 'Housing', 'description': 'Oversees student accommodations, dorm assignments, and rent payments.'},
    {'name': 'Admissions', 'description': 'Manages student applications, enrollment, and transfers.'},
    {'name': 'Library Services', 'description': 'Oversees book loans, research databases, and study spaces.'},
    {'name': 'Student Affairs', 'description': 'Handles extracurricular activities, student unions, and student complaints.'},
]


ticket_fixtures = [
    {
        'subject': 'Lost Student ID',
        'description': 'I lost my ID card near the library. Need help getting a replacement.',
        'created_by': '@johndoe',   
        'assigned_to': '@officer1', 
        'status': 'Open',
        'priority': 'High',
    },
    {
        'subject': 'Check My Fees',
        'description': 'Not sure how much I owe in tuition fees this semester.',
        'created_by': '@janedoe',
        'assigned_to': '@officer2',
        'status': 'Open',
        'priority': 'Medium',
    },
    {
        'subject': 'Dorm Maintenance Issue',
        'description': 'There is a water leak in my dorm room sink.',
        'created_by': '@charlie',
        'assigned_to': '@officer2',
        'status': 'In Progress',
        'priority': 'High',
    },
]



ticket_message_fixtures = [
    {
        'ticket_subject': 'Lost Student ID',
        'messages': [
            {'sender': '@johndoe', 'body': 'Hello, I lost my ID. What should I do?', 'is_internal': False},
            {'sender': '@officer1', 'body': 'You can visit the card office for a replacement.', 'is_internal': False},
        ]
    },
    {
        'ticket_subject': 'Check My Fees',
        'messages': [
            {'sender': '@janedoe', 'body': 'Could you clarify my outstanding fees?', 'is_internal': False},
            {'sender': '@officer2', 'body': 'Please check your student portal for updated fee details.', 'is_internal': False},
        ]
    },
    {
        'ticket_subject': 'Dorm Maintenance Issue',
        'messages': [
            {'sender': '@charlie', 'body': 'Hello, I am having leakage issues in my dorm room. I live on Room 101 on the Waterloo accommodation. There are mold and moisture patches forming on the walls. Please send someone to check immediately!', 'is_internal': False},
            {'sender': '@charlie', 'body': 'My dorm sink is leaking. Any updates?', 'is_internal': False},
            {'sender': '@officer2', 'body': 'Maintenance has been notified and will check soon.', 'is_internal': False},
            {'sender': '@officer2', 'body': 'Internal note: Leak might need urgent plumbing services.', 'is_internal': True},
        ]
    },
]



notification_fixtures = [
    {
        'user_profile': '@johndoe',
        'ticket_subject': 'Lost Student ID',
        'message': 'Your ticket regarding your lost ID has been updated.',
    },
    {
        'user_profile': '@janedoe',
        'ticket_subject': 'Check My Fees',
        'message': 'An officer has responded to your ticket about fees.',
    },
    {
        'user_profile': '@charlie',
        'ticket_subject': 'Dorm Maintenance Issue',
        'message': 'Maintenance is addressing the leak in your dorm.',
    },
    {
        'user_profile': '@officer1',
        'ticket_subject': 'Lost Student ID',
        'message': 'The student has responded to the lost ID ticket.',
    },
    {
        'user_profile': '@officer2',
        'ticket_subject': 'Dorm Maintenance Issue',
        'message': 'Urgent plumbing services may be required for the dorm issue.',
    },
]

ticket_templates_by_department = {
    # King's College London Faculties
    "Faculty of Arts & Humanities": [
        {"subject": "Issue with Course Material Access", "description": "I cannot access the required course materials for my humanities class.", "priority": "Medium"},
        {"subject": "Request for Schedule Change", "description": "I would like to request a change in my class schedule due to a timing conflict.", "priority": "Low"},
        {"subject": "Clarification on Essay Requirements", "description": "I need clarification on the essay requirements for my history course.", "priority": "Medium"},
        {"subject": "Inquiry about Office Hours", "description": "Could you please confirm the current office hours for my professor?", "priority": "Low"},
        {"subject": "Issue with Online Resources", "description": "The online resources for my philosophy class are not loading properly.", "priority": "High"},
        {"subject": "Feedback on Lecture Content", "description": "I have some feedback regarding the recent lecture on art history.", "priority": "Medium"},
        {"subject": "Complaint about Classroom Facilities", "description": "The classroom facilities do not match the class size requirements.", "priority": "High"},
        {"subject": "Issue with Exam Timetable", "description": "There appears to be a conflict in the exam timetable for several courses.", "priority": "High"},
        {"subject": "Request for Academic Advising", "description": "I would like to schedule an appointment for academic advising.", "priority": "Low"},
        {"subject": "Query Regarding Assignment Guidelines", "description": "I am confused about the assignment guidelines for my literature course.", "priority": "Medium"},
    ],
    "Faculty of Social Science & Public Policy": [
        {"subject": "Difficulty Accessing Research Journals", "description": "I am unable to access some research journals required for my policy studies.", "priority": "High"},
        {"subject": "Request for Public Policy Seminar Registration", "description": "I need assistance registering for an upcoming seminar on public policy.", "priority": "Medium"},
        {"subject": "Clarification on Research Ethics Guidelines", "description": "Could you clarify the ethical guidelines for conducting social science research?", "priority": "Medium"},
        {"subject": "Conflict in Group Project Schedule", "description": "Our group project members have conflicting class schedules.", "priority": "Low"},
        {"subject": "Request for Extension on Policy Analysis Paper", "description": "I need an extension on my policy analysis assignment due to unforeseen circumstances.", "priority": "High"},
        {"subject": "Technical Issue with Online Lecture Access", "description": "I am unable to access my recorded lectures online.", "priority": "High"},
        {"subject": "Query Regarding Government Internship Opportunities", "description": "I would like more details on available government internships.", "priority": "Medium"},
        {"subject": "Request for Additional Course Materials", "description": "The course materials for my international relations class are incomplete.", "priority": "Medium"},
        {"subject": "Issue with Social Science Survey Tool", "description": "I am unable to export survey responses from the department’s software.", "priority": "Low"},
        {"subject": "Feedback on Political Science Curriculum", "description": "I would like to provide feedback on the structure of the political science program.", "priority": "Low"},
    ],
    "Faculty of Natural, Mathematical & Engineering Sciences": [
        {"subject": "Access to Physics Lab Restricted", "description": "I am unable to access the physics lab outside of my scheduled hours.", "priority": "Medium"},
        {"subject": "Error in Grading for Calculus Assignment", "description": "There appears to be a mistake in my calculus assignment grading.", "priority": "High"},
        {"subject": "Request for Additional Engineering Lab Equipment", "description": "Our group project requires additional equipment in the engineering lab.", "priority": "Medium"},
        {"subject": "Technical Issue with MATLAB License", "description": "I am unable to activate my MATLAB student license.", "priority": "High"},
        {"subject": "Request for Physics Tutoring Sessions", "description": "I need additional tutoring sessions for my quantum physics course.", "priority": "Low"},
        {"subject": "Issue with Math Department Office Hours", "description": "The math department's posted office hours are inconsistent.", "priority": "Low"},
        {"subject": "Complaint About Overcrowding in Computer Science Lectures", "description": "The CS lecture hall is overcrowded and lacks enough seating.", "priority": "High"},
        {"subject": "Request for Additional Course Prerequisite Information", "description": "I need clarification on the prerequisites for next semester’s engineering courses.", "priority": "Medium"},
        {"subject": "Query About Internship Placement in Data Science", "description": "I need assistance finding an internship placement in data science.", "priority": "Medium"},
        {"subject": "Error in Physics Experiment Results Due to Equipment Malfunction", "description": "Our physics lab equipment malfunctioned during an experiment, affecting our results.", "priority": "High"},
    ],
    "Faculty of Life Sciences & Medicine": [
        {"subject": "Issue with Lab Equipment", "description": "The centrifuge in the biomedical lab is malfunctioning.", "priority": "High"},
        {"subject": "Request for Additional Study Materials", "description": "I need access to more case studies for my medical research.", "priority": "Medium"},
        {"subject": "Clarification on Clinical Placement Schedule", "description": "My clinical placement schedule has conflicting dates.", "priority": "High"},
        {"subject": "Query About Medical Licensing Requirements", "description": "What are the licensing requirements for international students?", "priority": "Medium"},
        {"subject": "Request for Additional Training in Surgery Simulation", "description": "I would like to schedule more sessions in the surgery simulation lab.", "priority": "Medium"},
        {"subject": "Difficulty Accessing Patient Case Studies", "description": "I am unable to access patient case studies in the online database.", "priority": "High"},
        {"subject": "Feedback on Anatomy Course Structure", "description": "The anatomy course could benefit from more interactive sessions.", "priority": "Low"},
        {"subject": "Complaint About Lack of Hospital Training Opportunities", "description": "Our group has had limited opportunities for hands-on hospital training.", "priority": "High"},
        {"subject": "Inquiry About Biomedical Ethics Exam Format", "description": "Could you clarify the structure of the upcoming biomedical ethics exam?", "priority": "Low"},
        {"subject": "Request for Extended Access to Lab Facilities", "description": "I need extended lab access hours for my ongoing research.", "priority": "Medium"},
    ],
    "King's Business School": [
        {"subject": "Difficulty Registering for Finance Elective", "description": "I am unable to register for the Advanced Corporate Finance elective.", "priority": "Medium"},
        {"subject": "Clarification on Business Analytics Assignment", "description": "I need guidance on how to approach the data analysis section.", "priority": "Medium"},
        {"subject": "Issue with Group Project Collaboration Tool", "description": "The online collaboration tool is not functioning properly for our team.", "priority": "High"},
        {"subject": "Request for Entrepreneurship Mentorship Program Details", "description": "I would like to learn more about the entrepreneurship mentorship initiative.", "priority": "Low"},
        {"subject": "Feedback on Marketing Course Case Study Selection", "description": "The case studies used in our marketing course seem outdated.", "priority": "Medium"},
        {"subject": "Query About Internship Placement Process", "description": "How does the school assist with internship placements?", "priority": "Medium"},
        {"subject": "Complaint About Inconsistent Grading in Strategy Course", "description": "There seems to be inconsistency in how assignments are graded.", "priority": "High"},
        {"subject": "Inquiry About Business Simulation Exercise Schedule", "description": "When will the next business strategy simulation be conducted?", "priority": "Low"},
        {"subject": "Request for Additional Financial Modelling Workshops", "description": "We need more workshops on financial modelling tools like Excel and Python.", "priority": "Medium"},
        {"subject": "Issue with Access to Bloomberg Terminal", "description": "The Bloomberg Terminal in the business lab is currently inaccessible.", "priority": "High"},
    ],
    "The Dickson Poon School of Law": [
        {"subject": "Request for Additional Mock Trial Sessions", "description": "Can we schedule more mock trial practice sessions before the exam?", "priority": "Medium"},
        {"subject": "Clarification on Case Law Analysis Assignment", "description": "I need clarification on the required structure for my case law analysis.", "priority": "Medium"},
        {"subject": "Issue with Legal Research Database Access", "description": "I am unable to access the online legal research databases.", "priority": "High"},
        {"subject": "Query Regarding Moot Court Selection Criteria", "description": "What are the selection criteria for the upcoming moot court competition?", "priority": "Medium"},
        {"subject": "Complaint About Delay in Exam Result Release", "description": "Our exam results have not been released within the expected timeframe.", "priority": "High"},
        {"subject": "Inquiry About Law Firm Networking Events", "description": "When are the next networking events with law firms?", "priority": "Low"},
        {"subject": "Request for Extension on Legal Writing Assignment", "description": "I need an extension on my legal writing assignment due to unforeseen circumstances.", "priority": "High"},
        {"subject": "Feedback on Criminal Law Course Readings", "description": "The reading list for the criminal law course is too dense to manage.", "priority": "Medium"},
        {"subject": "Technical Issue with Online Case Brief Submission", "description": "I am unable to upload my case brief through the online portal.", "priority": "High"},
        {"subject": "Request for Additional Office Hours with Professors", "description": "Can professors extend their office hours for additional student consultations?", "priority": "Low"},
    ],
    "Faculty of Dentistry, Oral & Craniofacial Sciences": [
        {"subject": "Request for Additional Dental Practice Sessions", "description": "I need extra practice sessions in the dental simulation lab.", "priority": "Medium"},
        {"subject": "Issue with Dental X-ray Equipment", "description": "The X-ray machine in the dental lab is malfunctioning.", "priority": "High"},
        {"subject": "Clarification on Oral Surgery Exam Format", "description": "Can you provide details about the oral surgery exam format?", "priority": "Medium"},
        {"subject": "Complaint About Lack of Clinical Training Opportunities", "description": "Our batch has had fewer clinical rotations compared to previous years.", "priority": "High"},
        {"subject": "Difficulty Accessing Dental Research Journals", "description": "I am unable to access online journals related to dental studies.", "priority": "High"},
        {"subject": "Feedback on Prosthodontics Course", "description": "I feel the prosthodontics course needs more practical sessions.", "priority": "Low"},
        {"subject": "Request for Extended Clinic Operating Hours", "description": "Can the dental clinic extend its hours for student practice?", "priority": "Medium"},
        {"subject": "Inquiry About Dental Licensing Requirements", "description": "What are the steps for obtaining a dental practice license after graduation?", "priority": "Medium"},
        {"subject": "Issue with Oral Pathology Lecture Notes", "description": "Some of the oral pathology lecture notes are missing from the portal.", "priority": "Medium"},
        {"subject": "Technical Issue with Patient Case Logging System", "description": "I am unable to enter patient details in the case logging system.", "priority": "High"},
    ],
    "Florence Nightingale Faculty of Nursing, Midwifery & Palliative Care": [
        {"subject": "Request for Additional Clinical Placement Hours", "description": "I need additional clinical placement hours to meet my course requirements.", "priority": "High"},
        {"subject": "Clarification on Midwifery Certification Process", "description": "Could you clarify the certification requirements for midwifery students?", "priority": "Medium"},
        {"subject": "Issue with Nursing Simulation Equipment", "description": "The patient simulation mannequin in the lab is not functioning properly.", "priority": "High"},
        {"subject": "Complaint About Scheduling Conflicts in Rotations", "description": "Several students have overlapping schedules for clinical rotations.", "priority": "High"},
        {"subject": "Request for More Hands-on Training in Palliative Care", "description": "Can we have more practical sessions on palliative care nursing?", "priority": "Medium"},
        {"subject": "Inquiry About Nursing Placement Abroad", "description": "Are there opportunities for international placements in the nursing program?", "priority": "Medium"},
        {"subject": "Technical Issue with Medication Dosage Training Software", "description": "I am unable to complete my medication dosage training online.", "priority": "High"},
        {"subject": "Request for Extra Tutoring Sessions in Midwifery", "description": "I need additional tutoring support for midwifery coursework.", "priority": "Low"},
        {"subject": "Difficulty Accessing Research Papers on Patient Care", "description": "I cannot access some nursing research papers on the university portal.", "priority": "High"},
        {"subject": "Feedback on Nursing Ethics Course", "description": "The ethics course should include more real-world case discussions.", "priority": "Low"},
    ],
    "Institute of Psychiatry, Psychology & Neuroscience": [
        {"subject": "Request for Access to fMRI Research Lab", "description": "I need access to the fMRI research lab for my neuroscience project.", "priority": "High"},
        {"subject": "Difficulty Obtaining Clinical Trial Data", "description": "I am unable to obtain anonymized data from the recent clinical trial.", "priority": "High"},
        {"subject": "Clarification on Cognitive Behavioral Therapy (CBT) Case Studies", "description": "Can you clarify the case study requirements for the CBT module?", "priority": "Medium"},
        {"subject": "Issue with EEG Machine Calibration", "description": "The EEG machine in the research center is not properly calibrated.", "priority": "High"},
        {"subject": "Request for Additional Training in Neuropsychological Testing", "description": "I need additional training sessions for administering neuropsychological tests.", "priority": "Medium"},
        {"subject": "Inquiry About Mental Health Research Funding", "description": "Are there funding opportunities available for student-led mental health research?", "priority": "Medium"},
        {"subject": "Complaint About Limited Placement Opportunities in Psychiatry", "description": "There are too few clinical placements available in psychiatry rotations.", "priority": "High"},
        {"subject": "Feedback on Neuroscience Lecture Content", "description": "The neuroscience lectures could benefit from more interactive discussions.", "priority": "Low"},
        {"subject": "Issue with Access to Online Psychology Case Studies", "description": "The psychology case study database is currently inaccessible.", "priority": "High"},
        {"subject": "Technical Issue with fMRI Data Analysis Software", "description": "The fMRI data analysis software is crashing when I try to process results.", "priority": "High"},
    ],
    # Administrative & Service Departments
    "IT": [
        {"subject": "Unable to Access Student Portal", "description": "I cannot log into my student portal due to an error.", "priority": "High"},
        {"subject": "VPN Connection Failure", "description": "I am unable to connect to the university VPN from home.", "priority": "Medium"},
        {"subject": "Software Installation Request", "description": "I need specific software installed on my workstation.", "priority": "Low"},
        {"subject": "Slow Internet on Campus", "description": "The WiFi speed in the library is extremely slow.", "priority": "Medium"},
        {"subject": "Email Login Issue", "description": "My university email login credentials are not working.", "priority": "High"},
        {"subject": "Printer Not Working", "description": "The department printer is jammed and not functioning.", "priority": "Low"},
        {"subject": "Access Denied to Online Learning Platform", "description": "I am unable to access course materials online.", "priority": "High"},
        {"subject": "Issue with Online Exam System", "description": "The exam portal crashed during my test.", "priority": "High"},
        {"subject": "Request for Additional Software License", "description": "We need more licenses for MATLAB in the lab.", "priority": "Medium"},
        {"subject": "Cybersecurity Concern", "description": "I received a phishing email pretending to be from IT support.", "priority": "High"},
    ],
    "HR": [
        {"subject": "Payroll Delay", "description": "My salary for this month has not been credited yet.", "priority": "High"},
        {"subject": "Incorrect Leave Balance", "description": "There appears to be a discrepancy in my leave balance.", "priority": "Medium"},
        {"subject": "Query about Promotion Criteria", "description": "Could you provide details on the criteria for promotion?", "priority": "Low"},
        {"subject": "Request for Workplace Adjustment", "description": "I need an ergonomic chair due to a back issue.", "priority": "Medium"},
        {"subject": "Unclear Tax Deductions", "description": "There are unexplained deductions in my payslip.", "priority": "High"},
        {"subject": "Remote Work Policy Inquiry", "description": "Could you clarify the remote work policy for staff?", "priority": "Medium"},
        {"subject": "Issue with Timesheet Submission", "description": "I am having trouble submitting my timesheet online.", "priority": "Low"},
        {"subject": "Maternity/Paternity Leave Application", "description": "I would like to apply for parental leave.", "priority": "High"},
        {"subject": "Complaint about Workplace Harassment", "description": "I need to report an incident of harassment.", "priority": "High"},
        {"subject": "Request for Professional Development Support", "description": "I need financial assistance for a training course.", "priority": "Medium"},
    ],
    "Finance": [
        {"subject": "Incorrect Tuition Fee Charge", "description": "I have been charged an extra amount for my tuition fees.", "priority": "High"},
        {"subject": "Scholarship Payment Delay", "description": "My scholarship payment has not been deposited yet.", "priority": "High"},
        {"subject": "Request for Fee Installment Plan", "description": "I would like to know if I can pay my fees in installments.", "priority": "Medium"},
        {"subject": "Error in Student Loan Balance", "description": "My student loan balance seems incorrect.", "priority": "Medium"},
        {"subject": "Reimbursement for Conference Expenses", "description": "I have not received my reimbursement for a recent academic conference.", "priority": "Low"},
        {"subject": "Duplicate Payment Issue", "description": "My account was charged twice for the same transaction.", "priority": "High"},
        {"subject": "Tax Information Request", "description": "I need my tax information for financial aid applications.", "priority": "Medium"},
        {"subject": "Unexplained Late Payment Fee", "description": "I was charged a late payment fee incorrectly.", "priority": "High"},
        {"subject": "Error in Monthly Budget Report", "description": "There is an inconsistency in the finance report.", "priority": "Low"},
        {"subject": "Departmental Budget Approval Delay", "description": "Our department's budget approval is taking longer than expected.", "priority": "Medium"},
    ],
    "Wellbeing": [
        {"subject": "Request for Counseling Appointment", "description": "I need to book a counseling session as soon as possible.", "priority": "High"},
        {"subject": "Inquiry about Stress Management Workshop", "description": "Could you provide details on upcoming stress management workshops?", "priority": "Medium"},
        {"subject": "Issue with Booking Counseling Session", "description": "I'm having trouble scheduling a counseling session online.", "priority": "High"},
        {"subject": "Request for Mindfulness Training", "description": "I'd like to participate in mindfulness or meditation training.", "priority": "Low"},
        {"subject": "Complaint About Limited Availability of Therapists", "description": "There are too few therapists available for student consultations.", "priority": "High"},
        {"subject": "Difficulty Accessing Wellbeing Resources Online", "description": "Some links to self-help materials on the portal are broken.", "priority": "Medium"},
        {"subject": "Inquiry About Mental Health Support Groups", "description": "Are there any peer support groups available on campus?", "priority": "Low"},
        {"subject": "Request for Confidential Mental Health Support", "description": "I would like to speak to someone confidentially about my anxiety.", "priority": "High"},
        {"subject": "Feedback on University Wellbeing Services", "description": "The mental health resources provided by the university need improvement.", "priority": "Medium"},
        {"subject": "Request for Academic Stress Management Tips", "description": "Could you suggest ways to manage academic stress more effectively?", "priority": "Low"},
    ],
    "Maintenance": [
        {"subject": "Leaking Pipe in Dormitory", "description": "There is a leaking pipe in my dorm that needs urgent repair.", "priority": "High"},
        {"subject": "Broken Window in Lecture Hall", "description": "A window in one of the lecture halls is broken.", "priority": "Medium"},
        {"subject": "Faulty Lighting in Corridor", "description": "The lighting in the corridor is very dim and needs replacement.", "priority": "Low"},
        {"subject": "Issue with Heating in Library", "description": "The heating in the library is not working properly.", "priority": "Medium"},
        {"subject": "Pest Infestation in Student Dorms", "description": "There have been reports of pests in the student dorms.", "priority": "High"},
        {"subject": "Elevator Malfunction in Main Building", "description": "The elevator in the main building is frequently out of service.", "priority": "High"},
        {"subject": "Water Leakage in Lecture Hall", "description": "There is a water leakage issue affecting classroom floors.", "priority": "Medium"},
        {"subject": "Complaint About Poor Ventilation in Labs", "description": "The lab ventilation system is not working properly.", "priority": "High"},
        {"subject": "Issue with Hot Water Supply in Dorms", "description": "The hot water supply is inconsistent in the dormitories.", "priority": "Medium"},
        {"subject": "Request for Repair of Outdoor Benches", "description": "Several outdoor benches on campus are broken and need fixing.", "priority": "Low"},
    ],
    "Housing": [
        {"subject": "Heating System Failure", "description": "The heating system in my dorm room is not working.", "priority": "High"},
        {"subject": "Request for Room Change", "description": "I would like to change my room due to conflicts with my roommate.", "priority": "Medium"},
        {"subject": "Water Leakage in Room", "description": "There is water leakage in my room that needs immediate attention.", "priority": "High"},
        {"subject": "Issue with Rent Payment", "description": "My rent payment has not been processed despite making the transaction.", "priority": "High"},
        {"subject": "Inquiry About Off-Campus Housing Options", "description": "Does the university provide assistance with off-campus housing?", "priority": "Medium"},
        {"subject": "Request for Dormitory Maintenance", "description": "My dorm room needs basic maintenance, such as painting and plumbing.", "priority": "Medium"},
        {"subject": "Complaint About Noise Levels in Dorms", "description": "My dorm floor is extremely noisy, making it difficult to study.", "priority": "Low"},
        {"subject": "Issue with Dorm Wi-Fi Connection", "description": "The Wi-Fi connection in my dorm is very weak and unstable.", "priority": "High"},
        {"subject": "Request for Additional Laundry Facilities", "description": "The dormitory laundry facilities are insufficient for the number of students.", "priority": "Medium"},
        {"subject": "Feedback on Dormitory Cleanliness", "description": "The cleaning service in the dormitories could be improved.", "priority": "Low"},
    ],
        "Admissions": [
        {"subject": "Issue with Application Submission", "description": "My application form keeps showing an error when I try to submit it.", "priority": "High"},
        {"subject": "Request for Deferred Admission", "description": "I would like to defer my admission to the next academic year.", "priority": "Medium"},
        {"subject": "Inquiry About Scholarship Eligibility", "description": "Can you provide information on scholarships available for my program?", "priority": "Medium"},
        {"subject": "Issue with Uploading Documents", "description": "I am unable to upload the required documents for my application.", "priority": "High"},
        {"subject": "Request for Application Status Update", "description": "Can you provide an update on my application status?", "priority": "Low"},
        {"subject": "Complaint About Lack of Communication", "description": "I have not received any response to my queries regarding my application.", "priority": "High"},
        {"subject": "Inquiry About International Student Requirements", "description": "What are the additional requirements for international applicants?", "priority": "Medium"},
        {"subject": "Request for Admission Interview Rescheduling", "description": "I need to reschedule my admission interview due to a conflict.", "priority": "Low"},
        {"subject": "Issue with Acceptance Letter Download", "description": "I cannot download my admission acceptance letter from the portal.", "priority": "High"},
        {"subject": "Clarification on Tuition Deposit Deadline", "description": "When is the deadline to pay the tuition deposit for securing my seat?", "priority": "Medium"},
    ],
    "Library Services": [
        {"subject": "Request for Extended Library Hours", "description": "Can the library remain open later during the exam period?", "priority": "Medium"},
        {"subject": "Issue with Borrowing Books", "description": "I am unable to borrow books due to an issue with my student account.", "priority": "High"},
        {"subject": "Request for Additional Copies of Textbooks", "description": "There are not enough copies of a required textbook in the library.", "priority": "Medium"},
        {"subject": "Technical Issue with Library Database", "description": "The online library search tool is not returning any results.", "priority": "High"},
        {"subject": "Complaint About Noisy Study Areas", "description": "The quiet study areas are often too loud for focused studying.", "priority": "Low"},
        {"subject": "Inquiry About Research Paper Access", "description": "How can I access restricted research papers for my dissertation?", "priority": "Medium"},
        {"subject": "Issue with Printing Services", "description": "The library's printing system is not working properly.", "priority": "High"},
        {"subject": "Request for Interlibrary Loan", "description": "I need a book that is not available in our library. Can it be ordered?", "priority": "Medium"},
        {"subject": "Difficulty Accessing Online Journals", "description": "I am unable to access online research journals through the university network.", "priority": "High"},
        {"subject": "Request for More Study Spaces", "description": "The library study areas are always full. Can more spaces be provided?", "priority": "Low"},
    ],
    "Student Affairs": [
        {"subject": "Issue with Student Union Registration", "description": "I am unable to register for the student union online.", "priority": "Medium"},
        {"subject": "Complaint About Lack of Student Events", "description": "There are not enough student social events being organized.", "priority": "Low"},
        {"subject": "Inquiry About Extracurricular Clubs", "description": "How can I start a new student club on campus?", "priority": "Medium"},
        {"subject": "Request for Conflict Resolution Meeting", "description": "I need assistance in resolving a dispute with another student.", "priority": "High"},
        {"subject": "Feedback on Student Government Elections", "description": "The student elections process should be more transparent.", "priority": "Medium"},
        {"subject": "Request for Disability Support Services", "description": "I need accommodations for my disability in student activities.", "priority": "High"},
        {"subject": "Issue with Student Discount Cards", "description": "My student discount card is not being accepted at partner stores.", "priority": "Low"},
        {"subject": "Inquiry About Mental Health Awareness Events", "description": "Are there any upcoming events related to student mental health?", "priority": "Medium"},
        {"subject": "Complaint About Inadequate Sports Facilities", "description": "The sports facilities on campus are outdated and need improvements.", "priority": "High"},
        {"subject": "Request for Better Communication with Students", "description": "There should be more frequent updates on student affairs news.", "priority": "Medium"},
    ],
}

conversation_templates = [
    [
        {"sender_type": "student", "text": "Hi, I'm experiencing an issue. Could you help me out?"},
        {"sender_type": "officer", "text": "Hello, thank you for contacting us. We are looking into your issue."}
    ],
    [
        {"sender_type": "student", "text": "I need assistance with this matter. Please advise."},
        {"sender_type": "officer", "text": "Could you please provide more details so we can assist you further?"},
        {"sender_type": "student", "text": "Sure, here are additional details."},
        {"sender_type": "officer", "text": "Thank you for the information. We'll update you soon."}
    ],
    [
        {"sender_type": "student", "text": "I'm following up on my issue. Any progress so far?"},
        {"sender_type": "officer", "text": "I apologize for the delay. I'm checking on the status and will get back to you shortly."},
        {"sender_type": "student", "text": "Thank you for the update."}
    ],
    [
        {"sender_type": "student", "text": "This issue is urgent. I need help with it as soon as possible."},
        {"sender_type": "officer", "text": "I understand the urgency. I've escalated the issue to our specialist team."},
        {"sender_type": "student", "text": "I appreciate your prompt response."}
    ],
    [
        {"sender_type": "officer", "text": "We've reviewed your request and need additional information."},
        {"sender_type": "student", "text": "Sure, what details do you need?"},
        {"sender_type": "officer", "text": "Could you specify any relevant details regarding the issue?"},
        {"sender_type": "student", "text": "Yes, here is the information you requested."},
        {"sender_type": "officer", "text": "Thank you! We'll proceed with the resolution."}
    ],
    [
        {"sender_type": "student", "text": "Is there an estimated timeline for resolution?"},
        {"sender_type": "officer", "text": "We expect to have it resolved soon. We'll update you as soon as possible."},
        {"sender_type": "student", "text": "Great! I appreciate the update."}
    ],
    [
        {"sender_type": "student", "text": "Can you clarify the process for resolving this?"},
        {"sender_type": "officer", "text": "Certainly! The process involves the following steps."},
        {"sender_type": "student", "text": "That makes sense. Thanks for the clarification!"}
    ],
    [
        {"sender_type": "officer", "text": "We've completed the initial investigation. Here's what we found."},
        {"sender_type": "student", "text": "That explains a lot. What are the next steps?"},
        {"sender_type": "officer", "text": "The next step is to implement a solution. We will update you once it's done."}
    ],
    [
        {"sender_type": "student", "text": "I followed the instructions, but the issue persists."},
        {"sender_type": "officer", "text": "Thanks for trying. Let me check with my team for an alternative solution."},
        {"sender_type": "student", "text": "I appreciate your help."}
    ],
    [
        {"sender_type": "officer", "text": "The issue should now be resolved. Can you confirm?"},
        {"sender_type": "student", "text": "Yes, everything seems to be working fine now. Thank you!"},
        {"sender_type": "officer", "text": "Glad to hear that! Let us know if you need further assistance."}
    ],
]

 
