import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import api from '../api';
import GenericForm from './GenericForm';
import GenericInput from './GenericInput';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
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
		} catch (err) {
			// setError(
			// 	err.response?.data?.message || 'Login failed. Please try again.'
			// );
			toast.error(err.response?.data?.message || 'Login failed. Please try again.')
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

				{/* {error && <p className="text-red-500">{error}</p>} */}
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
