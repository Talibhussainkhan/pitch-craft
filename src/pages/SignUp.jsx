import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../config/firebase";
import { useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {

const [formData, setFormData] = useState({
    username : '',
    email : '',
    password : ''
});

const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    
    const auth = getAuth(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: formData.username
        });
        toast.success('Sign up Successfully');
        navigate('/login')
    } catch (error) {
        const errorMessage = error.message;
        toast.error(errorMessage)
       
    }
  };

  const handleChange = (e) =>{
    setFormData({
        ...formData,
        [e.target.id] : e.target.value
    })
  }
  

  return (
    <div className="min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-7rem)] flex items-center justify-center">
      <form
        onSubmit={registerUser}
        className="bg-white text-gray-500 w-full max-w-[340px] mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign Up
        </h2>

        <input
          id="username"
          className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e)=>handleChange(e)}
          required
        />
        <input
          id="email"
          className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          id="password"
          className="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className="w-full mb-3 bg-black  transition-all active:scale-95 py-2.5 rounded text-white font-medium">
          Create Account
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-black underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
