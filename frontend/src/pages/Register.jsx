import React from "react";
import RegisterForm from "../components/RegisterForm";

/**
 * @component
 * Register - A page component displaying the RegisterForm within a styled container.
 *
 * @returns {JSX.Element}
 */

const Register = () => {
  return (
    <div className='bg-white w-[40vw] rounded-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex-col justify-start items-center p-10' data-testid="register-component">
      <RegisterForm />
    </div>
  );
};

export default Register;
