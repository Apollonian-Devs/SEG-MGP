import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import GenericButton from "./GenericButton";
import GenericForm from "./GenericForm";
import GenericInput from "./GenericInput";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await api.post("/api/user/register/", {
        username,
        first_name,
        last_name,
        email,
        password,
        is_staff: false,
        is_superuser: false,
      });

      if (response.status === 201) {
        alert("Registration successful. Please login to continue.");
        navigate("/");
      }
    } catch (err) {
      alert("Username or email is already registered. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className='text-left mb-10'>Register</h1>
      <GenericForm className='space-y-3' onSubmit={handleSubmit}>
        
          {/* <label htmlFor='username' className='flex text-sm text-left font-medium text-black'>
            Username
          </label>
          <div className='mt-2'>
            <input
              type='username'
              name='username'
              id='username'
              autoComplete='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder='Enter your username'
              className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm'
            />
          </div> */}
        
          <GenericInput
            label="Username"
            type="text"
            required={true}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          ></GenericInput>
        
          {/* <label htmlFor='first_name' className='flex text-sm text-left font-medium text-black'>
            First Name
          </label>
          <div className='mt-2'>
            <input
              type='first_name'
              name='first_name'
              id='first_name'
              autoComplete='first_name'
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
              required
              placeholder='Enter your first name'
              className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm'
            />
          </div> */}
        
        <GenericInput
          label="First Name"
          type="text"
          required={true}
          onChange={(e) => setFirst_name(e.target.value)}
          placeholder="Enter your first name"
        ></GenericInput>

          {/* <label htmlFor='last_name' className='flex text-sm text-left font-medium text-black'>
            Last Name
          </label>
          <div className='mt-2'>
            <input
              type='last_name'
              name='last_name'
              id='last_name'
              autoComplete='last_name'
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
              required
              placeholder='Enter your last name'
              className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm'
            />
          </div> */}
        
        <GenericInput
          label="Last Name"
          type="text"
          required={true}
          onChange={(e) => setLast_name(e.target.value)}
          placeholder="Enter your last name"
        ></GenericInput>
      
        
          {/* <label htmlFor='email' className='flex text-sm text-left font-medium text-black'>
            Email
          </label>
          <div className='mt-2'>
            <input
              type='email'
              name='email'
              id='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Enter your email'
              className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm'
            />
          </div> */}
        
        <GenericInput
          label="Email"
          type="text"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        ></GenericInput>

        
          {/* <label htmlFor='password' className='block text-sm font-medium text-black'>
            Password
          </label>
          <div className='mt-2'>
            <input
              type='password'
              name='password'
              id='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter your password'
              className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm'
            />
          </div> */}
        
        <GenericInput
          label="Password"
          type="text"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        ></GenericInput>

        {loading && <h1>Loading...</h1>}
        <div>
        <GenericButton
          type="submit"
          className="flex w-full justify-center rounded-md bg-customOrange-dark mt-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customOrange-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customOrange-dark"
        >
          Register
        </GenericButton>
        </div>
      </GenericForm>
    </>
  );
};

export default RegisterForm;
