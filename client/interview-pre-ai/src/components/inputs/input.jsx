import React, { use } from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'
import { useState } from 'react';

const input = ({value,onChange,label,placeholder,type,}) => {

    const [showPassword, setShowPassword]=useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
        
    };

    

return (
    <div>
        <label className='text-[15px] text-slate-800'>{label}</label>
        <div className='relative'>
            <input
                type={type === "password" ? (showPassword ? "text" : "password") : type}
                placeholder={placeholder}
                className='w-full bg-transparent border-amber-600 outline-none p-2 text-[16px] font-semibold text-black border rounded-xl mb-2 mt-1 pr-10'
                value={value}
                onChange={(e) => onChange(e)}
            />
            {type === "password" && (
                <span className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center'>
                    {showPassword ? (
                        <FaRegEye
                            size={22}
                            className='text-primary cursor-pointer  text-amber-600'
                            onClick={toggleShowPassword}
                            title="Hide password"
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={22}
                            className='text-slate-400 cursor-pointer'
                            onClick={toggleShowPassword}
                            title="Show password"
                        />
                    )}
                </span>
            )}
        </div>
       
    </div>
)
}

export default input
