import React from 'react'
import { useState } from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { Search } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'


const Discover = () => {
  const  [input, setInput] = useState('')
  const  [users, setUsers] = useState(dummyConnectionsData)
  const  [isLoading, setIsLoading] = useState(false)

  const handleSearch = async(e)=>{
    if(e.key === 'Enter'){
      setUsers([])
      setIsLoading(true)
      setTimeout(() => {
        setUsers(dummyConnectionsData)
        setIsLoading(false)
      }, 1000);

    }
  }
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover</h1>
          <p className='text-slate-600'>Connect with amazing people and grow your Network</p>
        </div>

        {/* Search */}
        <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5'/>
              <input type="text" placeholder='Search people by name ,username bio, or location...' className='w-full pl-10 sm:pl-12 py-2 border border-gray-300 rounded-md max-sm:text-sm' onChange={(e)=>setInput(e.target.value)} onKeyDown={handleSearch} value={input}/>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {
            users.map((user)=>(
              <UserCard key={user._id} user={user}/>
            ))
          }

          {/* Loading */}
          {
            isLoading && <Loading height='60vh'/>
            
          }
        </div>
      </div>
    </div>
  )
}

export default Discover