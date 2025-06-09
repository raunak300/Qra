// Home.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
// import PostContent from './PostContent'; // PostContent is not used in the provided code
import Homecontent from '../Components/Homecontent'
import axiosInstance from '../utils/axiosconfig'
import { LOGOUT,GET_ALL_POSTS } from '../api/const';
import { useAppContext } from '../context'; // Importing context to manage authentication state

const Home = () => {

    const {user}=useAppContext();
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);

    const Navigate = useNavigate();
    const {logout} = useAppContext(); // Using context to access the logout function
    const handelLogout=async()=>{
       try {
         const response=await axiosInstance.get(LOGOUT);
        if(response.status===200){
            console.log("logout done")
            logout()
            Navigate('/login')
        }
       } catch (error) {
        console.log("error in logout",error)

       }
        
    }

    useEffect(()=>{
        const fetchPosts = async () => {
            try {
                setPostsLoading(true);
                setPostsError(null); 

                
                const response = await axiosInstance.get(GET_ALL_POSTS, { withCredentials: true });

                if (response.status === 200) {
                    setPosts(response.data.posts); 
                    console.log("Posts fetched successfully:", response.data.posts);
                } else {
                    setPostsError(response.data.message || "Failed to fetch posts.");
                    console.error("Failed to fetch posts:", response.data);
                }
            } catch (error) {
                setPostsError(error.response?.data?.message || "An error occurred while fetching posts.");
                console.error("Error fetching posts:", error.response?.data || error.message);
            } finally {
                setPostsLoading(false); 
            }
        };

        fetchPosts(); 
    },[])

    



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
                             <button className=' hover:text-red-800 '
                             onClick={handelLogout}
                             >Logout</button>
                        </div>
                    </div>

                    {/* Main Container for Homecontent components */}
                    <div className='w-[75%] p-6 overflow-y-auto h-[90vh] flex flex-col gap-4'>
                       {postsLoading && (
                            <div className="text-xl text-indigo-300">Loading posts...</div>
                        )}
                        {postsError && (
                            <div className="text-red-500 text-xl">Error: {postsError}</div>
                        )}
                        {!postsLoading && posts.length === 0 && !postsError && (
                            <div className="text-xl text-gray-400 mt-10">No posts available yet.</div>
                        )}
                        
                        {/* Dynamically render Homecontent for each post */}
                        {posts.map(post => (
                            <Homecontent key={post._id} post={post} /> 
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;