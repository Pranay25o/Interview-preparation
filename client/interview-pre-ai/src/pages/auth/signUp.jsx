import React, { useContext } from 'react';
import { useState } from 'react';
import Input from '../../components/inputs/input'; 
import { useNavigate } from 'react-router-dom';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import { validataEmail } from '../../utils/helper';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import uploadImage from '../../utils/uploadImage'
const signup = ({setcurrentPage}) => {
    const [profilePicture, setProfilePicture] = useState(null); 
    const[fullName, setFullName] = useState("");  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const {updateUser}=useContext(UserContext);

    const navigate = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        let profileImageUrl="";
        if(!fullName)
        {
          setError("Please enter full name");
          return ;
        }
        if(!validataEmail(email))
        {
          setError("Please enter a valid email addres");
          return ;
        }
        if(!password)
        {
          setError("Please enter a password");
          return ;
        }
        setError('');

         //Login api call                                                             
      try{
        if(profilePicture)
        {
          const imgUploadRes=await uploadImage(profilePicture);
          profileImageUrl=imgUploadRes.imageUrl ||"";
        }
          const response= await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
            name:fullName,
            email,
            password,
            profileImageUrl,
          });

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
   
  return (  
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create your Account</h3>
      <p className='text-0.5xl text-slate-700 mt-[15px] mb-6'>Join us today entering your detail below.</p>
      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePicture} setImage={setProfilePicture} />
        <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
          <Input value={fullName} onChange={({target})=>setFullName(target.value)} label="Full Name" placeholder='John' type="text"  />
          <Input value={email} onChange={({target})=>setEmail(target.value)} label="Email" placeholder="john@example.com" type="text"  />
          <Input value={password} onChange={({target})=>setPassword(target.value)} label="Password" placeholder="Min 8 Character" type="password"  />
        </div>
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary hover:none p-2 rounded-xl mt-[10px]'>SIGN UP</button>
        <p className='text-[13px] text-slate-800 mt-3'>
          Already have an account? {''}
          <button className='font-medium  text-orange-400' onClick={()=>setcurrentPage("login")}>Login</button>
        </p>
      </form>
    </div>
  )
}

export default signup
