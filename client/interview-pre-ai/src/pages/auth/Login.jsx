import React, { useContext } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/input'; 
import{ validataEmail} from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';

const login = ({setcurrentPage}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {updateUser}=useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    if(!validataEmail(email))
    {
      setError("Please enter a valid email address. ");
      return ;
    }
    if(!password)
    {
      setError("Please enter the password");
      return;
    }
    setError("");
    //Login api call
    try{
      const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
      });
      console.log("hello")
      const {token}=response.data;
      if(token)
      {
        localStorage.setItem("token",token);
        updateUser(response.data);
        navigate("/dashboard");
      }


    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      } else {
         setError("Something went wrong. Please try again");
      }
    }

  };

  return(
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-2xl font-semibold text-black'>Welcome Back</h3>
      <p className='text-1xl text-slate-700 mt-[5px] mb-6'>Please enter your details to login</p>
        <form onSubmit={handleLogin}>
        <Input  value={email} onChange={({target})=>setEmail(target.value)} label="Email Address" placeholder='john@exaple.com' type='text'/>
        
        <Input value={password} onChange={({target})=> setPassword(target.value)} label="Password" placeholder='Min 8 Character ' type='password' />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary hover:none p-2 rounded-xl mt-[10px]'>LOGIN</button>
        <p className='text-[13px] text-slate-800 mt-3'>
          Don't hava an account? {''}
          <button className='font-medium  text-orange-400' onClick={()=>setcurrentPage("signup")}>SignUp</button>
        </p>
      </form>

    </div>

  ) 
   
  
}

export default login;
