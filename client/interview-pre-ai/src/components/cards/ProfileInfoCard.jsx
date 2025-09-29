// import React, { useContext } from 'react'
// import { UserContext } from '../../context/userContext'
// import { useNavigate } from 'react-router-dom';

// const ProfileInfoCard = () => {
//     const { user, clearUser } = useContext(UserContext);
//     const navigate = useNavigate();

//     const handleLogout = () => {
     
//         localStorage.removeItem("token"); 
//         clearUser();
//         navigate("/");
//     }
//     if (!user) {
//         return null; 
//     }

//     // This code will only run if the 'user' object exists.
//     return (
//         <div className='flex items-center '>
//             <img src={user.profileImageUrl} alt="Profile" className='w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover' />
//             <div>
//                 <div className='text-[15px] text-black font-bold leading-3'>
//                     {user.name || ""}
//                 </div>
//                 <button className='text-amber-600 text-sm font-semibold cursor-pointer hover:underline' onClick={handleLogout}>
//                     Logout
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default ProfileInfoCard;





import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); 
        clearUser();
        navigate("/");
    }

    if (!user) {
        return null; 
    }

    return (
        <div className='flex items-center '>
            {/* FIX: Only render the image if profileImageUrl is not an empty string */}
            {user.profileImageUrl && (
                <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className='w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover' 
                />
            )}
            
            <div>
                <div className='text-[15px] text-black font-bold leading-3'>
                    {user.name || ""}
                </div>
                <button className='text-amber-600 text-sm font-semibold cursor-pointer hover:underline' onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default ProfileInfoCard;