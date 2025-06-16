// import React, { useState, useEffect, useCallback } from 'react'; 
// import { useNavigate } from 'react-router-dom';
// import { useAppContext } from '../context'; 
// import axios from 'axios'; 
// import { UPDATE_PROFILE_ROUTE, UPDATE_IMAGE_ROUTE } from '../api/const'; 

// const Profile = () => {
//     const { userData, setUserData } = useAppContext();
//     const navigate = useNavigate();
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [profileImageFile, setProfileImageFile] = useState(null);
//     const [profileImagePreview, setProfileImagePreview] = useState('https://cdn-icons-png.flaticon.com/512/1828/1828919.png');
//     const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
//     const [isUpdatingImage, setIsUpdatingImage] = useState(false);
//     const [profileError, setProfileError] = useState('');
//     const [imageError, setImageError] = useState('');
//     const [profileSuccess, setProfileSuccess] = useState('');
//     const [imageSuccess, setImageSuccess] = useState('');

//     const revokePreviousBlobUrl = useCallback(() => {
//         if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
//             URL.revokeObjectURL(profileImagePreview);
//         }
//     }, [profileImagePreview]);

//     useEffect(() => {
//         if (userData && userData.user) {
//             setEmail(userData.user.email || '');
//             setUsername(userData.user.userName || '');
//             const newImageUrl = userData.user.userImg 
//                 ? `http://localhost:3000/${userData.user.userImg}` 
//                 : 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png'; 
            
//             if (profileImagePreview !== newImageUrl) {
//                 if (profileImagePreview.startsWith('blob:')) {
//                     URL.revokeObjectURL(profileImagePreview);
//                 }
//                 setProfileImagePreview(newImageUrl);
//             }
//         } else {
//             if (profileImagePreview !== 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png') {
//                 if (profileImagePreview.startsWith('blob:')) {
//                     URL.revokeObjectURL(profileImagePreview);
//                 }
//                 setProfileImagePreview('https://cdn-icons-png.flaticon.com/512/1828/1828919.png');
//             }
//         }

//         return () => {
//             if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
//                 URL.revokeObjectURL(profileImagePreview);
//             }
//         };
//     }, [userData, profileImagePreview]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setProfileImageFile(file);
//             revokePreviousBlobUrl();
//             const newBlobUrl = URL.createObjectURL(file);
//             setProfileImagePreview(newBlobUrl);
//             setImageError('');
//             setImageSuccess('');
//         }
//     };

//     const handleProfileSubmit = async (e) => {
//         e.preventDefault();
//         setIsUpdatingProfile(true);
//         setProfileError('');
//         setProfileSuccess('');

//         try {
//             const response = await axios.post(
//                 UPDATE_PROFILE_ROUTE,
//                 { userName: username },
//                 { withCredentials: true }
//             );

//             if (response.status === 200) {
//                 setProfileSuccess('Profile updated successfully!');
//                 setUserData(prevData => ({
//                     ...prevData,
//                     user: {
//                         ...prevData.user,
//                         userName: response.data.user.userName
//                     }
//                 }));
//             } else {
//                 setProfileError(response.data.message || 'Failed to update profile.');
//             }
//         } catch (error) {
//             setProfileError(error.response?.data?.message || 'Error updating profile.');
//         } finally {
//             setIsUpdatingProfile(false);
//         }
//     };

//     const handleImageUpload = async () => {
//         if (!profileImageFile) {
//             setImageError('Please select an image first.');
//             return;
//         }

//         setIsUpdatingImage(true);
//         setImageError('');
//         setImageSuccess('');

//         const formData = new FormData();
//         formData.append('profile-image', profileImageFile);

//         try {
//             const response = await axios.post(UPDATE_IMAGE_ROUTE, formData, {
//                 withCredentials: true,
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.status === 200) {
//                 setImageSuccess('Profile image updated successfully!');
//                 setUserData(prevData => {
//                     const updatedUser = {
//                         ...prevData.user,
//                         userImg: response.data.userImg
//                     };
//                     return { ...prevData, user: updatedUser };
//                 });
//                 revokePreviousBlobUrl();
//                 const newServerImageUrl = `http://localhost:3000/${response.data.userImg}`;
//                 setProfileImagePreview(newServerImageUrl);
//                 setProfileImageFile(null);
//             } else {
//                 setImageError(response.data.message || 'Failed to upload image.');
//             }
//         } catch (error) {
//             setImageError(error.response?.data?.message || 'Error uploading image.');
//         } finally {
//             setIsUpdatingImage(false);
//         }
//     };

//     return (
//         <div className='min-h-screen flex items-center justify-center bg-gray-900 '>
//             <div className='w-full max-w-4xl bg-indigo-900/20 rounded-lg shadow-lg px-8'>
//                 <div className='flex flex-col items-center space-y-6'>
//                     <label htmlFor="user_img" className='cursor-pointer rounded-full bg-zinc-800 flex items-center justify-center h-32 w-32 overflow-hidden border-2 border-indigo-500 hover:border-indigo-300 transition-shadow shadow-md hover:shadow-lg'>
//                         {profileImagePreview ? (
//                             <img src={profileImagePreview} alt="Profile Preview" className='h-full w-full object-cover' />
//                         ) : (
//                             <img src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" alt="Default Icon" className='h-16 w-16 object-contain' />
//                         )}
//                         <input
//                             type="file"
//                             id="user_img"
//                             accept="image/*"
//                             className='hidden'
//                             onChange={handleImageChange}
//                         />
//                     </label>
//                     <p className="text-white text-lg">Add Profile Image</p>
//                     <button onClick={handleImageUpload} disabled={!profileImageFile || isUpdatingImage} className='bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed'>
//                         {isUpdatingImage ? 'Uploading...' : 'Upload Image'}
//                     </button>
//                     {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
//                     {imageSuccess && <p className="text-green-500 text-sm mt-2">{imageSuccess}</p>}
//                     <form onSubmit={handleProfileSubmit} className="w-full space-y-6">
//                         <div className='flex flex-col w-full'>
//                             <label htmlFor="email" className='text-xl text-white mb-2'>Email</label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 readOnly
//                                 placeholder='Enter Email'
//                                 className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md cursor-not-allowed'
//                                 value={email}
//                             />
//                         </div>
//                         <div className='flex flex-col w-full'>
//                             <label htmlFor="userName" className='text-xl text-white mb-2'>UserName</label>
//                             <input
//                                 type="text"
//                                 id="userName"
//                                 value={username}
//                                 onChange={(e) => setUsername(e.target.value)}
//                                 placeholder='Enter UserName'
//                                 className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md'
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             disabled={isUpdatingProfile}
//                             className='w-full bg-white text-indigo-900 font-semibold py-2 rounded-md hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed'
//                         >
//                             {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
//                         </button>
//                         {profileError && <p className="text-red-500 text-sm mt-2">{profileError}</p>}
//                         {profileSuccess && <p className="text-green-500 text-sm mt-2">{profileSuccess}</p>}
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Profile;


import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import axios from 'axios';
import { UPDATE_PROFILE_ROUTE, UPDATE_IMAGE_ROUTE } from '../api/const';

const Profile = () => {
  const { userData, setUserData } = useAppContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('https://cdn-icons-png.flaticon.com/512/1828/1828919.png');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [imageError, setImageError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [imageSuccess, setImageSuccess] = useState('');

  const revokePreviousBlobUrl = useCallback(() => {
    if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(profileImagePreview);
    }
  }, [profileImagePreview]);

  useEffect(() => {
    if (userData && userData.user) {
      setEmail(userData.user.email || '');
      setUsername(userData.user.userName || '');
      const newImageUrl = userData.user.userImg
        ? `http://localhost:3000/${userData.user.userImg}`
        : 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png';

      if (profileImagePreview !== newImageUrl) {
        if (profileImagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(profileImagePreview);
        }
        setProfileImagePreview(newImageUrl);
      }
    } else {
      if (profileImagePreview !== 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png') {
        if (profileImagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(profileImagePreview);
        }
        setProfileImagePreview('https://cdn-icons-png.flaticon.com/512/1828/1828919.png');
      }
    }

    return () => {
      if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [userData, profileImagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      revokePreviousBlobUrl();
      const newBlobUrl = URL.createObjectURL(file);
      setProfileImagePreview(newBlobUrl);
      setImageError('');
      setImageSuccess('');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const response = await axios.post(
        UPDATE_PROFILE_ROUTE,
        { userName: username },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setProfileSuccess('Profile updated successfully!');
        setUserData(prevData => ({
          ...prevData,
          user: {
            ...prevData.user,
            userName: response.data.user.userName
          }
        }));
      } else {
        setProfileError(response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Error updating profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImageFile) {
      setImageError('Please select an image first.');
      return;
    }

    setIsUpdatingImage(true);
    setImageError('');
    setImageSuccess('');

    const formData = new FormData();
    formData.append('profile-image', profileImageFile);

    try {
      const response = await axios.post(UPDATE_IMAGE_ROUTE, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setImageSuccess('Profile image updated successfully!');
        setUserData(prevData => {
          const updatedUser = {
            ...prevData.user,
            userImg: response.data.userImg
          };
          return { ...prevData, user: updatedUser };
        });
        revokePreviousBlobUrl();
        const newServerImageUrl = `http://localhost:3000/${response.data.userImg}`;
        setProfileImagePreview(newServerImageUrl);
        setProfileImageFile(null);
      } else {
        setImageError(response.data.message || 'Failed to upload image.');
      }
    } catch (error) {
      setImageError(error.response?.data?.message || 'Error uploading image.');
    } finally {
      setIsUpdatingImage(false);
    }
  };

  return (
    <div className='bg-zinc-900 text-white min-h-screen flex flex-col'>

      {/* Top Navbar */}
      <div className='w-full h-[8vh] bg-indigo-950/10 flex items-center justify-center shadow-lg'>
        <nav className='flex gap-10'>
          <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200'>Home</Link>
          <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200'>About</Link>
          <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200'>Contact</Link>
        </nav>
      </div>

      <div className='flex flex-grow'>

        {/* Sidebar */}
        <div className='w-1/5 bg-indigo-900/10 p-6 shadow-xl'>
          <h1 className='text-4xl font-extrabold mb-6'>
            Welcome To <span className='text-indigo-400 hover:text-indigo-300'>QRA</span>
          </h1>
          <nav className='flex flex-col gap-5'>
            <Link to="/" className='text-xl text-gray-300 hover:text-indigo-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>Home</Link>
            <Link to="/profile" className='text-xl text-gray-300 hover:text-indigo-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>Profile</Link>
            <Link to="/post" className='text-xl text-gray-300 hover:text-indigo-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>Upload</Link>
            <Link to="/allposts" className='text-xl text-gray-300 hover:text-indigo-200 py-2 px-3 rounded-md hover:bg-indigo-800/20'>Posts</Link>
          </nav>
        </div>

        {/* Main Profile Form */}
        <div className='w-4/5 p-6'>
          <div className='w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8'>

            <div className='flex flex-col items-center space-y-4'>
              {/* Profile Image Upload */}
              <label htmlFor="user_img" className='cursor-pointer rounded-full bg-zinc-800 flex items-center justify-center h-32 w-32 overflow-hidden border-2 border-indigo-500 hover:border-indigo-300 shadow-md'>
                <img src={profileImagePreview} alt="Profile Preview" className='h-full w-full object-cover' />
                <input type="file" id="user_img" accept="image/*" className='hidden' onChange={handleImageChange} />
              </label>
              <p className="text-white text-lg">Add Profile Image</p>
              <button onClick={handleImageUpload} disabled={!profileImageFile || isUpdatingImage} className='bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50'>
                {isUpdatingImage ? 'Uploading...' : 'Upload Image'}
              </button>
              {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
              {imageSuccess && <p className="text-green-500 text-sm">{imageSuccess}</p>}
            </div>

            {/* Profile Info Form */}
            <form onSubmit={handleProfileSubmit} className='mt-8 space-y-6'>
              <div>
                <label htmlFor="email" className='block text-xl text-white mb-2'>Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className='w-full bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none shadow cursor-not-allowed'
                />
              </div>

              <div>
                <label htmlFor="userName" className='block text-xl text-white mb-2'>UserName</label>
                <input
                  type="text"
                  id="userName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='w-full bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow'
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className='w-full bg-white text-indigo-900 font-semibold py-2 rounded-md hover:bg-indigo-100 disabled:opacity-50'
              >
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </button>

              {profileError && <p className="text-red-500 text-sm">{profileError}</p>}
              {profileSuccess && <p className="text-green-500 text-sm">{profileSuccess}</p>}
            </form>

            {/* Validate Email Button */}
            <button
              onClick={() => {}}
              className='mt-6 w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700'
            >
              Validate Email
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
