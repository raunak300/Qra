import React from 'react';

const Profile = () => {
    return (
        <div className='h-[100vh] w-full flex flex-col items-center justify-center bg-gray-900'>
            <div className='h-[90vh] w-3/5 bg-indigo-900/20 rounded-lg shadow-lg p-6'>
                <div className='w-full flex flex-col items-center justify-center space-y-6'>
                    {/* File input area */}
                    <label
                        htmlFor="user_img"
                        className='cursor-pointer rounded-full bg-zinc-800 flex items-center justify-center h-32 w-32 overflow-hidden border-2 border-indigo-500 hover:border-indigo-300 transition-shadow shadow-md hover:shadow-lg'
                        title="Click to upload image"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png"
                            alt="Folder Icon"
                            className='h-16 w-16 object-contain'
                        />
                        <input
                            type="file"
                            id="user_img"
                            accept="image/*"
                            className='hidden'
                        />
                    </label>
                    <p>Add Profile Image</p>
                    {/* Email input */}
                    <div className='flex flex-col w-full'>
                        <label htmlFor="email" className='text-xl text-white mb-2'>Email</label>
                        <input
                            type="email"
                            id="email"
                            value=""
                            placeholder='Enter Email'
                            className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md'
                        />
                    </div>

                    {/* UserName input */}
                    <div className='flex flex-col w-full'>
                        <label htmlFor="userName" className='text-xl text-white mb-2'>UserName</label>
                        <input
                            type="text"
                            id="userName"
                            value=""
                            placeholder='Enter UserName'
                            className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md'
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className='w-full bg-white text-indigo-900 font-semibold py-2 rounded-md hover:bg-indigo-100 transition'
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
