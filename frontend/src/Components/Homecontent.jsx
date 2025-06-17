import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../context';
import { HANDEL_LIKE } from '../api/const';

const Homecontent = ({ post }) => {
    const { userData } = useAppContext();
    const [likedBtn, setLikedBtn] = useState(false);

    const handelLike = async () => {
        if (likedBtn) return; // prevent double like
        setLikedBtn(true);    // optimistically update UI

        try {
            await axios.post(
                HANDEL_LIKE(post._id),
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
        } catch (error) {
            console.log("Error in like on frontend:", error);
            setLikedBtn(false); // rollback UI if request fails
        }
    };

    if (!post) {
        return <div className="text-red-500">Error: Post data not available.</div>;
    }

    const defaultImageUrl = "https://placehold.co/600x400/36454F/FFFFFF?text=No+Image+Available";
    // const imageUrl = post.imagePath
    //     ? `${import.meta.env.VITE_BACKEND_LINK}/${post.imagePath}`
    //     : defaultImageUrl;
    const imageUrl = post.imagePath
    ? post.imagePath.startsWith("http") 
        ? post.imagePath 
        : `${import.meta.env.VITE_BACKEND_LINK}/${post.imagePath}`
    : defaultImageUrl;


    const authorDisplayName = post.userName || post.email || 'Anonymous';
    const authorImage = post.userId && post.userId.userImg
        ? `${import.meta.env.VITE_BACKEND_LINK}/${post.userId.userImg}`
        : "https://placehold.co/40x40/555555/FFFFFF?text=NA";

    return (
        <div className='w-2/3 bg-indigo-950/10 flex flex-col min-h-[480px] max-h-[500px] rounded-lg overflow-hidden border border-indigo-700/30'>

            {/* Image Section */}
            <div className='h-auto max-h-[450px] w-full flex items-center justify-center overflow-hidden bg-indigo-900/5 '>
                <img
                    src={imageUrl}
                    alt={post.title || "Post Image"}
                    loading="lazy"  // <---- this is the magic
                    className='w-full h-full object-contain rounded-t-lg'
                    onError={(e) => {
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
                <p className="text-base text-gray-300">
                    {post.textContent || 'No content available.'}
                </p>
            </div>

            {/* Author Section */}
            <div className='flex items-center gap-2 p-4 pt-0 text-sm text-gray-400'>
                {/* <img src={authorImage} alt="Author" className="w-8 h-8 rounded-full object-cover" /> */}
                <h6>Author: <span className="font-medium text-gray-300">{authorDisplayName}</span></h6>
            </div>

            {/* Like Button */}
            <div className="px-4 pb-4">
                {likedBtn ? (
                    <p className="text-green-400 font-semibold">Liked!</p>
                ) : (
                    <button onClick={handelLike}>
                        <h6 className='text-pink-600'>Like</h6>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Homecontent;
