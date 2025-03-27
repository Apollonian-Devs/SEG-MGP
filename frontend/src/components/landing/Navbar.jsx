import React from 'react';
import logoBlack from '../../assets/logo-black.png';

/**
 * @component
 * Navbar - The top navigation bar for the site, showcasing the logo, quick links, and login/register call-to-action buttons.
 *
 * @returns {JSX.Element}
 */

const Navbar = () => {
	return (
		<nav className="sticky top-0 z-50 py-3 px-4 bg-customOrange-dark shadow-lg">
			<div className="flex justify-between items-center max-w-7xl mx-auto">
				<div>
					<a href="/" className="flex items-center flex-shrink-0">
						<img className="h-10 w-10 mr-2" src={logoBlack} alt="Logo" />
						<span className="text-xl tracking-tight">Apollonian Devs</span>
					</a>
				</div>
				<div className='flex items-center justify-between space-x-6 max-sm:hidden text-gray-700 font-normal underline underline-offset-4'> 
					<a href="/departments" className='hover:text-customOrange-light transition-colors duration-500'>Departments</a>
					<a href="/helpfaq" className='hover:text-customOrange-light transition-colors duration-500'>Help & FAQs</a>
					<a href="/aboutus" className='hover:text-customOrange-light transition-colors duration-500'>About Us</a>
				</div>
				<div className="flex justify-center space-x-12 items-center">
					<a
						href="/login"
						className="py-2 px-3 border-2 border-gray-900 rounded-md bg-customOrange-light font-medium hover:bg-customOrange-dark/80  transition-colors duration-500"
					>
						Log In
					</a>
					<a
						href="/register"
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
