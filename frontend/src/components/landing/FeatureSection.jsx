import {
	Mail,
	CalendarCheck2,
	ListChecks,
	Search,
	Users2,
	HelpCircle,
} from 'lucide-react';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const features = [
	{
		icon: <Mail />,
		text: 'Ticket Submission',
		description:
			'Easily submit your support tickets with detailed descriptions and attachments.',
	},
	{
		icon: <CalendarCheck2 />,
		text: 'Ticket Tracking',
		description:
			'Track the status of your tickets and receive updates on their progress in real-time.',
	},
	{
		icon: <ListChecks />,
		text: 'Knowledge Base',
		description:
			'Access a comprehensive knowledge base with FAQs and guides to find quick solutions.',
	},
	{
		icon: <Search />,
		text: 'Search Functionality',
		description:
			'Quickly search for existing tickets or knowledge base articles to find relevant information.',
	},
	{
		icon: <Users2 />,
		text: 'Department Routing',
		description:
			'Tickets are automatically routed to the appropriate department or support team for faster resolution.',
	},
	{
		icon: <HelpCircle />,
		text: 'Help Desk Integration',
		description:
			'Seamlessly integrate with the university’s help desk for a unified support experience.',
	},
];

const FeatureSection = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true }); // Trigger once when in view

	return (
		<motion.div
			ref={ref}
			className="relative h-screen"
			initial={{ opacity: 0 }}
			animate={isInView ? { opacity: 1 } : { opacity: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className="text-center">
				<motion.span
					className="bg-neutral-900 text-customOrange-dark rounded-full h-6 text-xl font-medium px-4 py-3 uppercase"
					initial={{ y: -20, opacity: 0 }}
					animate={isInView ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
					transition={{ duration: 0.6 }}
				>
					Features
				</motion.span>
				<motion.h1
					className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide mt-10"
					initial={{ y: 20, opacity: 0 }}
					animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					Simplify Student Support with <br />
					<span className="bg-gradient-to-r from-customOrange-dark to-slate-700 text-transparent bg-clip-text">
						Our Ticket System
					</span>
				</motion.h1>
			</div>
			<motion.div
				className="flex flex-wrap mt-10 lg:mt-20"
				initial={{ opacity: 0 }}
				animate={isInView ? { opacity: 1 } : { opacity: 0 }}
				transition={{ duration: 0.8, delay: 0.6 }}
			>
				{features.map((feature, index) => (
					<motion.div
						key={index}
						className="w-full sm:w-1/2 lg:w-1/3 p-5"
						initial={{ y: 20, opacity: 0 }}
						animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
						transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
					>
						<div className="flex">
							<div className="flex mx-6 h-10 w-10 p-2 bg-neutral-900 text-customOrange-dark justify-center items-center rounded-full">
								{feature.icon}
							</div>
							<div className="flex flex-col gap-5">
								<h5 className="text-xl font-medium">{feature.text}</h5>
								<p className="text-md text-gray-700">{feature.description}</p>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	);
};

export default FeatureSection;
