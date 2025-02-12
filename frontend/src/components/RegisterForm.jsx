import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
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
      <GenericForm className='space-y-3' onSubmit={handleSubmit} buttonLabel="Register">
        
         

          <GenericInput
            label="Username"
            type="text"
            required={true}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          ></GenericInput>
        
         
        
        <GenericInput
          label="First Name"
          type="text"
          required={true}
          onChange={(e) => setFirst_name(e.target.value)}
          placeholder="Enter your first name"
        ></GenericInput>

         
        
        <GenericInput
          label="Last Name"
          type="text"
          required={true}
          onChange={(e) => setLast_name(e.target.value)}
          placeholder="Enter your last name"
        ></GenericInput>
      
        
        
        
        <GenericInput
          label="Email"
          type="text"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        ></GenericInput>
        
        <GenericInput
          label="Password"
          type="text"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        ></GenericInput>

        {loading && <h1>Loading...</h1>}
        
        {/* <div>
        <GenericButton
          type="submit"
          className="flex w-full justify-center rounded-md bg-customOrange-dark mt-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customOrange-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customOrange-dark"
        >
          Register
        </GenericButton>
        </div> */}
      </GenericForm>
    </>
  );
};

export default RegisterForm;