import React, { useState, useEffect,useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import toast from "react-hot-toast";
import signupanimation from '../Images/Signup.json'; // Ensure this path is correct
import Lottie from 'lottie-react';
const Signup = () => {
   const navigate = useNavigate(); 
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",

  });
 
  const[error,setError]=useState(null)
  const[errors,setErrors]=useState([])

  const [passwordVisible, setPasswordVisible] = useState(false);
 
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
const validateForm = (formData) => {
    let newErrors = {};
  
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key]);
    });
  console.log(newErrors)
    setErrors(newErrors);
  
    // Return if there are no errors
    return Object.values(newErrors).every((err) => err === "");
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "username":
        if (!value.trim()) errorMessage = "Username is required";
        break;

      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) errorMessage = "Invalid Email ";
        break;

      case "password":
        if (value.length < 6) errorMessage = "Password must have at least 6 caracters";
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: validateField(name, value) });
    }

  

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Send the complete data
      });
      const data = await response.json(); // ⬅️ Parse the actual body
      console.log(data.success)
if (data.success)
      {
       
        toast.success("Utilisateur enregistré avec succès", {
          closeOnClick: true,
          autoClose: 3000,
        });
        navigate("/Login");
      }
else{
  setError("Email is already used")
}   
  
    } catch (error) {
      setError("Error during signup: " + error)
    }
  };
  
  const showError = () => {
    toast.error(error, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
    });
  };
  useEffect(() => {
    if (error) {
      showError();
      setError(null);
    }
  }, [error]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-10/12 gap-10 flex justify-around items-center">
      
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col gap-7">
           <div>
            <h2 className="text-3xl font-bold text-center text-gray-800">Get Started Now</h2>
            <h2 className="text-base font-thin text-center text-gray-800">
              Welcome to Your TaskManager - Let's create your account.
            </h2>
          </div>
          <form className="flex flex-col gap-8  " onSubmit={handleSubmit}>      
                  
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full p-2 border-2 rounded-lg text-gray-700   focus:outline-none focus:ring-2  transition duration-300 peer ${errors.username ? " focus:border-red-200 focus:ring-red-200 border-red-300 " : "focus:border-blue-200 border-gray-300 focus:ring-blue-200"}`}
                                placeholder=" "
                                required
                              />
                              <label
                                htmlFor="username"
                                className={`absolute left-3   bg-white px-1 transition-all duration-300 pointer-events-none
                                  peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                                  peer-focus:-top-3 peer-focus:text-sm  ${errors.username ? "peer-focus:text-red-500 text-red-500 peer-placeholder-shown:text-red-500" : "peer-focus:text-blue-500 peer-placeholder-shown:text-gray-500 text-gray-500"}
                                  ${formData.username ? "-top-3 text-sm " : "top-2"}`}
                              >
                                UserName
                              </label>
                              {errors.username && <p className="text-red-500 text-xs fixed ml-2" >{errors.username}</p>}
                            </div>
                      
                        
                      

                          {/* Email */}
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className={`w-full p-2 border-2 rounded-lg text-gray-700   focus:outline-none focus:ring-2  transition duration-300 peer ${errors.email ? " focus:border-red-200 focus:ring-red-200 border-red-300 " : "focus:border-blue-200 border-gray-300 focus:ring-blue-200"}`}
                              placeholder=" "
                              required
                            />
                            <label
                              htmlFor="email"
                              className={`absolute left-3   bg-white px-1 transition-all duration-300 pointer-events-none
                                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                                peer-focus:-top-3 peer-focus:text-sm  ${errors.email ? "peer-focus:text-red-500 text-red-500 peer-placeholder-shown:text-red-500" : "peer-focus:text-blue-500 peer-placeholder-shown:text-gray-500 text-gray-500"}
                                ${formData.email ? "-top-3 text-sm " : "top-2"}`}
                            >
                              Email
                            </label>
                            {errors.email && <p className="text-red-500 text-xs fixed ml-2" >{errors.email}</p>}
                          </div>

                          {/* Password */}
                          <div className="relative">
                            <input
                              type={passwordVisible ? "text" : "password"}
                              name="password"
                              id="password"
                              value={formData.password}
                              onChange={handleChange}
                              className={`w-full p-2 border-2 rounded-lg text-gray-700   focus:outline-none focus:ring-2  transition duration-300 peer ${errors.password ? " focus:border-red-200 focus:ring-red-200 border-red-300 " : "focus:border-blue-200 border-gray-300 focus:ring-blue-200"}`}
                              placeholder=" "
                              required
                            />
                            <label
                              htmlFor="password"
                              className={`absolute left-3   bg-white px-1 transition-all duration-300 pointer-events-none
                                peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                                peer-focus:-top-3 peer-focus:text-sm  ${errors.password ? "peer-focus:text-red-500 text-red-500 peer-placeholder-shown:text-red-500" : "peer-focus:text-blue-500 peer-placeholder-shown:text-gray-500 text-gray-500"}
                                ${formData.password ? "-top-3 text-sm " : "top-2"}`}
                            >
                              Password
                            </label>
                            {errors.password && <p className="text-red-500 text-xs fixed ml-2" >{errors.password}</p>}
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                              {passwordVisible ? <MdVisibility className="w-5 h-5" /> : <MdVisibilityOff className="w-5 h-5" />}
                            </button>
                          </div>
                           
              
            

           
                    <button
                      type="submit"
                      className={`w-38 bg-blue-300 text-white p-2 px-4 rounded 
                        hover:bg-blue-400
                       focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300`}
                     
                    >
                      Sign Up
                    </button>
              </form>     
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-700 hover:underline">
              Login
            </Link>
          </p>

        </div>

        <Lottie animationData={signupanimation} loop={true} className="hidden md:block md:w-2/5  " />

      </div>
    </div>
  );
};

export default Signup;