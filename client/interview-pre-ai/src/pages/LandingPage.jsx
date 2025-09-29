import React, { useContext } from 'react'

import HERO_IMAGE from '../assets/hero-image.png'
import {APP_FEATURES} from '../utils/data'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'; 
import Modal from '../components/loaders/modal';
import Login from './auth/Login';
import SignUp from './auth/signUp';
import { UserContext } from '../context/userContext';
import ProfileInfoCard from '../components/cards/ProfileInfoCard';


const LandingPage = () => {

  const {user}=useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setcurrentPage] = useState("login");

  const handleCTA=()=>{
    if(!user){
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };
  return (
    <>
     <div className='w-full h-min-full bg-[#FFFCEF] '>
      <div className="w-500px h-500px bg-amber-200/20 blur-65px absolute top-0 left-0 right-0"> 
        <div className='container mx-auto px-4 pt-6 pb-[200px] relative z-10'>
          {/* Header */}
          <header className='flex justify-between items-center mb-16'>
            <div className='text-xl text-black font-bold'>
              Interview Prep AI
            </div>
            { user? (<ProfileInfoCard />) : (
              <button className='bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer' onClick={()=>setOpenAuthModal(true)}>
              Login / Sign Up
            </button>)}
          </header>
          {/* hero content */}
          <div className='flex flex-col  md:flex-row item center '>  
            <div className='w-full md:w-1/2 pr-4 mb-8 mb-8 md:mb-0'>
              <div className='flex items-center justify-left mb-2 '>  
                <div className='flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border  border-amber-300'>
                  ✨ AI Powered
                </div>
              </div>
              <h1 className='text-5xl text-black font-medium mb-6 leading-tight '>
                Ace Interviews with <br /> <span className='text-transparent bg-clip-text bg-[radial-gradient(circle,#FF9324_0%,#FCD760)] bg-[lenght:200%_200%]  animate-text-shine font-semibold'>AI-Powered</span>{''} Learning 
              </h1>
            </div>
            <div className='w-full md:w-1/2'>
                  <p className='text-[17px] text-gray-900 md:mr-20 mb-6'>Get role-specific question, expand answer when you need them, dive deeper int concept, and organize everything your way From preparation to mastery - your ultimate interview toolkit is here</p>
                  <button className='bg-black text-white text-sm font-semibold px-7 py-2.5 rounded-full hover:bg-yellow-100 border border-yellow-50 hover:border-amber-600 hover:text-black   transition-colors cursor-pointer ' onClick={handleCTA}>
                    Get Started
                  </button>
            </div>
          </div>
        </div>
      <div className='w-ful h-min-full  relative z-10 '>
      <div className='flex items-center justify-center -mt-36'>
      <section className=''>
        <img src={HERO_IMAGE} alt="HERO IMAGE" className='w-[80vw] rounded-lg border border-amber-600' />
      </section>
      </div>
    </div> 

    <div className='w-ful h-min-full '>
      <div className='contaier mx-auto px-4 pt-10 pb-20 '>
        <section className='mt-5'>
          <h2 className='text-2xl font-medium text-center mb-12'>
              Features That Make You Shine
          </h2>
          <div className='flex flex-col items-center gap-8'>
             {/* first 3 card */}
             <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full'>
              {APP_FEATURES.slice(0, 3).map((feature) => (
                <div key={feature.id}  className='bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-300 transition border border-amber-100'>
                  <h3 className='text-base font-semibold mb-3'>{feature.title}</h3>
                  <p className='text-gray-600'>{feature.description}</p>
                   </div>
              ))}
             </div>

              {/* reamaining 2 card */}
             <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full'>
              {APP_FEATURES.slice(3).map((feature) => (
                <div key={feature.id}  className='bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-300 transition border border-amber-100'>
                  <h3 className='text-base font-semibold mb-3'>{feature.title}</h3>
                  <p className='text-gray-600'>{feature.description}</p>
                   </div>
              ))}
             </div>
          </div>
        </section>
      </div>
      <div className='text-sm bg-gray-50 text-secondary text-center p-5 mt-5'>
        Made with ❤️ Pranay Ogale Happly Coding
      </div>

    </div>
      </div> 
    </div>

    
      <Modal isOpen={openAuthModal}
       onClose={()=>{
         setOpenAuthModal(false);
         setcurrentPage("login");
       }}
      hideheader>
      <div>
           {currentPage === "login" && (
             <Login setcurrentPage={setcurrentPage} />
          )}
          {currentPage === "signup" && (
            <SignUp setcurrentPage={setcurrentPage} />
         )}  
         </div>
      </Modal>

    </>
  

  )
}

export default LandingPage
