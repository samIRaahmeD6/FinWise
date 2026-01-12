
import Logo from '../assets/finlogo.png'
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const[isError, setError] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();

    const {email,password} = formData;

    try{
      const res = await fetch("http://localhost:3000/api/login",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if(!res.ok){
        const errorMsg = await res.text();
        throw new Error(errorMsg || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("user_id", data.user.user_id);

// Optionally store full user object
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      navigate("/mainpage");

    }catch(err){
      console.error("Login error:", err);
      setError(err.message);
    }
  }

  return (
    <div className="w-screen h-screen bg-[#FFF8D4] flex justify-center items-center">
      {isError && (
        <div className="absolute top-4 right-4 bg-[#313647] text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          {isError}
        </div>
      )}
     <div className="relative
  h-96 w-96 bg-[#313647] flex rounded-full flex-col justify-center
  shadow-2xl shadow-black/40
  before:content-['']
  before:absolute before:top-0 before:left-0
  before:w-full before:h-1/2
  before:bg-white/10
  before:blur-2xl
  before:opacity-60
  before:rounded-full
  before:pointer-events-none">
      <form action="" onSubmit={handleSubmit} className="py-2 flex flex-col justify-center text-center place-items-center  mt-28">
        <div className='w-10 h-10 rounded-full'><img className='rounded-full' src={Logo} alt="" /></div>
         <h1 className="text-[#FFFFFF] mb-8 text-lg">Login</h1>
         <div className="relative mx-8 my-2">
         
  <input
    type="email"
    name="email"
    placeholder="Email"
    onChange={handleChange}
    value={formData.email}
    className="bg-[#435663] w-80 py-2 pl-10 pr-2 text-[#FFF8D4] rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A3B087]"
  />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-[#FFF8D4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.913l-7.5 4.5a2.25 2.25 0 01-2.31 0l-7.5-4.5a2.25 2.25 0 01-1.07-1.913V6.75"
    />
  </svg>
</div>

          <div className="relative mx-8 my-2">
  <input
    type="password"
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    className="bg-[#435663] w-80 py-2 pl-10 pr-2 text-[#FFF8D4] rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A3B087]"
  />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-[#FFF8D4] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3h9zm-9 0a6 6 0 0112 0v6.75a2.25 2.25 0 01-2.25 2.25h-7.5A2.25 2.25 0 016 17.25V10.5z"
    />
  </svg>
</div>
  <div className="flex self-start ml-8"><p className="text-[#FFFFFF] font-thin text-sm">Not registered yet?</p> <Link to="/register" className="text-[#FFFFFF] text-sm font-thin">Sign Up</Link></div>

          <div className="flex justify-end w-full pr-0">
  <button type="submit" className="bg-gradient-to-br from-[#A3B087] to-[#8F9E72] shadow-lg shadow-black/30
    hover:brightness-110
    transition-all duration-300 h-40 w-40 rounded-full mt-4 text-[#313647]">Login</button>
</div>
          
      </form>
     </div>
    </div>
  )
}

export default Login