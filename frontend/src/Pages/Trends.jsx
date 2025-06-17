



import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import Homecontent from '../Components/Homecontent';
import axiosInstance from '../utils/axiosconfig';
import { TRENDS_POSTS, LOGOUT, HANDEL_TRENDS } from '../api/const';

const Trends = () => {
  const { logout, userData } = useAppContext();
  const isAdmin = userData?.user?._id === import.meta.env.VITE_ADMIN_ID;
  const navigate = useNavigate();

  const [trendPosts, setTrendPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(TRENDS_POSTS, { withCredentials: true });
        if (response.status === 200) {
          setTrendPosts(response.data.posts);
        } else {
          setError('Failed to fetch trend posts.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching trends.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [isAdmin, navigate]);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get(LOGOUT);
      if (response.status === 200) {
        logout();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const postsToSend = trendPosts.map(p => ({
        heading: p.title || 'No title',
        content: p.textContent || 'No content',
        Likes: p.Likes || 0
      }));
      console.log("Sending prompt to Gemini:\n", prompt);

      const response = await axiosInstance.post(HANDEL_TRENDS, {
        posts: postsToSend,
      });
      if (response.status === 200) {
        const insights = response.data.insights;
        const bulletPoints = insights.split('\n').filter(Boolean);
        setAnalysisResult(bulletPoints);
      } else {
        setAnalysisResult(['Failed to get analysis.']);
      }
    } catch (err) {
      setAnalysisResult(['Error analyzing trends.']);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className='bg-zinc-900 text-white h-screen flex flex-col'>

      {/* Top Nav */}
      <div className='w-full h-[8vh] bg-indigo-950/10 flex items-center justify-center shadow-lg'>
        <nav className='flex gap-10'>
          <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200'>Home</Link>
          <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200'>About</Link>
          <Link to="/" className='text-lg font-semibold text-gray-300 hover:text-indigo-200'>Contact</Link>
        </nav>
      </div>

      {/* Sidebar + Content */}
      <div className='flex flex-grow h-[92vh]'>

        {/* Sidebar */}
        <div className='w-1/5 bg-indigo-900/10 text-white p-6 flex flex-col justify-between shadow-xl'>
          <div className='flex flex-col gap-8'>
            <h1 className='text-4xl font-extrabold text-white mb-6'>
              Welcome To <span className='text-indigo-400 hover:text-indigo-300'>QRA</span>
            </h1>
            <nav className='flex flex-col gap-5'>
              <Link to="/profile" className='text-xl font-medium text-gray-300 hover:text-indigo-200'>Profile</Link>
              <Link to="/post" className='text-xl font-medium text-gray-300 hover:text-indigo-200'>Upload</Link>
              <Link to="/allposts" className='text-xl font-medium text-gray-300 hover:text-indigo-200'>Posts</Link>
              {isAdmin && <Link to="/trends" className='text-xl font-medium text-indigo-300'>Trends</Link>}
            </nav>
          </div>
          <button onClick={handleLogout} className='text-xl font-semibold text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-800/30 py-2 rounded-md'>Logout</button>
        </div>

        {/* Content Area */}
        <div className='w-4/5 p-6 overflow-y-auto max-h-[92vh] flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-3xl font-bold text-indigo-300'>Trending Posts</h2>
            <button
              onClick={handleAnalyze}
              className='text-sm px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white shadow'
              disabled={analyzing}
            >
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {/* Analysis Box */}
          {analysisResult && (
            <div className='bg-indigo-950/30 p-4 rounded-lg border border-indigo-500 mt-4'>
              <h3 className='text-xl font-semibold mb-2 text-indigo-200'>🧠 Trend Insights:</h3>
              <ul className='list-disc pl-5 space-y-1 text-indigo-100'>
                {analysisResult.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {loading && <div className="text-xl text-indigo-300 text-center">Loading trending posts...</div>}
          {error && <div className="text-xl text-red-500 text-center">Error: {error}</div>}
          {!loading && trendPosts.length === 0 && !error && (
            <div className="text-xl text-gray-400 text-center">No trends found.</div>
          )}

          {trendPosts.map(post => (
            <Homecontent key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trends;
