import React from 'react';
import LoginForm from '../components/LoginForm';
import logo from '../assets/logo.png';

const Login = () => {
	return (
		<div className="bg-white w-[40vw] min-w-[300px] max-w-2xl rounded-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex-col justify-start items-center p-10">
			<div className="flex justify-between p-0 m-0">
				<div className="flex items-center justify-center gap-2">
					<img className="h-10 w-10" src={logo} alt="Logo" />
					<h3 className="text-medium text-customOrange-dark">
						Apollonian Devs
					</h3>
				</div>
				<div className="leading-none">
					<p className="text-xs text-customGray-dark">No Account?</p>
					<a
						href="/register"
						className="text-xs text-customOrange-dark hover:text-customOrange-light"
					>
						Register
					</a>
				</div>
			</div>
			<LoginForm />
		</div>
	);
};

export default Login;
