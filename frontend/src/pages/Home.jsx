import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import Workflow from '../components/landing/Workflow';
import Navbar from '../components/landing/Navbar';

const Home = () => {
	return (
		<>
			<Navbar />
			<div className="max-w-7xl mx-auto">
				<HeroSection />
				<FeatureSection />
				<Workflow />
			</div>
			<Footer />
		</>
	);
};

export default Home;

const Footer = () => {
	return (
		<footer className="bg-customGray-dark text-customGray-light text-center py-5 drop-shadow-[0_-5px_8px_rgba(0,0,0,0.1)]">
			Software Engineering Group Project (2024/25) - Major Group Project
		</footer>
	);
};
