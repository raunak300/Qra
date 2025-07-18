// import React, { useState } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';
// //requirment from backend  ->> send data to backend 
// //name,email,backend on button submit click
// import axiosInstance from '../utils/axiosconfig';
// import { SIGNUP_ROUTE } from '../api/const';
// import { useEffect } from 'react';
// import { useAppContext } from '../context/Context';


// const SignUpPage = () => {
//     const navigate = useNavigate();
//     const [fullName, setfullName] = useState("")
//     const [email, setemail] = useState("")
//     const [password, setpassword] = useState("")
//     const [loading, setloading] = useState(false)
//     const [error, seterror] = useState(null)
   
//        const { isLoadingAuth, isAuthenticated, login } = useAppContext();


//    useEffect(() => {
//         if (!isLoadingAuth && isAuthenticated) {
//             navigate('/', { replace: true });
//         }
//     }, [isAuthenticated, isLoadingAuth, navigate]);



//     const handelSubmit=(async (e)=>{
//         e.preventDefault();
//         if (!fullName || !email || !password) {
//             seterror("Please fill in all fields.");
//             return;
//         }
//         console.log("backend link",import.meta.env.VITE_BACKEND_LINK)
//         setloading(true);
//         seterror(null);
//         try {
//             const response=await axiosInstance.post(SIGNUP_ROUTE,{
//                 fullName:fullName,
//                 email:email,
//                 password:password
//             },{withCredentials:true})
//             if(response.status===201){
//                 alert("signup Succesfull")
//                 login(response.data.user)
//                 // navigate("/home");
//             }else{
//                 alert("signup failed");

//             }
//         } catch (error) {
//             console.log("error at signup route frontend:",error);
//         }finally{
//             setloading(false);
//         }

//     })
//     // function check() {
//     //     console.log({
//     //         email: email,
//     //         password: password,
//     //         userName: fullName
//     //     })
//     // } =>> so this is working after checking
//     return (
//         <div className='h-[100vh] w-full flex flex-col items-center justify-center bg-gray-900'>
//             <div className='mt-2 p-10'>
//                 <h1 className='text-3xl text-white'>
//                     Welcome to <span className='text-indigo-500/70 hover:text-indigo-500/50'>QRA</span>
//                 </h1>
//             </div>

//             <div className='bg-indigo-900/30 h-[75vh] w-2/4 flex flex-col items-center justify-center rounded-xl p-8 '>
//                 <form className='w-full max-w-md space-y-6 '>
//                     <div className='flex flex-col'>
//                         <label htmlFor="name" className='text-xl text-white mb-2'>Name</label>
//                         <input //need name to send on backend
//                             type="text"
//                             id="name"
//                             placeholder='Enter Name'
//                             className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
//                             onChange={(e)=>setfullName(e.target.value)}
//                         />
//                     </div>

//                     <div className='flex flex-col'>
//                         <label htmlFor="email" className='text-xl text-white mb-2'>Email</label>
//                         <input //need email to send on backend
//                             type="email"
//                             id="email"
//                             placeholder='Enter Email'
//                             className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
//                             onChange={(e)=>setemail(e.target.value)}
//                         />
//                     </div>

//                     <div className='flex flex-col'>
//                         <label htmlFor="password" className='text-xl text-white mb-2'>Password</label>
//                         <input // need password to send on backend
//                             type="password"
//                             id="password"
//                             placeholder='Enter Password'
//                             className='bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
//                             onChange={(e)=>setpassword(e.target.value)}
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className='w-full bg-white text-indigo-900 font-semibold py-2 rounded-md hover:bg-indigo-100 transition'
//                         //on click must go to home page
//                         // must make isauthenticated true as token exist on signup and must move to home
//                         // onClick={
//                         //     check
//                         // }
//                         onClick={handelSubmit}
//                     >
//                          {loading ? 'Submitting...' : 'Submit'}
//                     </button>
//                 </form>

//                 <div className='mt-6 text-white text-sm text-center'>
//                     <p>Already have an account?</p>
//                     <button className='text-indigo-300 underline hover:text-indigo-100' onClick={() => navigate("/login")}>Login</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignUpPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosconfig';
import { SIGNUP_ROUTE } from '../api/const';
import { useAppContext } from '../context/Context';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { isLoadingAuth, isAuthenticated, login } = useAppContext();

    useEffect(() => {
        if (!isLoadingAuth && isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isLoadingAuth, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!fullName || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.post(
                SIGNUP_ROUTE,
                { fullName, email, password },
                { withCredentials: true }
            );
            if (response.status === 201) {
                alert("Signup successful");
                login(response.data.user);
            } else {
                alert("Signup failed");
            }
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Something went wrong.");
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
                        <label htmlFor="name" className="text-white text-sm mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            className="bg-zinc-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

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
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>

                <div className="mt-6 text-white text-center text-sm">
                    <p>Already have an account?</p>
                    <button
                        className="text-indigo-300 underline hover:text-indigo-100 mt-1"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
