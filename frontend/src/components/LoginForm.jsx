import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className='text-left mb-10'>Sign in</h1>
      <form className='space-y-3' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username' className='flex text-sm text-left font-medium text-black'>
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
              className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm'
            />
          </div>
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <label htmlFor='password' className='block text-sm font-medium text-black'>
              Password
            </label>
            <a href='#' className='text-xs text-customOrange-dark hover:text-customOrange-light'>
              Forgot password?
            </a>
          </div>
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
          </div>
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        <div>
          <button
            type='submit'
            className='flex w-full justify-center rounded-md bg-customOrange-dark mt-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customOrange-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customOrange-dark'
          >
            Sign in
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
