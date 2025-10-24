import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/firebase";
import toast from "react-hot-toast";


const Login = () => {
    const [formData, setFormData] = useState({
        email : '',
        password : ''
    });
    const navigate = useNavigate();
    const handleChange = (e) =>{
    setFormData({
        ...formData,
        [e.target.id] : e.target.value
    })
  }
 const handleSumbit = async (e) =>{
  e.preventDefault();
  const auth = getAuth(app);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    const user = userCredential.user;
    navigate('/');
    toast.success('Logged In')
  } catch (error) {
    const errorMessage = error.message;
    toast.error(errorMessage)
  }


 }


  return (
    <div
      className="min-h-[calc(100vh-5rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-7rem)] flex items-center justify-center"
    >
      <form onSubmit={handleSumbit} className="bg-white text-gray-500 w-full max-w-[340px] mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        
            <input value={formData.email} onChange={handleChange} id="email" className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3" type="email" placeholder="Email" required />
            <input value={formData.password} onChange={handleChange} id="password" className="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3" type="password" placeholder="Password" required />
        
            <button className="w-full mb-3 bg-black transition-all active:scale-95 py-2.5 rounded text-white font-medium">Login</button>
            
            <p className="text-center mt-4">Don't have an account? <Link to="/signup" className="text-black underline">Sign up</Link></p>
        </form>
      
    </div>
  );
};

export default Login;
