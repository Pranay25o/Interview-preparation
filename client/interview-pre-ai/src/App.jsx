import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast'

// import login from './pages/auth/login'
// import signUp from './pages/auth/signUp'
import LandingPage from "./pages/landingPage"
import Dashboard from './pages/home/dashboard'
import InterviewPrep from './pages/interviewPrep/interviewPrep'
import UserProvider from './context/userContext'





const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
       
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview-prep/:sessionId" element={<InterviewPrep/>} />
        </Routes>
      </Router>
      <Toaster toastOptions={{
        className:"",
        style: { fontSize:'13px'},

        }}/>    
    </div></UserProvider>
    
  )
}

export default App
