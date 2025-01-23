import React from "react";
import LoginForm from "../components/LoginForm";

const Home = () => {
  return (
    <div className='bg-white w-[40vw] rounded-lg drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex-col justify-start items-center p-10'>
      <div className='flex justify-between p-0 m-0'>
        <p>Welcome to Name</p>
        <div className='leading-none'>
          <p className='text-xs text-customGray-dark'>No Account?</p>
          <a
            href='/register'
            className='text-xs text-customOrange-dark hover:text-customOrange-light'
          >
            Register
          </a>
        </div>
      </div>
      <LoginForm />
    </div>
  );
};

export default Home;
