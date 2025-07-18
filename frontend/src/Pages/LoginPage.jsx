// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import ValidateSonner from '../Components/ValidateSonner'
// import { useState,useEffect } from 'react'
// import axiosInstance from '../utils/axiosconfig'
// import { LOGIN_ROUTE } from '../api/const'
// import { useAppContext } from '../context/Context'
// const LoginPage = () => {

//     const { isLoadingAuth, isAuthenticated, login } = useAppContext();
//     const navigate = useNavigate()
//     const [email, setemail] = useState("");
//     const [password, setpassword] = useState("")
//     const [loading, setloading] = useState(false)
//     const [error, seterror] = useState(null)

//     useEffect(() => {
//         if (!isLoadingAuth && isAuthenticated) {
//             navigate('/', { replace: true });
//         }
//     }, [isAuthenticated, isLoadingAuth, navigate]);



//     const handelSubmit = (async (e) => {
//         e.preventDefault();
//         seterror(null); // Clear previous errors
//         if (!email || !password) {
//             alert("fill in things first");
//             return;
//         }
//         console.log("backend link", import.meta.env.VITE_BACKEND_LINK)
//         setloading(true);
        
//         try {
//             const response = await axiosInstance.post(LOGIN_ROUTE, {
//                 email: email,
//                 password: password
//             },{withCredentials:true})
//             if (response.status === 200) {
//                 alert("login succesful")
//                 login(response.data.data);

//             }
//             else {
//                 alert("problem in login")
//                 seterror(response.data.message || "Login failed due to unexpected response.");
//             }
//         } catch (error) {
//             seterror(error.response?.data?.message || "An error occurred during login.");
//             console.error("Error on login frontend:", error.response?.data || error.message);
//         } finally {
//             setloading(false);
//         }

//     })
//     if (isLoadingAuth) {
//         return <div className="text-center mt-20 text-xl text-white">Checking login status...</div>;
//     }
//     return (
//         <div>
//             <div className='h-[100vh] w-full flex flex-col items-center justify-center bg-gray-900'>
//                 {/* <div className='absolute top-0 right-0 p-4'>
//                 <ValidateSonner />
//             </div> */}
//                 <div className='mt-2 p-10'>
//                     <h1 className='text-3xl text-white'>
//                         Welcome to <span className='text-indigo-500/70 hover:text-indigo-500/50'>QRA</span>
//                     </h1>
//                 </div>

//                 <div className='bg-indigo-900/30 h-[70vh] w-2/4 flex flex-col items-center justify-center rounded-xl p-8 '>
//                     <form className='w-full max-w-md space-y-6 '>
//                         <div className='flex flex-col'>
//                             <label htmlFor="email" className='text-xl text-white mb-2'>Email</label>
//                             <input //for email
//                                 type="email"
//                                 id="email"
//                                 placeholder='Enter Email'
//                                 className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
//                                 onChange={(e) => setemail(e.target.value)}
//                                 value={email} // Controlled component
//                                 required
//                             />
//                         </div>

//                         <div className='flex flex-col'>
//                             <label htmlFor="password" className='text-xl text-white mb-2'>Password</label>
//                             <input //for password
//                                 type="password"
//                                 id="password"
//                                 placeholder='Enter Password'
//                                 className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
//                                 onChange={(e) => setpassword(e.target.value)}
//                                 value={password} // Controlled component
//                                 required
//                             />
//                         </div>

//                         <button
//                             type="submit"
//                             className='w-full bg-white text-indigo-900 font-semibold py-2 rounded-md hover:bg-indigo-100 transition'
//                             disabled={loading} // Disable button when loading
//                             onClick={handelSubmit} // Handle form submission
//                         >
//                             {loading ? 'Logging in...' : 'Submit'}
//                         </button>
//                     </form>

//                     <div className='mt-6 text-white text-sm text-center'>
//                         <p>New User?</p>
//                         <button className='text-indigo-300 underline hover:text-indigo-100' onClick={() => navigate('/signup')} >SignUp</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default LoginPage

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosconfig';
import { LOGIN_ROUTE } from '../api/const';
import { useAppContext } from '../context/Context';

const LoginPage = () => {
    const { isLoadingAuth, isAuthenticated, login } = useAppContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoadingAuth && isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isLoadingAuth, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post(
                LOGIN_ROUTE,
                { email, password },
                { withCredentials: true }
            );

            if (response.status === 200) {
                alert("Login successful");
                login(response.data.data);
            } else {
                setError(response.data.message || "Login failed.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
            console.error("Login error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoadingAuth) {
        return <div className="text-center mt-20 text-xl text-white">Checking login status...</div>;
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-gray-800 px-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-xl shadow-xl p-8">
                <h1 className="text-3xl text-white text-center font-bold mb-6">
                    Welcome to <span className="text-indigo-400">QRA</span>
                </h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-white text-sm mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-white text-sm mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm text-center">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-md font-semibold transition ${
                            loading
                                ? 'bg-indigo-300 text-white cursor-not-allowed'
                                : 'bg-white text-indigo-900 hover:bg-indigo-100'
                        }`}
                    >
                        {loading ? 'Logging in...' : 'Submit'}
                    </button>
                </form>

                <div className="mt-6 text-white text-center text-sm">
                    <p>New User?</p>
                    <button
                        className="text-indigo-300 underline hover:text-indigo-100 mt-1"
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
