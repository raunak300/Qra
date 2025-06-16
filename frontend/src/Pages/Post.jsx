
// import React from 'react';
// import { useAppContext } from '../context';
// import UserPosts from '../Components/UserPosts'; // Assuming UserPosts is your Homecontent component, adjust path if different
// import { Link } from 'react-router-dom';
// const Post = () => {
//     const { userData } = useAppContext();

//     // Add a check for userData and user before accessing properties
//     if (!userData || !userData.user) {
//         // You might want a more sophisticated loading indicator here
//         return <div className="text-gray-300 flex justify-center items-center h-screen bg-zinc-900">Loading user profile...</div>;
//     }

//     const imagePath = userData.user.userImg;
//     // Handle cases where userImg might be null or undefined
//     const imageUrl = imagePath ? `${import.meta.env.VITE_BACKEND_LINK}/${imagePath}` : "https://placehold.co/96x96/555555/FFFFFF?text=P";

//     return (
//         <div className='bg-zinc-900 min-h-screen flex flex-row'> {/* Added min-h-screen to ensure background covers full height */}
//             <div className='w-[25%] bg-indigo-900/10 text-white p-4 flex flex-col gap-4 justify-between'>
//                 <div className='flex flex-col gap-5'>
//                     <h1 className='text-3xl text-white'>
//                         Welcome To <span className='text-indigo-500/70 hover:text-indigo-500/50'>QRA</span>
//                     </h1>
//                     <div className='text-xl font-semibold'>
//                         <button className=' hover:text-indigo-100 ' >
//                             <Link to="/profile" >Profile</Link>
//                         </button>
//                     </div>
//                     <div className='text-xl font-semibold'>
//                         <button className=' hover:text-indigo-100 ' >
//                             <Link to="/post" >Upload</Link>
//                         </button>
//                     </div>
//                     <div className='text-xl font-semibold'>
//                         <button className=' hover:text-indigo-100 ' >
//                             <Link to="/allposts" >Posts</Link>
//                         </button>
//                     </div>
//                 </div>

//             </div>
//             <div className='bg-zinc-900 h-full w-[5vh]'>

//             </div>
//             <div className='flex flex-col'>
//                 {/* User Profile Header */}
//                 <div className='h-[18vh] bg-indigo-900/10 flex flex-row items-center gap-10 p-4'>
//                     <div className='cursor-pointer rounded-full bg-zinc-800 flex items-center justify-center h-24 w-24 overflow-hidden border-2 border-indigo-500 hover:border-indigo-300 transition-shadow shadow-md hover:shadow-lg'>
//                         <img
//                             src={imageUrl}
//                             alt="User Profile"
//                             className="w-full h-full object-cover" // Ensure profile image covers its circular container
//                             onError={(e) => { // Fallback for profile image
//                                 e.target.onerror = null;
//                                 e.target.src = "https://placehold.co/96x96/555555/FFFFFF?text=P"; // Placeholder if image fails
//                             }}
//                         />
//                     </div>
//                     <div className='flex flex-col text-xl text-zinc-100'>
//                         <div className="font-semibold">
//                             {userData.user.userName}
//                         </div>
//                         <div className="text-gray-400 text-base">
//                             {userData.user.email}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Section Title for Posts */}
//                 <div className='bg-zinc-900 text-white font-bold h-[5vh] flex items-center justify-center text-lg'>
//                     {userData.user.userName} Posts
//                 </div>

//                 {/* User Posts Section - Now scrollable and fixed 3-column layout */}
//                 <div className='bg-indigo-900/10 h-[74vh] overflow-y-auto p-4'>
//                     {/* *************************************************************** */}
//                     {/* IMPORTANT CHANGE HERE: grid-cols-3 directly for fixed 3-column layout */}
//                     {/* *************************************************************** */}
//                     <div className='grid grid-cols-3 gap-3'> {/* Changed to fixed grid-cols-3 and gap-3 */}
//                         {/* Check if uploadedPosts exists and has items before mapping */}
//                         {userData.user.uploadedPosts && userData.user.uploadedPosts.length > 0 ? (
//                             userData.user.uploadedPosts.map(post => (
//                                 <UserPosts key={post.postId} post={post} />
//                             ))
//                         ) : (
//                             <div className="text-gray-400 text-center col-span-full py-10">
//                                 No posts uploaded yet.
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Post;

import React from 'react';
import { useAppContext } from '../context';
import UserPosts from '../Components/UserPosts'; // Correctly importing UserPosts (which is the file you just provided)
import { Link } from 'react-router-dom'; // Make sure react-router-dom is installed

const Post = () => {
    const { userData } = useAppContext();

    // Add a check for userData and user before accessing properties
    if (!userData || !userData.user) {
        // You might want a more sophisticated loading indicator here
        return (
            <div className="bg-zinc-900 min-h-screen flex justify-center items-center">
                <p className="text-gray-300 text-lg">Loading user profile...</p>
            </div>
        );
    }

    const imagePath = userData.user.userImg;
    // Handle cases where userImg might be null or undefined
    const imageUrl = imagePath ? `${import.meta.env.VITE_BACKEND_LINK}/${imagePath}` : "https://placehold.co/96x96/555555/FFFFFF?text=P";

    return (
        <div className='bg-zinc-900 min-h-screen flex flex-row'> {/* Main container, uses flex-row for sidebar + main content */}

            {/* Sidebar (Left Panel) */}
            <div className='w-1/5 bg-indigo-900/10 text-white p-6 flex flex-col gap-8 shadow-xl'> {/* Adjusted width, increased padding and gap, added shadow */}
                <h1 className='text-4xl font-extrabold text-white mb-6'> {/* Larger, bolder heading */}
                    Welcome To <span className='text-indigo-400 hover:text-indigo-300 transition-colors duration-200'>QRA</span>
                </h1>
                <nav className='flex flex-col gap-5'> {/* Using <nav> for semantic navigation links */}
                     <Link to="/" className='text-xl font-medium text-gray-300 hover:text-indigo-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'> {/* Improved link styles */}
                        Home
                    </Link>
                    <Link to="/profile" className='text-xl font-medium text-gray-300 hover:text-indigo-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'> {/* Improved link styles */}
                        Profile
                    </Link>
                    <Link to="/post" className='text-xl font-medium text-gray-300 hover:text-indigo-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>
                        Upload
                    </Link>
                    <Link to="/allposts" className='text-xl font-medium text-gray-300 hover:text-indigo-200 transition-colors duration-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>
                        Posts
                    </Link>
                </nav>
            </div>

            {/* Main Content Area (User Profile Header + Posts Grid) */}
            <div className='flex flex-col flex-grow'> {/* Use flex-grow to take remaining width */}
                {/* User Profile Header */}
                <div className='h-[18vh] bg-indigo-900/10 flex flex-row items-center gap-10 p-6 shadow-md'> {/* Added shadow for depth */}
                    <div className='cursor-pointer rounded-full bg-zinc-800 flex items-center justify-center h-24 w-24 overflow-hidden border-3 border-indigo-500 hover:border-indigo-300 transition-all duration-300 shadow-lg hover:shadow-xl'> {/* Larger image, bolder border, better hover */}
                        <img
                            src={imageUrl}
                            alt="User Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => { // Fallback for profile image
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/96x96/555555/FFFFFF?text=P";
                            }}
                        />
                    </div>
                    <div className='flex flex-col text-zinc-100'>
                        <h2 className="text-3xl font-bold text-indigo-100 mb-1"> {/* Larger, more prominent name */}
                            {userData.user.userName}
                        </h2>
                        <p className="text-lg text-gray-400"> {/* Clearer email */}
                            {userData.user.email}
                        </p>
                    </div>
                </div>

                {/* Section Title for Posts */}
                <div className='bg-zinc-800 text-white font-bold h-[7vh] flex items-center justify-center text-2xl border-b border-indigo-700/30'> {/* Slightly darker bg, larger text, bottom border */}
                    Your Uploaded Posts
                </div>

                {/* User Posts Section - Scrollable and fixed 3-column layout */}
                <div className='bg-indigo-900/10 h-[75vh] overflow-y-auto p-6 rounded-br-xl'> {/* Increased padding, rounded bottom-right */}
                    <div className='grid grid-cols-3 gap-5'> {/* Increased gap to gap-5 for more breathing room */}
                        {/* Check if uploadedPosts exists and has items before mapping */}
                        {userData.user.uploadedPosts && userData.user.uploadedPosts.length > 0 ? (
                            userData.user.uploadedPosts.map(post => (
                                <UserPosts key={post.postId} post={post} />
                            ))
                        ) : (
                            <div className="text-gray-400 text-center col-span-full py-20 text-xl"> {/* Larger text for no posts message */}
                                No posts uploaded yet. Start sharing!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post;