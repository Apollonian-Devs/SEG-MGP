import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import GenericForm from './GenericForm';
import GenericInput from './GenericInput';

const RegisterForm = () => {
	const [username, setUsername] = useState('');
	const [first_name, setFirst_name] = useState('');
	const [last_name, setLast_name] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault(); // Prevent the default form submission

		try {
			const response = await api.post('/api/user/register/', {
				username,
				first_name,
				last_name,
				email,
				password,
				is_staff: false,
				is_superuser: false,
			});

			if (response.status === 201) {
				alert('Registration successful. Please login to continue.');
				navigate('/');
			}
		} catch (err) {
			alert('Username or email is already registered. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<h1 className="text-left mb-10">Register</h1>
			<GenericForm
				className="space-y-3"
				onSubmit={handleSubmit}
				buttonLabel="Register"
			>
				<GenericInput
					id="username"
					label="Username"
					type="text"
					required={true}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Enter your username"
				></GenericInput>

				<GenericInput
					id="first_name"
					label="First Name"
					type="text"
					required={true}
					onChange={(e) => setFirst_name(e.target.value)}
					placeholder="Enter your first name"
				></GenericInput>

				<GenericInput
					id="last_name"
					label="Last Name"
					type="text"
					required={true}
					onChange={(e) => setLast_name(e.target.value)}
					placeholder="Enter your last name"
				></GenericInput>

				<GenericInput
					id="email"
					label="Email"
					type="text"
					required={true}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Enter your email"
				></GenericInput>

				<GenericInput
					id="password"
					label="Password"
					type="text"
					required={true}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Enter your password"
				></GenericInput>

				{loading && <h1>Loading...</h1>}
			</GenericForm>
		</>
	);
};

export default RegisterForm;
