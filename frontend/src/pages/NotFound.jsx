import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.3 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.3 }}
			whileHover={{ scale: 1.1 }}
			transition={{ duration: 0.8 }}
			className="flex flex-col items-center justify-center gap-2 h-[30vh] w-[80vh] bg-white shadow-lg rounded-3xl"
		>
			<h1 className="text-3xl md:text-9xl font-bold text-red-500">404</h1>
			<h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
				Page Not Found
			</h2>
			<p className="text-lg md:text-xl text-gray-400">
				The page you're looking for doesn't exist.
			</p>
			<motion.div
				whileHover={{ scale: 1.3 }}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				className="flex flex-col items-center gap-2 mt-2"
			>
				<Link
					to="/"
					className="bg-customOrange-dark hover:bg-customOrange-light text-white hover:text-gray-800 font-semibold py-2 px-4 rounded-full transition-colors duration-300"
				>
					Go Home
				</Link>
			</motion.div>
		</motion.div>
	);
};

export default NotFound;
