import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import Input from "../../components/inputs/input"
import { FaSpider } from 'react-icons/fa6';
import SpinnerLoader from '../../components/loaders/SpinnerLoader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

const CreateSessionForm = () => {
  const [formData,setFormData]=useState({
    role:"",
    experience:"",
    topicsToFocus:"",
    description:"",
  });
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState(null);

  const navigate=useNavigate();

  const handleChange=(key,value)=>{
    setFormData((prevData)=>({
      ...prevData,
      [key]:value,
    }));
  };
  
//   const handleCreationSession = async (e) => {
//   e.preventDefault();
//   const { role, experience, topicsToFocus } = formData;

//   if (!role || !experience || !topicsToFocus) {
//     setError("Please fill all the required fields");
//     return;
//   }
  
//   setError("");
//   setIsLoading(true);

//   try {
//     // 1. Generate questions from the AI service
//     const aiResponse = await axiosInstance.post(
//       API_PATHS.AI.GENERATE_QUESTIONS, {
//         role,
//         experience,
//         topicsToFocus,
//         numberOfQuestions: 10, // Assuming plural is correct
//       }
//     );
//     const generatedQuestions = aiResponse.data; // Renamed for clarity

//     // 2. Create the session in your database with the questions
//     const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
//       ...formData,
//       questions: generatedQuestions,
//     });

//     const sessionId = response.data?.session?._id;

//     if (sessionId) {
//       navigate(`/interview-prep/${sessionId}`);
//     } else {
//       // This else block might not be needed if a failed creation throws an error
//       setError("Something went wrong. Please try again");
//     }
//   } catch (error) {
//     // This block now catches errors from either API call
//     console.error("Failed to create interview session:", error);
//     setError("Could not create the session. Please check your connection and try again.");
//   } finally {
//     // This will run regardless of success or failure
//     setIsLoading(false);
//   }
// };

const handleCreationSession = async (e) => {
  e.preventDefault();
  const { role, experience, topicsToFocus } = formData;

  if (!role || !experience || !topicsToFocus) {
    setError("Please fill all the required fields");
    return;
  }
  
  setError("");
  setIsLoading(true);

  try {
    // 1. Generate questions from the AI service
    const aiResponse = await axiosInstance.post(
      API_PATHS.AI.GENERATE_QUESTIONS, {
        role,
        experience,
        topicsToFocus,
        numberOfQuestions: 10,
      }
    );
    
    // FIX: Extract the questions array from the response
    const generatedQuestions = aiResponse.data.questions; // ← This is the key fix!

    // 2. Create the session in your database with the questions
    const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
      ...formData,
      questions: generatedQuestions, // Now this is a proper array
    });

    const sessionId = response.data?.session?._id;

    if (sessionId) {
      navigate(`/interview-prep/${sessionId}`);
    } else {
      setError("Something went wrong. Please try again");
    }
  } catch (error) {
    console.error("Failed to create interview session:", error);
    
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    }
    
    setError("Could not create the session. Please check your connection and try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Start a New Interview Journey</h3>
      <p className='text-xs text-slate-700 mt-[15px] mb-3'>Fill out few quick details and unlock your personalized set of interview questions!</p>

      <form onSubmit={handleCreationSession} className='flex flex-col gap-3'>

      <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target role"
          placeholder="(e.g. Frontend Developer, UI/UX Designer, etc.)"
          type="text"
      />
        
        <Input
        value={formData.experience}
        onChange={({target})=>handleChange("experience",target.value)}
        label="Years of Experience"
        placeholder="(e.g., 1 year, 3 year, 5+ year)"
        type="number"
        />

        <Input
        value={formData.topicsToFocus}
        onChange={({target})=>handleChange("topicsToFocus",target.value)}
        label="Topics to Focus On"
        placeholder="(Comma-separated, e.g. , React, Node.js, MongoDB)"
        type="text"
        />

        <Input
        value={formData.description}
        onChange={({target})=>handleChange("description",target.value)}
        label="Description"
        placeholder="(Any specific goals or notes for this session)"
        type="text"
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary w-full mt-2 p-2 rounded-full' disabled={isLoading}>
          
          {isLoading && <SpinnerLoader/>}Create Session</button>

      </form>
    </div>
  ) 
}

export default CreateSessionForm
