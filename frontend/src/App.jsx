import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'sonner';

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
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Toaster richColors position="bottom-center" />
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route path="/register" element={<RegisterAndLogout />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
}

export default App;
