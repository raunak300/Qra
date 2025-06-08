import SignUpPage from './Pages/SignUpPage'
import LoginPage from './Pages/LoginPage'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import PostContent from './Pages/PostContent'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import { AppContext,useAppContext } from './context'
import { useState, useEffect } from 'react'
import { CHECK_ROUTE } from './api/const'
import { useNavigate } from 'react-router-dom'
import { GET_PROFILE_ROUTE } from './api/const'

 const AppProvider = ({ children }) => {
    const [isAuthenticated, setisAuthenticated] = useState(false);
    const [isLoadingAuth, setisLoadingAuth] = useState(true); 
    const [userData, setUserData] = useState(null);//Profile page time added
    const login = (data=null ) => { 
        setisAuthenticated(true);
        if (data) {
            setUserData(data); 
        }
    };

    const logout = () => {
        setisAuthenticated(false);
        setUserData(null);
        
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
               
                const response = await axios.post(CHECK_ROUTE, {}, { withCredentials: true }); 

                if (response.status === 200 && response.data.isValid) {
                    setisAuthenticated(true); 
                    try {
                        const profileResponse = await axios.get(GET_PROFILE_ROUTE, { withCredentials: true });
                        if (profileResponse.status === 200) {
                            setUserData(profileResponse.data); 
                            console.log("User profile data fetched and set on app load/refresh:", profileResponse.data);
                        } else {
                            console.error("Failed to fetch user profile during initial check:", profileResponse.data);
                            logout(); 
                        }
                    } catch (profileError) {
                        console.error("Error fetching user profile during initial check:", profileError.response?.data?.message || profileError.message);
                        logout(); 
                    }
                } else {
                    setisAuthenticated(false);
                    setUserData(null)
                }
            }catch (err) {
                if (err.response && err.response.status === 401) {
                    console.log("Authentication failed: No valid token/cookie found.");
                    logout(); 
                } else {
                    console.error("Error during auth check:", err.response?.data?.message || err.message);
                    setisAuthenticated(false); 
                    setUserData(null);
                }
            } finally {
                setisLoadingAuth(false); 
            }
        };
        checkAuthStatus();
    }, []); 

   
    const contextValue = { isAuthenticated, isLoadingAuth,userData ,login, logout,setUserData }; 

    return (
        
        <AppContext.Provider value={contextValue}>
            {children} {/* This will render the BrowserRouter and its Routes */}
        </AppContext.Provider>
    );
};
  

// const [isAuthenticated, setisAuthenticated] = useState(false)
  // const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  


  // const login = () => {
  //   // localStorage.setItem('token', token);
  //   setisAuthenticated(true);
  // };
  // const logout = () => {
  //   // localStorage.removeItem('token');
  //   setisAuthenticated(false);
    
  // }

  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     try {
  //       const response = await axios.post(CHECK_ROUTE, {}, { withCredentials: true });
  //       if (response.status === 200 && response.data.isValid) {
  //         setisAuthenticated(true);
  //       } else {
  //         setisAuthenticated(false);
  //       }
  //     } catch (err) {
  //       if (err.response && err.response.status === 401) {
  //         logout();
  //       } else {
  //         console.log("Error during auth check:", err);
  //       }
  //     } finally {
  //       setIsLoadingAuth(false);
  //     }
  //   };
  //   checkAuthStatus();
  // }, []);

// function App() {
  
  
 
  
//   return (
//     <>
//       <AppProvider value={{ isAuthenticated, login, logout }} >
//         <BrowserRouter>
//                 <div className="bg-zinc-900 min-h-screen w-full text-white">
//                     <Routes>
//                         {/* Public Routes */}
//                         <Route path="/signup" element={<SignUpPage />} />
//                         <Route path="/login" element={<LoginPage />} />

//                         {/* Protected Root Route: '/' is now your Home page, but it's protected */}
//                         {/* If unauthenticated, ProtectedRoute will redirect to /login */}
//                         <Route path="/" element={<ProtectedRoute component={Home} />} /> 

//                         {/* Other Protected Routes: Use the same ProtectedRoute helper */}
//                         <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
//                         <Route path="/post" element={<ProtectedRoute component={PostContent} />} />
                        
//                         {/* Catch-all Route: For any unmatched URL.
//                             This will send unauthenticated users to login,
//                             and authenticated users to the Home page (/).
//                         */}
//                         <Route path="*" element={<RedirectUnmatched />} /> 
//                     </Routes>
//                 </div>
//             </BrowserRouter>
//       </AppProvider>
//     </>
//   );
// }

function App() {
    return (
        // Render the custom AppProvider here.
        // It will provide the isAuthenticated, isLoadingAuth, login, logout values.
        <AppProvider>
            <BrowserRouter>
                <div className="bg-zinc-900 min-h-screen w-full text-white">
                    <Routes>
                        {/* Public Routes: Always accessible */}
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected Root Route: '/' is now your Home page, but it's protected */}
                        {/* If unauthenticated, ProtectedRoute will redirect to /login */}
                        <Route path="/" element={<ProtectedRoute component={Home} />} /> 

                        {/* Other Protected Routes: Use the same ProtectedRoute helper */}
                        <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
                        <Route path="/post" element={<ProtectedRoute component={PostContent} />} />
                        
                        {/* Catch-all Route: For any unmatched URL.
                            This will send unauthenticated users to login,
                            and authenticated users to the Home page (/).
                        */}
                        <Route path="*" element={<RedirectUnmatched />} /> 
                    </Routes>
                </div>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;

const RedirectUnmatched = () => {
    const { isAuthenticated, isLoadingAuth } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoadingAuth) { 
            if (isAuthenticated) {
                navigate('/', { replace: true }); 
            } else {
                navigate('/login', { replace: true }); 
            }
        }
    }, [isAuthenticated, isLoadingAuth, navigate]); 

    if (isLoadingAuth) {
        return <div className="text-center mt-20 text-xl">Loading...</div>;
    }
    return null;
};

// const ProtectedRoute = ({ component: Component }) => {
//     const { isAuthenticated, isLoadingAuth } = useAppContext();
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Only perform redirection if auth status is known AND user is NOT authenticated.
//         if ( !isAuthenticated) {
//             navigate('/login', { replace: true }); 
//         }
//     }, [isAuthenticated, navigate]); 


//     // Render the target Component ONLY if the user is authenticated.
//     // If not authenticated, the useEffect above will handle the redirect.
//     return isAuthenticated ? <Component /> : null;
// };


const ProtectedRoute = ({ component: Component }) => {
    const { isAuthenticated, isLoadingAuth } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        // *** IMPORTANT CHANGE ***: Add isLoadingAuth to the dependency array.
        // This ensures the redirect logic only runs AFTER authentication status is known.
        if (!isLoadingAuth && !isAuthenticated) { 
            navigate('/login', { replace: true }); 
        }
    }, [isAuthenticated, isLoadingAuth, navigate]); // Add isLoadingAuth to dependencies

    // Display loading state for protected routes.
    // This is shown while isLoadingAuth is true, preventing flicker.
    if (isLoadingAuth) { 
        return <div className="text-center mt-20 text-xl">Loading authentication...</div>;
    }

    return isAuthenticated ? <Component /> : null;
};