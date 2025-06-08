import React from 'react';
import { useState, useEffect, useCallback } from 'react'; // useCallback hook imported for memoizing functions
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context'; // Import the useAppContext hook from your context file
import axios from 'axios'; // Axios for making HTTP requests
import { UPDATE_PROFILE_ROUTE, UPDATE_IMAGE_ROUTE } from '../api/const'; // API routes constants

const Profile = () => {
    // Destructure userData (user's current profile data) and setUserData (function to update user data) from context
    const { userData, setUserData } = useAppContext();
    // Hook to programmatically navigate to different routes
    const navigate = useNavigate();

    // --- State Variables for Component Logic and UI ---

    // 'username' state: Holds the user's username, initially an empty string.
    const [username, setUsername] = useState('');
    // 'email' state: Holds the user's email, initially an empty string. This field is read-only.
    const [email, setEmail] = useState('');
    // 'profileImageFile' state: Stores the actual File object selected by the user for upload.
    const [profileImageFile, setProfileImageFile] = useState(null);
    // 'profileImagePreview' state: Stores the URL for the image to be displayed in the UI.
    // It can be a default icon, a temporary 'blob:' URL for local preview, or the actual server URL of the uploaded image.
    const [profileImagePreview, setProfileImagePreview] = useState('https://cdn-icons-png.flaticon.com/512/1828/1828919.png');

    // States to manage loading indicators and display success/error messages to the user.
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); // True when username update is in progress
    const [isUpdatingImage, setIsUpdatingImage] = useState(false);     // True when image upload is in progress
    const [profileError, setProfileError] = useState('');              // Stores error message for profile updates
    const [imageError, setImageError] = useState('');                  // Stores error message for image uploads
    const [profileSuccess, setProfileSuccess] = useState('');          // Stores success message for profile updates
    const [imageSuccess, setImageSuccess] = useState('');              // Stores success message for image uploads

    // --- useCallback Hook for Memoized Function ---

    // `revokePreviousBlobUrl` function: This function is responsible for releasing (revoking)
    // temporary 'blob:' URLs created by `URL.createObjectURL()`. This is crucial for preventing
    // memory leaks in the browser.
    // `useCallback` is used to memoize this function, meaning it will only be re-created if
    // its dependencies change (in this case, `profileImagePreview`).
    const revokePreviousBlobUrl = useCallback(() => {
        // Only attempt to revoke if `profileImagePreview` exists and is a 'blob:' URL.
        if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
            console.log('Revoking previous blob URL:', profileImagePreview); // DEBUG: Log blob URL revocation
            URL.revokeObjectURL(profileImagePreview); // Inform the browser to release the memory for this URL.
        }
    }, [profileImagePreview]); // Dependency on profileImagePreview ensures it uses the latest value for cleanup.

    // --- useEffect Hook for Data Initialization and Cleanup ---

    // This effect runs when the component mounts and whenever `userData` changes.
    // Its primary roles are to:
    // 1. Populate the form fields with initial user data from context.
    // 2. Manage the `profileImagePreview` URL (setting it to saved image or default).
    // 3. Ensure cleanup of any 'blob:' URLs when the component unmounts or re-renders.
    useEffect(() => {
        console.log('--- useEffect Run ---'); // DEBUG: useEffect started
        console.log('Current userData:', userData); // DEBUG: Current userData from context

        // Check if `userData` and the nested `user` object (which holds the actual user details) exist.
        // The backend sends user data nested under a 'user' key.
        if (userData && userData.user) {
            // Set the email state from `userData.user.email`. Use '|| ''` for fallback to an empty string.
            setEmail(userData.user.email || '');
            // Set the username state from `userData.user.userName`. Note the capitalization ('userName').
            setUsername(userData.user.userName || '');

            // Determine the correct image URL to display:
            // If `userData.user.userImg` has a path (meaning an image is saved in the DB),
            // construct the full server URL (e.g., 'http://localhost:3000/uploads/my_image.png').
            // Otherwise, use the default placeholder image URL.
            const newImageUrl = userData.user.userImg 
                ? `http://localhost:3000/${userData.user.userImg}` 
                : 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png'; // Default icon URL
            
            console.log('UserImg from userData.user (on load):', userData.user.userImg); // DEBUG: UserImg path from context
            console.log('Calculated newImageUrl (on load):', newImageUrl); // DEBUG: The calculated URL

            // This is a crucial part for ensuring the image updates correctly on initial load/refresh.
            // Only update `profileImagePreview` if the `newImageUrl` is different from the current preview.
            // This prevents unnecessary state updates and potential infinite loops.
            if (profileImagePreview !== newImageUrl) {
                // Before setting a new image URL, if the current `profileImagePreview` is a temporary
                // 'blob:' URL, revoke it to free up browser memory. This addresses the "image disappears" issue.
                if (profileImagePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(profileImagePreview);
                }
                setProfileImagePreview(newImageUrl); // Update the state with the determined image URL.
                console.log('profileImagePreview changing from:', profileImagePreview, 'to:', newImageUrl); // DEBUG: Preview changing
                console.log('Old blob URL revoked in useEffect before new set.'); // DEBUG: Confirm revoke
            } else {
                console.log('profileImagePreview is already correct (on load):', profileImagePreview); // DEBUG: No change needed
            }
        } else {
            // If `userData` or `userData.user` is null/undefined (e.g., user is logged out or data not loaded),
            // ensure the preview falls back to the default image.
            console.log('userData or userData.user is null/undefined (on load).'); // DEBUG: No user data
            if (profileImagePreview !== 'https://cdn-icons-png.flaticon.com/512/1828/1828919.png') {
                // Also, revoke any existing 'blob:' URL if the user logs out or data is cleared.
                if (profileImagePreview.startsWith('blob:')) {
                    URL.revokeObjectURL(profileImagePreview); 
                    console.log('Old blob URL revoked in useEffect (no user) before new set.'); // DEBUG: Confirm revoke
                }
                setProfileImagePreview('https://cdn-icons-png.flaticon.com/512/1828/1828919.png');
            }
        }

        // Cleanup function for `useEffect`: This function runs when the component unmounts
        // or before the effect re-runs (if its dependencies change).
        return () => {
            console.log('--- useEffect Cleanup Run ---'); // DEBUG: Cleanup initiated
            // This ensures any active 'blob:' URL is revoked, preventing memory leaks over time.
            if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
                console.log('Revoking blob URL during cleanup:', profileImagePreview); // DEBUG: Cleanup log
                URL.revokeObjectURL(profileImagePreview);
            }
        };
    }, [userData]); // Effect dependency: Only re-run this effect when `userData` changes.

    // --- Event Handler: handleImageChange (for file input) ---

    // This function is called when the user selects a file from the file input (`<input type="file">`).
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file.
        if (file) {
            setProfileImageFile(file); // Store the actual File object in state for later upload.
            revokePreviousBlobUrl(); // Call the memoized cleanup function to revoke any previous temporary preview URL.
            // Create a temporary URL for the selected file using `URL.createObjectURL()`.
            // This allows the browser to display a preview of the local image instantly without uploading it yet.
            const newBlobUrl = URL.createObjectURL(file);
            setProfileImagePreview(newBlobUrl); 
            console.log('Image selected, new blob URL:', newBlobUrl); // DEBUG: Log new blob URL
            setImageError(''); // Clear any previous image-related error messages.
            setImageSuccess(''); // Clear any previous image-related success messages.
        }
    };

    // --- Event Handler: handleProfileSubmit (for username update form) ---

    // This function is called when the username update form is submitted.
    const handleProfileSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior (which would reload the page).
        setIsUpdatingProfile(true); // Set loading state to true.
        setProfileError(''); // Clear previous error messages.
        setProfileSuccess(''); // Clear previous success messages.

        try {
            // Make a POST request to the backend route for updating the profile.
            // Send the `username` in the request body. Ensure the key ('userName') matches backend expectation.
            // `withCredentials: true` is essential for sending cookies (like your auth token) with the request.
            const response = await axios.post(
                UPDATE_PROFILE_ROUTE,
                { userName: username }, // Send 'userName' (capital 'N') as expected by your backend
                { withCredentials: true }
            );

            if (response.status === 200) {
                setProfileSuccess('Profile updated successfully!');
                // Update the `userData` in the `AppContext` with the new username.
                // This ensures that other parts of your application also reflect the updated username.
                setUserData(prevData => ({ 
                    ...prevData, 
                    user: { 
                        ...prevData.user, // Spread existing properties of the 'user' object
                        userName: response.data.user.userName // Update the 'userName' property with the value from backend response
                    }
                })); 
                console.log("Profile update response:", response.data);
            } else {
                // If backend returns a non-200 status, display its message or a generic error.
                setProfileError(response.data.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error("Error updating profile:", error); // Log the detailed error to console for debugging.
            // Display a user-friendly error message.
            setProfileError(error.response?.data?.message || 'Error updating profile.');
        } finally {
            setIsUpdatingProfile(false); // Reset loading state regardless of success or failure.
        }
    };

    // --- Event Handler: handleImageUpload (for image upload button) ---

    // This function is called when the "Upload Image" button is clicked.
    const handleImageUpload = async () => {
        if (!profileImageFile) { // Check if a file has been selected before attempting upload.
            setImageError('Please select an image first.');
            return;
        }

        setIsUpdatingImage(true); // Set loading state to true.
        setImageError(''); // Clear previous error messages.
        setImageSuccess(''); // Clear previous success messages.

        // Create a `FormData` object. This is necessary for sending files (like images) via HTTP requests.
        const formData = new FormData();
        // Append the selected file to the FormData object.
        // The key 'profile-image' MUST match the field name used by your Multer middleware on the backend.
        formData.append('profile-image', profileImageFile);

        try {
            // Make a POST request to the backend route for image upload.
            const response = await axios.post(
                UPDATE_IMAGE_ROUTE,
                formData, // Send the FormData object containing the file.
                {
                    withCredentials: true, // Essential for sending cookies.
                    headers: {
                        'Content-Type': 'multipart/form-data', // Crucial header for file uploads.
                    },
                }
            );

            if (response.status === 200) {
                setImageSuccess('Profile image updated successfully!');
                console.log('Image upload success response data:', response.data); // DEBUG: Raw success response

                // Update the `userData` in the `AppContext` with the new image path received from the backend.
                // The backend returns 'userImg' directly in `response.data`.
                setUserData(prevData => {
                    const updatedUser = { 
                        ...prevData.user, 
                        userImg: response.data.userImg // Update the 'userImg' property in the nested 'user' object.
                    };
                    console.log('Updating Context with:', { ...prevData, user: updatedUser }); // DEBUG: Context update
                    return { ...prevData, user: updatedUser };
                });
                
                // CRITICAL FIXES FOR IMAGE DISPLAY AFTER UPLOAD:
                // 1. Revoke the temporary 'blob:' URL. This is important to free memory and prevent conflicts.
                revokePreviousBlobUrl(); 
                // 2. Explicitly update `profileImagePreview` with the full server URL of the newly uploaded image.
                // This ensures the image appears immediately after successful upload without requiring a page refresh.
                const newServerImageUrl = `http://localhost:3000/${response.data.userImg}`;
                setProfileImagePreview(newServerImageUrl); 
                console.log('Setting profileImagePreview to server URL (after upload):', newServerImageUrl); // DEBUG: Server URL set
                
                // Only clear the file input when the upload is successful.
                setProfileImageFile(null); 
            } else {
                setImageError(response.data.message || 'Failed to upload image.');
                // If upload fails, you might choose to keep the file selected or clear it based on UX preference.
                // For now, it keeps the file selected on error.
            }
        } catch (error) {
            console.error("Error uploading image:", error); // Log detailed error to console.
            // Display a user-friendly error message.
            setImageError(error.response?.data?.message || 'Error uploading image.');
        } finally {
            setIsUpdatingImage(false); // Reset loading state regardless of success or failure.
        }
    };

    // --- Component JSX (UI Rendering) ---

    return (
        <div className='h-[100vh] w-full flex flex-col items-center justify-center bg-gray-900'>
            <div className='h-[90vh] w-3/5 bg-indigo-900/20 rounded-lg shadow-lg p-6'>
                <div className='w-full flex flex-col items-center justify-center space-y-6'>
                    {/* Profile Image Display and Upload Area */}
                    <label
                        htmlFor="user_img" // Connects label to the hidden file input
                        className='cursor-pointer rounded-full bg-zinc-800 flex items-center justify-center h-32 w-32 overflow-hidden border-2 border-indigo-500 hover:border-indigo-300 transition-shadow shadow-md hover:shadow-lg'
                        title="Click to upload image"
                    >
                        {/* Conditional rendering for image: Show profile image if available, else show default icon */}
                        {profileImagePreview ? (
                            <img
                                src={profileImagePreview} // The URL to display (from state)
                                alt="Profile Preview"     // Alt text for accessibility and when image fails to load
                                className='h-full w-full object-cover' // Tailwind classes to make image fill the circular container
                            />
                        ) : (
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png" // Default icon if no image is set
                                alt="Default Icon"
                                className='h-16 w-16 object-contain'
                            />
                        )}
                        {/* Hidden file input: This is the actual input element, hidden by CSS */}
                        <input
                            type="file"
                            id="user_img" // ID connects to the label's htmlFor
                            accept="image/*" // Only allows image files
                            className='hidden' // Hides the default file input button
                            onChange={handleImageChange} // Calls handler when a file is selected
                        />
                    </label>
                    <p className="text-white text-lg">Add Profile Image</p> {/* Text below the image upload area */}

                    {/* Image Upload Button and Status Messages */}
                    <button
                        onClick={handleImageUpload} // Calls handler when button is clicked
                        disabled={!profileImageFile || isUpdatingImage} // Button is disabled if no file is selected or upload is in progress
                        className='bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isUpdatingImage ? 'Uploading...' : 'Upload Image'} {/* Button text changes during upload */}
                    </button>
                    {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}     {/* Displays image upload error */}
                    {imageSuccess && <p className="text-green-500 text-sm mt-2">{imageSuccess}</p>} {/* Displays image upload success */}


                    {/* Profile Data Update Form (for Username) */}
                    <form onSubmit={handleProfileSubmit} className="w-full space-y-6">
                        {/* Email Input Field */}
                        <div className='flex flex-col w-full'>
                            <label htmlFor="email" className='text-xl text-white mb-2'>Email</label>
                            <input
                                type="email"
                                id="email"
                                readOnly // Email field is read-only
                                placeholder='Enter Email'
                                className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md cursor-not-allowed'
                                value={email} // Controlled component: value comes from 'email' state
                            />
                        </div>

                        {/* UserName Input Field */}
                        <div className='flex flex-col w-full'>
                            <label htmlFor="userName" className='text-xl text-white mb-2'>UserName</label>
                            <input
                                type="text"
                                id="userName"
                                value={username} // Controlled component: value comes from 'username' state
                                onChange={(e) => setUsername(e.target.value)} // Updates 'username' state on input change
                                placeholder='Enter UserName'
                                className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md'
                            />
                        </div>

                        {/* Submit Button for Profile Data */}
                        <button
                            type="submit"
                            disabled={isUpdatingProfile} // Button is disabled if update is in progress
                            className='w-full bg-white text-indigo-900 font-semibold py-2 rounded-md hover:bg-indigo-100 transition disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isUpdatingProfile ? 'Updating...' : 'Update Profile'} {/* Button text changes during update */}
                        </button>
                        {profileError && <p className="text-red-500 text-sm mt-2">{profileError}</p>}     {/* Displays profile update error */}
                        {profileSuccess && <p className="text-green-500 text-sm mt-2">{profileSuccess}</p>} {/* Displays profile update success */}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;
