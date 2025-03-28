import React from 'react';
import gif1 from '../../assets/feel-me-think-about-it.gif';
import gif2 from '../../assets/coding.gif';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

/**
 * @component
 * HeroSection - The main hero banner of the landing page showcasing core project information and navigation links.
 *
 * @returns {JSX.Element}
 */

const HeroSection = () => {
	return (
		<motion.div
			className="flex flex-col items-center h-screen justify-center px-5"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
		>
			<h1 className="text-4xl sm:text-7xl lg:text-8xl text-center tracking-wide">
				Student Support Hub: <br />
				<span className="bg-gradient-to-r from-customOrange-dark to-slate-700 text-transparent bg-clip-text">
					Apollonian Devs
				</span>
			</h1>
			<p className="mt-10 text-lg text-center text-black max-w-4xl">
				Streamline your support requests and get timely assistance with our
				easy-to-use ticket system. Submit, track, and resolve your issues
				efficiently, so you can focus on your studies.
			</p>
			<motion.div
				className="flex justify-center my-10 gap-10"
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.3 }}
			>
				<motion.a
					href="/dashboard"
					className="py-2 px-3 border-2 border-gray-900 rounded-md bg-customOrange-light font-medium hover:bg-customOrange-dark/80 transition-colors duration-500 items-center flex"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					whileHover={{ scale: 1.1 }}
				>
					Submit a Ticket
				</motion.a>
				<motion.a
					href="/helpfaq"
					className="py-2 px-3 border-2 border-gray-900 rounded-md bg-customGray-light font-medium hover:bg-customGray-dark/80 transition-colors duration-500 items-center flex"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					whileHover={{ scale: 1.1 }}
				>
					Help & FAQs
				</motion.a>
				<motion.a
					href="https://github.com/Lluc4s/SEG-MGP"
					target="_blank"
					rel="noopener noreferrer"
					className="py-2 px-3 border-2 border-gray-900 rounded-md bg-neutral-300 font-medium hover:bg-neutral-400/70 transition-colors duration-500 items-center flex gap-2"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					whileHover={{ scale: 1.1 }}
				>
					<FontAwesomeIcon icon={faGithub} className="h-6 w-6" />
					<p className="max-sm:hidden block">Github Repository</p>
				</motion.a>
			</motion.div>
			<motion.div
				className="flex justify-center"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.7, delay: 0.6 }}
			>
				<img
					src={gif1}
					alt="GIF 1"
					className="rounded-lg w-1/2 border-4 border-black shadow-lg mx-2 my-4 max-h-[300px]"
				/>
				<img
					src={gif2}
					alt="GIF 2"
					className="rounded-lg w-1/2 border-4 border-black shadow-lg mx-2 my-4 max-h-[300px]"
				/>
			</motion.div>
		</motion.div>
	);
};

export default HeroSection;
