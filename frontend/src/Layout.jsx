import React from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

/**
 * @component
 * Layout - A wrapper component that provides consistent styling and positioning
 * for child components. It also conditionally adjusts its background for the home page.
 *
 * @props
 * - children (React.ReactNode): The content to be rendered within the layout.
 *
 * @returns {JSX.Element}
 */

const Layout = ({ children }) => {
	const location = useLocation();
	const isHomePage = location.pathname === '/';

	const bodyStyle = {
		background: 'linear-gradient(to right, #ecbc76 50%, #fffef9 50%)',
		minHeight: '100vh',
		margin: '0',
		paddingTop: '40px',
		paddingBottom: '40px',
		paddingLeft: '40px',
		paddingRight: '40px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	return (
		<>
		<Toaster richColors position="bottom-center" />
		<div
			style={isHomePage ? { background: '#ecbc76', margin: '0' } : bodyStyle}
			data-testid="layout-container"
		>
			{children}
		</div>
		</>
	);
};

export default Layout;
