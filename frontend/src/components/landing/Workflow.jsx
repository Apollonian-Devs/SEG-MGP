import { CheckCircle2 } from 'lucide-react';
import question from '../../assets/question.png';
import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';

export const checklistItems = [
	{
		title: 'Easy Ticket Submission',
		description:
			'Submit support tickets with clear descriptions and necessary attachments.',
	},
	{
		title: 'Real-Time Ticket Tracking',
		description:
			'Monitor the progress of your tickets and receive timely updates.',
	},
	{
		title: 'Quick Access to Knowledge Base',
		description:
			'Find answers to common questions and solutions in our comprehensive knowledge base.',
	},
	{
		title: 'Direct Department Routing',
		description:
			'Ensure your tickets reach the right support team for faster resolution.',
	},
];

const Workflow = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });

	return (
		<motion.div
			ref={ref}
			className="h-screen flex flex-col justify-center"
			initial={{ opacity: 0 }}
			animate={isInView ? { opacity: 1 } : { opacity: 0 }}
			transition={{ duration: 0.8 }}
		>
			<motion.h1
				className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide mb-10"
				initial={{ y: -20, opacity: 0 }}
				animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
				transition={{ duration: 0.6 }}
			>
				Streamline your
				<br />
				<span className="bg-gradient-to-r from-customOrange-dark to-slate-700 text-transparent bg-clip-text">
					support requests.
				</span>
			</motion.h1>
			<div className="flex justify-center items-center p-3 space-x-4">
				<motion.div
					className="max-sm:hidden block p-2 w-1/2"
					initial={{ x: -50, opacity: 0 }}
					animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
					transition={{ duration: 0.7, delay: 0.2 }}
				>
					<img src={question} alt="Ticketing System" />
				</motion.div>
				<motion.div
					className="max-sm:w-full w-1/2 h-full flex flex-col justify-between"
					initial={{ x: 50, opacity: 0 }}
					animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
					transition={{ duration: 0.8, delay: 1.0 }}
				>
					{checklistItems.map((item, index) => (
						<motion.div
							key={index}
							className="flex gap-4 items-center"
							initial={{ y: 20, opacity: 0 }}
							animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
							transition={{ duration: 0.6, delay: 1.0 + index * 0.2 }}
						>
							<div className="text-customOrange-dark bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
								<CheckCircle2 />
							</div>
							<div className="flex flex-col gap-2">
								<h5 className="mt-1 text-xl">{item.title}</h5>
								<p className="text-md text-gray-700">{item.description}</p>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</motion.div>
	);
};

export default Workflow;
