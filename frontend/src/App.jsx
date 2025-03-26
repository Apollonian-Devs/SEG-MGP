import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import HelpQA from './pages/HelpQ&A';
import NotFound from './pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import Departments from './pages/Departments';
import AboutUs from './pages/AboutUs';

/**
 * App - The main application component that defines all routes and layout.
 *
 * @component
 *
 * @routes
 * - `/` - Home page.
 * - `/dashboard` - Protected route for the user dashboard (requires authentication).
 * - `/login` - Login page.
 * - `/register` - Registration page (clears local storage before rendering).
 * - `/logout` - Clears local storage and redirects to home.
 * - `/helpfaq` - Help and FAQ page.
 * - `/departments` - Departments page.
 * - `/aboutus` - About Us page.
 * - `*` - Catch-all route for 404 Not Found.
 *
 * @returns {JSX.Element}
 */


function Logout() {
	localStorage.clear();
	return <Navigate to="/" />;
}

function RegisterAndLogout() {
	localStorage.clear();
	return <Register />;
}

function App() {
	return (
		<>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<RegisterAndLogout />} />
					<Route path="/logout" element={<Logout />} />
					<Route path="/helpfaq" element={<HelpQA />} />
					<Route path = "/departments" element={<Departments />} />
					<Route path = "/aboutus" element={<AboutUs />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Layout>
		</>
	);
}

export default App;
