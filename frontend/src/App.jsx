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
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Layout>
		</>
	);
}

export default App;
