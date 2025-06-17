import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Homecontent from '../Components/Homecontent';
import axiosInstance from '../utils/axiosconfig';
import { LOGOUT, GET_ALL_POSTS } from '../api/const';
import { useAppContext } from '../context';

const Home = () => {
    const { user, logout, userData } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState(30);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);
    
    const isAdmin = userData?.user?._id === import.meta.env.VITE_ADMIN_ID;
    const navigate = useNavigate();

    const handelLogout = async () => {
        try {
            const response = await axiosInstance.get(LOGOUT);
            if (response.status === 200) {
                console.log("logout done");
                logout();
                navigate('/login');
            }
        } catch (error) {
            console.error("Error in logout:", error);
        }
    };

    useEffect(() => {
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
    }, []);

    return (
        <div className='bg-zinc-900 text-white h-screen flex flex-col'>

            {/* Top Navigation Bar */}
            <div className='w-full h-[8vh] bg-indigo-950/10 flex items-center justify-center shadow-lg'>
                <nav className='flex gap-10'>
                    <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200 transition-colors duration-200'>Home</Link>
                    <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200 transition-colors duration-200'>About</Link>
                    <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200 transition-colors duration-200'>Contact</Link>
                </nav>
            </div>

            {/* Main Section */}
            <div className='flex flex-grow h-[92vh]'>

                {/* Sidebar */}
                <div className='w-1/5 bg-indigo-900/10 text-white p-6 flex flex-col justify-between shadow-xl'>
                    <div className='flex flex-col gap-8'>
                        <h1 className='text-4xl font-extrabold text-white mb-6'>
                            Welcome To <span className='text-indigo-400 hover:text-indigo-300'>QRA</span>
                        </h1>
                        <nav className='flex flex-col gap-5'>
                            <Link to="/profile" className='text-xl font-medium text-gray-300 hover:text-indigo-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>
                                Profile
                            </Link>
                            <Link to="/post" className='text-xl font-medium text-gray-300 hover:text-indigo-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>
                                Upload
                            </Link>
                            <Link to="/allposts" className='text-xl font-medium text-gray-300 hover:text-indigo-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>
                                Posts
                            </Link>
                            {isAdmin && (
                                <Link to="/trends" className='text-xl font-medium text-gray-300 hover:text-indigo-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>
                                    Trends
                                </Link>
                            )}
                        </nav>
                    </div>
                    <button
                        onClick={handelLogout}
                        className='text-xl font-semibold text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-800/30 py-2 rounded-md transition-colors duration-200'
                    >
                        Logout
                    </button>
                </div>

                {/* Content Area */}
                <div className='w-4/5 p-6 bg-indigo-900/10 overflow-y-auto max-h-[92vh]'>
                    <div className='flex flex-col gap-5'>
                        {postsLoading && (
                            <div className="text-2xl text-indigo-300 flex justify-center items-center h-full">Loading posts...</div>
                        )}
                        {postsError && (
                            <div className="text-2xl text-red-500 flex justify-center items-center h-full">Error: {postsError}</div>
                        )}
                        {!postsLoading && posts.length === 0 && !postsError && (
                            <div className="text-2xl text-gray-400 flex justify-center items-center h-full">No posts available yet.</div>
                        )}

                        {posts.slice(0, visiblePosts).map(post => (
                            <Homecontent key={post._id} post={post} />
                        ))}

                        {visiblePosts < posts.length && (
                            <button
                                onClick={() => setVisiblePosts(prev => prev + 20)}
                                className="mx-auto mt-6 px-4 py-2 text-indigo-400 border border-indigo-400 hover:bg-indigo-700/30 rounded-lg transition"
                            >
                                Load More
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
