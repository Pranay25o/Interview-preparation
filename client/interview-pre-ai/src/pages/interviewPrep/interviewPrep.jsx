import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCircleAlert } from 'react-icons/lu';
import SpinnerLoader from '../../components/loaders/SpinnerLoader';
import DashBoardLayout from '../../components/layouts/dashBoardLayout';
import RoleInfoHeader from './components/roleInfoHeader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import QuestionCard from '../../components/cards/QuestionCard';
import AIResponsePreview from './components/AIResponsePreview';
import Drawer from '../../components/Drawer';
import SkeletonLoader from '../../components/loaders/SkeletonLoader';
import { LuListCollapse } from 'react-icons/lu';
import toast from 'react-hot-toast';


const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errormsg, setErrorMsg] = useState('');

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false); // reserved if needed

  const fetchSessionDetailsById = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      } else {
        setErrorMsg('Session not found.');
      }
    } catch (error) {
      console.error('Error', error);
      setErrorMsg('Failed to load session details.');
    } finally {
      setIsLoading(false);
    }
  };

  const generatedConceptExplanation = async (question) => {
    try {
      setErrorMsg('');
      setExplanation(null);
      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, {
        question,
      });

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg('Failed to generate explanation, Try again later');
      console.error('Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));
      if (response.data && response.data.question) {
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  // const uploadMoreQuestions = async () => {
  //    try {
  //     setIsUpdateLoader(true);
  //     const aiResponse=await axiosInstance.post(
  //       API_PATHS.AI.GENERATE_QUESTIONS,{
  //         role:sessionData?.role,
  //         experience:sessionData?.experience,
  //         topicsToFocus:sessionData?.topicsToFocus,
  //         numberOfQuestions:10,
  //       }
  //     );
  //     const generatedQuestion=aiResponse.data;

  //      const response = await axiosInstance.post(
  //       API_PATHS.QUESTION.ADD_TO_SESSION,
  //       {
  //         sessionId,
  //         questions:generatedQuestion,
  //       }
  //     );
  //     if (response.data) {
  //       toast.success("Added More Q&A!!");
  //        fetchSessionDetailsById();
  //     }
  //    } catch (error) {
  //        if (error.response && error.response.data.message) {
  //           setError(error.response.data.message);
  //         } else {
  //           setError("Something went wrong. Please try again.");
  //         }
  //    } finally{
  //     setIsUpdateLoader(false);
  //    }
  // };

  //   const uploadMoreQuestions = async () => {
  //   try {
  //     setIsUpdateLoader(true);
  //     const aiResponse = await axiosInstance.post(
  //       API_PATHS.AI.GENERATE_QUESTIONS, {
  //         role: sessionData?.role,
  //         experience: sessionData?.experience,
  //         topicsToFocus: sessionData?.topicsToFocus,
  //         numberOfQuestions: 10,
  //       }
  //     );
  //     const generatedQuestion = aiResponse.data;

  //     const response = await axiosInstance.post(
  //       API_PATHS.QUESTION.ADD_TO_SESSION, {
  //         sessionId,
  //         questions: generatedQuestion,
  //       }
  //     );
  //     if (response.data) {
  //       toast.success("Added More Q&A!!");
  //       fetchSessionDetailsById();
  //     }
  //   } catch (error) {
  //     // // CORRECTED: Used the correct state setter 'setErrorMsg'
  //     // if (error.response && error.response.data.message) {
  //     //   setErrorMsg(error.response.data.message);
  //     // } else {
  //     //   setErrorMsg("Something went wrong. Please try again.");
  //     // }
  //     if (error.response?.data?.message) {
  //     setErrorMsg(error.response.data.message);
  //     toast.error(error.response.data.message);
  //   } 
  //   // Check if the status code is 500
  //   else if (error.response?.status === 500) {
  //     setErrorMsg("There was a problem with the server. Please try again later.");
  //     toast.error("There was a problem with the server. Please try again later.");
  //   } 
  //   // Fallback for any other errors
  //   else {
  //     setErrorMsg("Something went wrong. Please try again.");
  //     toast.error("Something went wrong. Please try again.");
  //   }
  //   } finally {
  //     setIsUpdateLoader(false);
  //   }
  // };

  const uploadMoreQuestions = async () => {
  try {
    setIsUpdateLoader(true);

    // 1) Generate questions from AI
    const aiResp = await axiosInstance.post(
      API_PATHS.AI.GENERATE_QUESTIONS,
      {
        role: sessionData?.role ?? "",
        experience: sessionData?.experience ?? "",
        topicsToFocus: sessionData?.topicsToFocus ?? "",
        numberOfQuestions: 10,
      }
    );

    // Accept both array and wrapped payloads
    const generatedQuestion =
      aiResp?.data?.questions ??
      aiResp?.data?.data ??
      aiResp?.data ??
      [];

    if (!Array.isArray(generatedQuestion) || generatedQuestion.length === 0) {
      setErrorMsg("AI did not return any questions.");
      toast.error("AI did not return any questions.");
      return;
    }

    // 2) Save questions into session
    const saveResp = await axiosInstance.post(
      API_PATHS.QUESTION.ADD_TO_SESSION,
      {
        sessionId,
        questions: generatedQuestion,
      }
    );

    if (saveResp?.data) {
      toast.success("Added More Q&A!!");
      await fetchSessionDetailsById();
    } else {
      setErrorMsg("Server response was empty.");
      toast.error("Server response was empty.");
    }
  } catch (error) {
    // Prefer backend message if provided
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong. Please try again.";

    if (error?.response?.status === 500) {
      setErrorMsg("There was a problem with the server. Please try again later.");
      toast.error("There was a problem with the server. Please try again later.");
    } else {
      setErrorMsg(msg);
      toast.error(msg);
    }
  } finally {
    setIsUpdateLoader(false);
  }
};


  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <DashBoardLayout>
        <SpinnerLoader />
      </DashBoardLayout>
    );
  }

  if (errormsg) {
    return (
      <DashBoardLayout>
        <p className="text-red-500 text-center">{errormsg}</p>
      </DashBoardLayout>
    );
  }

  return (
    <DashBoardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ' '}
        topicsToFocus={sessionData?.topicsToFocus || ' '}
        experience={sessionData?.experience || ' '}
        questions={sessionData?.questions?.length || 0}
        description={sessionData?.description || ' '}
        lastUpdated={
          sessionData?.updatedAt ? moment(sessionData.updatedAt).format('Do MMM YYYY') : ' '
        }
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div className={`col-span-12 ${openLeanMoreDrawer ? 'md:col-span-7' : 'md:col-span-8'}`}>
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => {
                const key = data?._id || `q-${index}`;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.4,
                      type: 'spring',
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout
                    layoutId={`question-${key}`}
                  >
                    <QuestionCard
                      question={data?.question}
                      answer={data?.answer}
                      onLearnMore={() => generatedConceptExplanation(data?.question)}
                      isPinned={data?.isPinned}
                      onTogglePin={() => data?._id && toggleQuestionPinStatus(data._id)}
                    />
                    {!isLoading && 
                    sessionData?.questions?.length==index+1 &&(
                      <div className='flex items-center justify-center mt-5'>
                        <button className='flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer'
                        disabled={isLoading || isUpdateLoader}
                        onClick={uploadMoreQuestions}
                        >
                          {isUpdateLoader ? (<SpinnerLoader/>):(<LuListCollapse className="text-lg"/>)}
                          {' '}
                          Load More
                        </button>
                      </div>
                    )}
            
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer
            isOpen={openLeanMoreDrawer}
            onClose={() => setOpenLeanMoreDrawer(false)}
            title={!isLoading && (explanation?.title || '')}
          >
            {errormsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1" />
                {errormsg}
              </p>
            )}

            {isLoading && <SkeletonLoader />}

            {!isLoading && explanation && (
              <AIResponsePreview content={explanation?.explanation} />
            )}
          </Drawer>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default InterviewPrep;

