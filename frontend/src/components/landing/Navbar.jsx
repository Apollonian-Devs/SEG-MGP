import React from 'react';
import logoBlack from '../../assets/logo-black.png';

const Navbar = () => {
	return (
		<nav className="sticky top-0 z-50 py-3 px-4 bg-customOrange-dark shadow-lg">
			<div className="flex justify-between items-center max-w-7xl mx-auto">
				<div className="flex items-center flex-shrink-0">
					<img className="h-10 w-10 mr-2" src={logoBlack} alt="Logo" />
					<span className="text-xl tracking-tight">Apollonian Devs</span>
				</div>
				<div className="flex justify-center space-x-12 items-center">
					<a
						href="#"
						className="py-2 px-3 border-2 border-gray-900 rounded-md bg-customOrange-light font-medium hover:bg-customOrange-dark/80  transition-colors duration-500"
					>
						Log In
					</a>
					<a
						href="#"
						className="py-2 px-3 border-2 border-gray-900 rounded-md bg-customGray-light font-medium hover:bg-customGray-dark/80 transition-colors duration-500"
					>
						Create an account
					</a>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
