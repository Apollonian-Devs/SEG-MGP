import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import api from '../api';
import {GenericForm} from '.';
import {GenericInput} from '.';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import handleApiError from "../utils/errorHandler";

/**
 * @component
 * LoginForm - A user login form component.
 *
 * @state
 * - username (string): Stores the user's inputted username.
 * - password (string): Stores the user's inputted password.
 * - error (string | null): Stores error messages if login fails.
 * - isLoading (boolean): Tracks the loading state during form submission.
 *
 * @methods
 * - handleSubmit(): Handles form submission, authenticates the user, and stores tokens.
 *
 * @effects
 * - Redirects the user to the dashboard if already logged in.
 *
 * @returns {JSX.Element}
 */


const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevent the default form submission
		setLoading(true);
		try {
			const response = await api.post('/api/token/', { username, password });
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

			if (response.status === 200) {
				navigate('/dashboard');
				setUsername('');
				toast.success("Successful Login. Welcome to your homepage.")
			}
		} catch (error) {
			handleApiError(error, "Login failed. Please try again.");
		} finally {
			setPassword('');
			setLoading(false);
		}
	};

	// Automatically redirect to the dashboard if the user is already logged in
	useEffect(() => {
		if (localStorage.getItem(ACCESS_TOKEN)) {
			navigate('/dashboard');
		}
	}, []);

	return (
		<>
			<h1 className="text-left mb-10">Sign in</h1>
			<GenericForm
				className="space-y-3"
				onSubmit={handleSubmit}
				buttonLabel="Sign in"
				data-testid="login-form"
			>
				<GenericInput
					id="username"
					label="Username"
					type="text"
					required={true}
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Enter your username"
				/>

				<GenericInput
					id="password"
					label="Password"
					labelClass="block text-sm font-medium text-black"
					type="password"
					required={true}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Enter your password"
				/>

				{isLoading && (
					<div className="flex w-full items-center justify-center space-x-2">
						<Loader size={20} className="animate-spin" />
						<span>Loading...</span>
					</div>
				)}
			</GenericForm>
		</>
	);
};

export default LoginForm;
