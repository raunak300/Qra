// Homecontent.jsx
import React from 'react';

const Homecontent = ({ post }) => { // Destructure 'post' prop
    // Ensure post object exists and has required properties
    if (!post) {
        return <div className="text-red-500">Error: Post data not available.</div>;
    }

    // Default image if post.imagePath is null or undefined
    const defaultImageUrl = "https://placehold.co/600x400/36454F/FFFFFF?text=No+Image+Available";
    // Construct the full image URL using post.imagePath from your new schema
    // Assumes your backend serves static files from '/uploads'
    const imageUrl = post.imagePath ? `${import.meta.env.VITE_BACKEND_LINK}/${post.imagePath}` : defaultImageUrl;
    
    // Fallback for author display: Use userName directly from the post, then email, else 'Anonymous'
    // This assumes userName and email are direct fields on the post object as per your new schema.
    const authorDisplayName = post.userName || post.email || 'Anonymous'; 

    // For author's image, we assume post.userId will be populated by the backend
    // to include the author's userImg from the User model.
    // If post.userId is not populated or userImg is missing, a default image is used.
    const authorImage = post.userId && post.userId.userImg ? 
                        `${import.meta.env.VITE_BACKEND_LINK}/${post.userId.userImg}` : 
                        "https://placehold.co/40x40/555555/FFFFFF?text=NA"; // Default author image


    return (
        <div className='w-2/3 bg-indigo-950/10 flex flex-col min-h-[300px] rounded-lg overflow-hidden border border-indigo-700/30'> 
            {/* Image Section */}
            <div className='h-auto max-h-[300px] w-full flex items-center justify-center overflow-hidden'>
                <img 
                    src={imageUrl} 
                    alt={post.title || "Post Image"} 
                    className='w-full h-full object-cover rounded-t-lg'
                    onError={(e) => { // Fallback in case image fails to load
                        e.target.onerror = null; 
                        e.target.src = defaultImageUrl;
                    }}
                />
            </div>
            
            {/* Content Section */}
            <div className='flex flex-col mt-5 ml-4 mb-5 gap-2 flex-grow p-2'> 
                <h2 className="text-xl font-semibold text-indigo-100"> 
                    {post.title || 'No Title'}
                </h2>
                {/* Display post content using textContent from your new schema */}
                <p className="text-base text-gray-300"> 
                    {post.textContent || 'No content available.'}
                </p>
            </div>
            
            {/* Author Section */}
            <div className='flex items-center gap-2 p-4 pt-0 text-sm text-gray-400'>
                
                <h6>Author: <span className="font-medium text-gray-300">{authorDisplayName}</span></h6>
            </div>
        </div>
    )
}

export default Homecontent;
