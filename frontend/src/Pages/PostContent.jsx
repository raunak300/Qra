// import React, { useState,useEffect } from 'react';
// import {POST_ROUTE} from '../api/const.js'

// const PostContent = () => {
//   const [title, setTitle] = useState('')
//   const [content,setContent]=useState('')
//   const [image, setImage] = useState(null);

//   const handelImageChange=(e)=>{
//     const file=e.target.files[0];
//     setImage(file);
//   }

//   const handelPostsubmit=async ()=>{
//     console.log("Post submitted with title",title)
//     e.preventDefault()
//     if (!title || !content || !image) {
//       alert("Please fill in all fields and add an image.");
      
//     }
//     try {
//       const response=await axios.post(POST_ROUTE,formData, {
//                 withCredentials: true,
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }})
//     } catch (error) {
//       console.log("erros in submitting post",error);
//       alert("error!! plase try again later")
      
//     }

//   }

//   return (
//     <div className='h-[100vh] w-full flex flex-col items-center justify-center bg-gray-900'>
//       <div className='mt-2 p-6'>
//         <h1 className='text-3xl text-white'>
//           Create Your <span className='text-indigo-500/70'>Post</span>
//         </h1>
//       </div>

//       <div className='bg-indigo-900/30 h-[80vh] w-2/4 flex flex-col items-center justify-center rounded-xl p-4'>
//         <form className='w-full max-w-md space-y-6'>
//           {/* Add Photo Input */}
//           <div className='flex flex-col'>
//             <label htmlFor="img" className='text-xl text-white mb-2'>Add Photo</label>
//             <input
//               type="file"
//               id="img"
//               accept="image/*"
//               value={image}
//               onChange={(e)=>handelImageChange(e)}
//               className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
//             />
//           </div>

//           {/* Title Input */}
//           <div className='flex flex-col'>
//             <label htmlFor="head" className='text-xl text-white mb-2'>Title</label>
//             <input
//               type="text"
//               id="head"
//               value={title}
//               onChange={(e)=>setTitle(e.target.value)}
//               placeholder='Enter title'
//               className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
//             />
//           </div>

//           {/* Textarea for Content */}
//           <div className='flex flex-col'>
//             <label htmlFor="content" className='text-xl text-white mb-2'>Content</label>
//             <textarea
//               id="content"
//               placeholder='Enter content'
//               value={content}
//               onChange={(e)=>setContent(e.target.value)}
//               className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32'
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className='w-full bg-white text-indigo-900 font-semibold py-2 rounded-md hover:bg-indigo-100 transition'
//             onClick={()=>{
//               handelPostsubmit //this will include handelImage change and submit application
//             }}
//           >
//             Post
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PostContent;



import React, { useState } from 'react';
import axios from 'axios';
// Please ensure the path to 'const.js' is correct relative to PostContent.jsx
// For example, if PostContent.jsx is in 'src/components/' and const.js is in 'src/api/',
// then '../api/const.js' is correct. If your structure is different, adjust this path.
import { POST_ROUTE } from '../api/const.js';

const PostContent = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handelImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handelPostSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!title || !content || !image) {
      setMessage("Please fill in all fields and add an image.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('textContent', content);
    formData.append('img', image);

    try {
      const response = await axios.post(POST_ROUTE, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        setMessage(response.data.message || "Post created successfully!");
        setTitle('');
        setContent('');
        setImage(null);
      } else {
        setMessage(response.data.message || "Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error in submitting post:", error);
      setMessage(error.response?.data?.message || "Error! Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 font-inter'>
      <div className='my-6 p-6'>
        <h1 className='text-3xl sm:text-4xl text-white text-center'>
          Create Your <span className='text-indigo-500/70'>Post</span>
        </h1>
      </div>

      <div className='bg-indigo-900/30 w-full max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col items-center justify-center rounded-xl p-6 sm:p-8 shadow-lg min-h-[50vh]'>
        <form className='w-full space-y-6' onSubmit={handelPostSubmit}>
          <div>
            <label htmlFor="img" className='block text-xl text-white mb-2'>Add Photo</label>
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              onChange={handelImageChange}
              className='block w-full text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-600 file:text-white
                         hover:file:bg-indigo-700 transition'
            />
          </div>

          <div>
            <label htmlFor="head" className='block text-xl text-white mb-2'>Title</label>
            <input
              type="text"
              id="head"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter title'
              className='w-full bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <div>
            <label htmlFor="content" className='block text-xl text-white mb-2'>Content</label>
            <textarea
              id="content"
              placeholder='Enter content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='w-full bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-y'
            />
          </div>

          <button
            type="submit"
            className='w-full bg-white text-indigo-900 font-semibold py-2 rounded-md hover:bg-indigo-100 transition'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>

          {message && (
            <p className={`mt-4 text-center text-sm ${message.includes('Error') || message.includes('Please') || message.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostContent;

