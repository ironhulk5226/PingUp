import React,{useState} from 'react'
import { dummyUserData } from '../assets/assets'
import { Loader2, Pencil } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../features/user/userSlice'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'


const ProfileModel = ({setShowEdit}) => {
    const user = useSelector((state)=>state.user.value);
    const [isLoading, setIsLoading] = useState(false);
    const [editForm , setEditForm] = useState({
        username:user.username,
        bio:user.bio,
        location:user.location,
        profile_picture:null,
        cover_photo:null,
        full_name:user.full_name,
    })
    const dispatch = useDispatch();
    const {getToken} = useAuth();

    const handleSaveProfile = async(e)=>{
       e.preventDefault();
       try {
        setIsLoading(true);
        const userData = new FormData();
        const {username,bio,location,profile_picture,cover_photo,full_name} = editForm;
        userData.append('username',username);
        userData.append('bio',bio);
        userData.append('location',location);
        userData.append('full_name',full_name);
        if(profile_picture){
            userData.append('profile',profile_picture);
        }
        if(cover_photo){
            userData.append('cover',cover_photo);
        }

        const token = await getToken();
        await dispatch(updateUser({userData:userData,token}));
        setShowEdit(false);
       } catch (error) {
        toast.error(error.message)
       } finally {
        setIsLoading(false);
       }
    }
    
  return (
    <div className='fixed inset-0 z-50 h-screen overflow-y-auto bg-black/50 p-4 flex items-center justify-center'>
        <div className='max-w-2xl w-full mx-auto my-8'>
            <div className='bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto'>
                <h1 className='text-2xl font-bold text-gray-900 mb-6'>
                    Edit Profile
                </h1>

                <form action="" onSubmit={handleSaveProfile} className='space-y-4'>

                {/* Profile Picture */}

                <div className='flex flex-col items-start gap-3'>
                    <label htmlFor="profile_picture" className='block text-sm font-medium text-gray-700 mb-1'>
                        Profile Picture

                        <input hidden type="file" accept='image/*' id='profile_picture'
                        onChange={(e)=>
                            setEditForm({...editForm,profile_picture:e.target.files[0]})
                        }
                        className='w-full p-3 border border-gray-200 rounded-lg'
                        
                        />

                        <div className='group/profile relative cursor-pointer'>
                            <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture): user.profile_picture} alt="" className='size-24 rounded-full object-cover mt-2'/>
                            <div className='absolute hidden group-hover/profile:flex inset-0 bg-black/40 rounded-full items-center justify-center'>
                                <Pencil className='w-5 h-5 text-white'/>
                            </div>
                        </div>

                    </label>
                </div>

                {/* Cover Photo */}
                <div className='flex flex-col items-start gap-3'>
                    <label htmlFor="cover_photo" className='block text-sm font-medium text-gray-700 mb-1'>
                        Cover Photo 
                         <input hidden type="file" accept='image/*' id='cover_photo'
                        onChange={(e)=>
                            setEditForm({...editForm,cover_photo:e.target.files[0]})
                        }
                        className='w-full p-3 border border-gray-200 rounded-lg'
                        
                        />
                        <div className='group/cover relative'>
                            <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo): user.cover_photo} alt="" 
                            className='w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2'
                            />

                            <div className='absolute hidden group-hover/cover:flex inset-0 bg-black/40 rounded-lg items-center justify-center'>
                                <Pencil className='size-5 text-white'/>

                            </div>

                        </div>

                        
                    </label>
                </div>

                <div>
                    <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>
                        Name
                    </label>
                    <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Enter Your Full Name' onChange={(e)=>setEditForm({...editForm, full_name:e.target.value})} value={editForm.full_name}
                    />
                </div>
                <div>
                    <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>
                        Username
                    </label>
                    <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Enter Your username' onChange={(e)=>setEditForm({...editForm, username:e.target.value})} value={editForm.username}
                    />
                </div>

                <div>
                    <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>
                        Bio
                    </label>
                    <textarea rows={3} className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Enter Your Bio' onChange={(e)=>setEditForm({...editForm, bio:e.target.value})} value={editForm.bio}
                    />
                </div>

                <div>
                    <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>
                        Location
                    </label>

                    <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Enter Your Location' onChange={(e)=>setEditForm({...editForm, location:e.target.value})} value={editForm.location}
                    />
                </div>
                {/* Buttons */}
                <div className='flex justify-end space-x-3 pt-6'>
                    <button type='button' onClick={()=>setShowEdit(false)} className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer' disabled={isLoading}>Cancel</button>
                    <button type='submit'
                    className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white hover:from-indigo-600 hover:to-purple-700 transition-colors cursor-pointer flex items-center justify-center gap-2'
                    disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                </div>


              </form>
            </div>
        </div>
        
    </div>
  )
}

export default ProfileModel