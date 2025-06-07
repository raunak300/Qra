import React from 'react';

const PostContent = () => {
  return (
    <div className='h-[100vh] w-full flex flex-col items-center justify-center bg-gray-900'>
      <div className='mt-2 p-6'>
        <h1 className='text-3xl text-white'>
          Create Your <span className='text-indigo-500/70'>Post</span>
        </h1>
      </div>

      <div className='bg-indigo-900/30 h-[80vh] w-2/4 flex flex-col items-center justify-center rounded-xl p-4'>
        <form className='w-full max-w-md space-y-6'>
          {/* Add Photo Input */}
          <div className='flex flex-col'>
            <label htmlFor="img" className='text-xl text-white mb-2'>Add Photo</label>
            <input
              type="file"
              id="img"
              accept="image/*"
              className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          {/* Title Input */}
          <div className='flex flex-col'>
            <label htmlFor="head" className='text-xl text-white mb-2'>Title</label>
            <input
              type="text"
              id="head"
              placeholder='Enter title'
              className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          {/* Textarea for Content */}
          <div className='flex flex-col'>
            <label htmlFor="content" className='text-xl text-white mb-2'>Content</label>
            <textarea
              id="content"
              placeholder='Enter content'
              className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32'
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className='w-full bg-white text-indigo-900 font-semibold py-2 rounded-md hover:bg-indigo-100 transition'
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostContent;
