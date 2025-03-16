import React from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
	const location = useLocation();
	const isHomePage = location.pathname === '/';

	const bodyStyle = {
		background: 'linear-gradient(to right, #ecbc76 50%, #fffef9 50%)',
		minHeight: '100vh',
		margin: '0',
		paddingTop: '40px',
		paddingBottom: '40px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	return (
		<div
			style={isHomePage ? { background: '#ecbc76', margin: '0' } : bodyStyle}
		>
			{children}
		</div>
	);
};

export default Layout;
