// // Home.jsx
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from "react-router-dom";
// // import PostContent from './PostContent'; // PostContent is not used in the provided code
// import Homecontent from '../Components/Homecontent'
// import axiosInstance from '../utils/axiosconfig'
// import { LOGOUT,GET_ALL_POSTS } from '../api/const';
// import { useAppContext } from '../context'; // Importing context to manage authentication state

// const Home = () => {

//     const {user}=useAppContext();
//     const [posts, setPosts] = useState([]);
//     const [postsLoading, setPostsLoading] = useState(true);
//     const [postsError, setPostsError] = useState(null);

//     const Navigate = useNavigate();
//     const {logout} = useAppContext(); // Using context to access the logout function
//     const handelLogout=async()=>{
//        try {
//          const response=await axiosInstance.get(LOGOUT);
//         if(response.status===200){
//             console.log("logout done")
//             logout()
//             Navigate('/login')
//         }
//        } catch (error) {
//         console.log("error in logout",error)

//        }
        
//     }

//     useEffect(()=>{
//         const fetchPosts = async () => {
//             try {
//                 setPostsLoading(true);
//                 setPostsError(null); 

                
//                 const response = await axiosInstance.get(GET_ALL_POSTS, { withCredentials: true });

//                 if (response.status === 200) {
//                     setPosts(response.data.posts); 
//                     console.log("Posts fetched successfully:", response.data.posts);
//                 } else {
//                     setPostsError(response.data.message || "Failed to fetch posts.");
//                     console.error("Failed to fetch posts:", response.data);
//                 }
//             } catch (error) {
//                 setPostsError(error.response?.data?.message || "An error occurred while fetching posts.");
//                 console.error("Error fetching posts:", error.response?.data || error.message);
//             } finally {
//                 setPostsLoading(false); 
//             }
//         };

//         fetchPosts(); 
//     },[])

    



//     return (
//         <div className='bg-zinc-900 text-white'>
//             <div className='flex flex-col h-screen'>
//                 <div className='w-full h-[8vh] bg-indigo-950/10'>
//                     <nav className='w-full flex gap-8 items-center justify-center mt-2'>
//                         <Link to="/" className='hover:text-indigo-100'>Home</Link>
//                         <Link to="/" className='hover:text-indigo-100'>About</Link>
//                         <Link to="/" className='hover:text-indigo-100'>Contact</Link>
//                     </nav>
//                 </div>
//                 <div className='h-[90vh] flex'>
//                     <div className='w-[25%] bg-indigo-900/10 text-white p-4 flex flex-col gap-4 justify-between'>
//                         <div className='flex flex-col gap-5'>
//                             <h1 className='text-3xl text-white'>
//                                 Welcome To <span className='text-indigo-500/70 hover:text-indigo-500/50'>QRA</span>
//                             </h1>
//                             <div className='text-xl font-semibold'>
//                                 <button className=' hover:text-indigo-100 ' >
//                                     <Link to="/profile" >Profile</Link>
//                                 </button>
//                             </div>
//                             <div className='text-xl font-semibold'>
//                                  <button className=' hover:text-indigo-100 ' >
//                                     <Link to="/post" >Upload</Link>
//                                  </button>
//                             </div>
//                             <div className='text-xl font-semibold'>
//                                  <button className=' hover:text-indigo-100 ' >
//                                     <Link to="/allposts" >Posts</Link>
//                                  </button>
//                             </div>
//                         </div>
//                         <div className='text-xl font-semibold'>
//                              <button className=' hover:text-red-800 '
//                              onClick={handelLogout}
//                              >Logout</button>
//                         </div>
//                     </div>

//                     {/* Main Container for Homecontent components */}
//                     <div className='w-[75%] p-6 overflow-y-auto h-[90vh] flex flex-col gap-4'>
//                        {postsLoading && (
//                             <div className="text-xl text-indigo-300">Loading posts...</div>
//                         )}
//                         {postsError && (
//                             <div className="text-red-500 text-xl">Error: {postsError}</div>
//                         )}
//                         {!postsLoading && posts.length === 0 && !postsError && (
//                             <div className="text-xl text-gray-400 mt-10">No posts available yet.</div>
//                         )}
                        
//                         {/* Dynamically render Homecontent for each post */}
//                         {posts.map(post => (
//                             <Homecontent key={post._id} post={post} /> 
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Home;


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Homecontent from '../Components/Homecontent';
import axiosInstance from '../utils/axiosconfig';
import { LOGOUT, GET_ALL_POSTS } from '../api/const';
import { useAppContext } from '../context';

const Home = () => {
    const { user, logout } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);

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

        {/* Top Navigation Bar - FIXED HEIGHT */}
        <div className='w-full h-[8vh] bg-indigo-950/10 flex items-center justify-center shadow-lg'>
            <nav className='flex gap-10'>
                <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200 transition-colors duration-200'>Home</Link>
                <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200 transition-colors duration-200'>About</Link>
                <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200 transition-colors duration-200'>Contact</Link>
            </nav>
        </div>

        {/* Main Section: Sidebar + Scrollable Content */}
        <div className='flex flex-grow h-[92vh]'> {/* Remaining height after navbar */}

            {/* Sidebar (Left Panel - FIXED HEIGHT) */}
            <div className='w-1/5 bg-indigo-900/10 text-white p-6 flex flex-col justify-between shadow-xl'>
                <div className='flex flex-col gap-8'>
                    <h1 className='text-4xl font-extrabold text-white mb-6'>
                        Welcome To <span className='text-indigo-400 hover:text-indigo-300 transition-colors duration-200'>QRA</span>
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
                    </nav>
                </div>
                <button
                    onClick={handelLogout}
                    className='text-xl font-semibold text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-800/30 py-2 rounded-md transition-colors duration-200'
                >
                    Logout
                </button>
            </div>

            {/* Scrollable Content Area */}
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