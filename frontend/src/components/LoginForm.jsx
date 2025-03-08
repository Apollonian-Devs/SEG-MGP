import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import api from '../api';
import GenericForm from './GenericForm';
import GenericInput from './GenericInput';

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault(); // Prevent the default form submission

		try {
			const response = await api.post('/api/token/', { username, password });
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

			if (response.status === 200) {
				navigate('/dashboard');
			}
		} catch (err) {
			setError(
				err.response?.data?.message || 'Login failed. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

  //need to put test-id on the form of login-form
  return (
    <>
      <h1 className='text-left mb-10'>Sign in</h1>
      <GenericForm className='space-y-3' onSubmit={handleSubmit} buttonLabel="Sign in" data-testid="login-form">

          <GenericInput
            id="username"
            label="Username"
            type="text"
            required={true}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          ></GenericInput>

          <GenericInput
            id="password"
            label="Password"
            labelClass="block text-sm font-medium text-black"
            type="password"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your username"
          ></GenericInput>
          
        {error && <p className='text-red-500'>{error}</p>}
        
      </GenericForm>
    </>
  );
};

export default LoginForm;
