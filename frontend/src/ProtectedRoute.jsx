import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import api from './api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from './constants';
import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

/**
 * @component
 * ProtectedRoute - A higher-order component (HOC) that protects routes by verifying user tokens.
 *
 * @state
 * - isAuthorized (boolean|null): Indicates whether the user is authorized. `null` denotes an unresolved state (loading).
 *
 * @methods
 * - refreshToken(): Attempts to renew the access token using the stored refresh token.
 * - auth(): Verifies the validity of the current access token or requests a new one if expired.
 *
 * @props
 * - children (React.ReactNode): The protected component(s) to render upon successful authorization.
 *
 * @effects
 * - Fetches the user's access token and verifies its validity.
 *
 * @returns {JSX.Element}
 */

function ProtectedRoute({ children }) {
	const [isAuthorized, setIsAuthorized] = useState(null);

	useEffect(() => {
		auth().catch(() => setIsAuthorized(false));
	}, []);

	const refreshToken = async () => {
		const refreshToken = localStorage.getItem(REFRESH_TOKEN);
		try {
			const res = await api.post('/api/token/refresh/', {
				refresh: refreshToken,
			});
			if (res.status === 200) {
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				setIsAuthorized(true);
			} else {
				setIsAuthorized(false);
			}
		} catch (error) {
			toast.error('Error refreshing token', { description: error.message });
			setIsAuthorized(false);
			localStorage.clear(); // Clear all tokens
		}
	};

	const auth = async () => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (!token) {
			setIsAuthorized(false);
			return;
		}
		const decoded = jwtDecode(token);
		const tokenExpiration = decoded.exp;
		const now = Date.now() / 1000;

		if (tokenExpiration < now) {
			await refreshToken();
		} else {
			setIsAuthorized(true);
		}
	};

	if (isAuthorized === null) {
		return (
			<div className="flex items-center justify-center p-5 bg-white shadow-lg rounded-lg gap-5">
				<Loader size={20} className="animate-spin" />
				Authorising...
			</div>
		);
	}

	return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
