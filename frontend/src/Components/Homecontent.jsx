// Homecontent.jsx
import React from 'react'

const Homecontent = () => {
    return (
        <>
            <div className='w-2/3 bg-indigo-950/10 flex flex-col min-h-[300px] rounded-lg overflow-hidden'> 
                
               <div className='h-full w-full justify-center flex mt-3' >
                 <div className='h-[85%] w-[70%] flex items-center justify-center bg-gray-900'> 
                    <div className="w-full h-full flex items-center justify-center text-center">
                        Image here
                    </div>
                </div>
               </div>
                <div className='flex flex-col mt-5 ml-4 mb-5 gap-2 flex-grow'> 
                    <div className="text-xl font-semibold"> 
                        Title
                    </div>
                    <div className="text-base text-gray-300"> 
                        content
                    </div>
                </div>
            </div>
        </>
    )
}

export default Homecontent;