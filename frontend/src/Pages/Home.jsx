// Home.jsx
import React from 'react';
import { Link } from "react-router-dom";
// import PostContent from './PostContent'; // PostContent is not used in the provided code
import Homecontent from '../Components/Homecontent';

const Home = () => {
    return (
        <div className='bg-zinc-900 text-white'>
            <div className='flex flex-col h-screen'>
                <div className='w-full h-[8vh] bg-indigo-950/10'>
                    <nav className='w-full flex gap-8 items-center justify-center mt-2'>
                        <Link to="/" className='hover:text-indigo-100'>Home</Link>
                        <Link to="/" className='hover:text-indigo-100'>About</Link>
                        <Link to="/" className='hover:text-indigo-100'>Contact</Link>
                    </nav>
                </div>
                <div className='h-[90vh] flex'>
                    <div className='w-[25%] bg-indigo-900/10 text-white p-4 flex flex-col gap-4 justify-between'>
                        <div className='flex flex-col gap-5'>
                            <h1 className='text-3xl text-white'>
                                Welcome To <span className='text-indigo-500/70 hover:text-indigo-500/50'>QRA</span>
                            </h1>
                            <div className='text-xl font-semibold'>
                                <button className=' hover:text-indigo-100 ' >
                                    <Link to="/profile" >Profile</Link>
                                </button>
                            </div>
                            <div className='text-xl font-semibold'>
                                 <button className=' hover:text-indigo-100 ' >
                                    <Link to="/post" >Upload</Link>
                                 </button>
                            </div>
                        </div>
                        <div className='text-xl font-semibold'>
                             <button className=' hover:text-red-800 ' >Logout</button>
                        </div>
                    </div>

                    {/* Main Container for Homecontent components */}
                    <div className='w-[75%] p-6 overflow-y-auto h-[90vh] flex flex-col gap-4'>
                        {/* No more wrapper divs for spacing needed here */}
                        <Homecontent />
                        <Homecontent />
                        <Homecontent />
                        {/* You can add more Homecontent components as needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;