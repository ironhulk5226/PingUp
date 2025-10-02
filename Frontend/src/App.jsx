import { Routes,Route, useLocation } from "react-router-dom"
import Login from "./pages/Login"
import Feed from "./pages/Feed"
import Messages from "./pages/Messages"
import Chatbox from "./pages/Chatbox"
import Connections from "./pages/Connections"
import Discover from "./pages/Discover"
import Profile from "./pages/Profile"
import CreatePost from "./pages/CreatePost"
import { useUser, useAuth } from "@clerk/clerk-react"
import Layout from "./pages/Layout"
import toast, { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchUser } from "./features/user/userSlice"
import { fetchConnections } from "./features/connections/connectionsSlice"
import { useRef } from "react"
import { addMessage } from "./features/messages/messagesSlice"
import Notification from "./components/Notification"
// index? meaning:
// When you go to / (the root URL):
// React will first load <Login />.

// Inside <Login />, React looks for child routes.
// Since you wrote <Route index element={<Feed />} />, that means:
// 👉 By default, show <Feed /> inside <Login />.
function App() {
  const {getToken} = useAuth();
  const {user} = useUser();
  const dispatch = useDispatch();
  const {pathname} = useLocation();
  const pathnameRef = useRef(pathname);


  useEffect(()=>{
     const fetchdata = async()=>{
      if(user){
      const token = await getToken()
      console.log("token", token)
      dispatch(fetchUser(token))
      dispatch(fetchConnections(token))
    }

  }
    fetchdata()
},[user , getToken , dispatch])

   useEffect(()=>{
    pathnameRef.current = pathname
   },[pathname])

   useEffect(() => {
  if (!user) return;

  let eventSource;

  const connectSSE = async () => {
    try {
      const token = await getToken();
      const sseUrl = `${import.meta.env.VITE_BASE_URL}/api/message/${user.id}?token=${token}`;
      console.log("Connecting to SSE:", sseUrl);

      eventSource = new EventSource(sseUrl);

      eventSource.onopen = (event) => {
        console.log("SSE Connection opened:", event);
      };

      eventSource.onmessage = (event) => {
        console.log("SSE Message received:", event.data);
        const message = JSON.parse(event.data);

        if (pathnameRef.current === `/messages/${message.from_user_id._id}`) {
          dispatch(addMessage(message));
        } else {
          // show toast/notification
        // t :- It represents the toast instance and gives you metadata + controls for that specific toast.
        // Some common properties of t:
        // t.id → unique ID of this toast
        // t.type → type ('success' | 'error' | 'loading' | 'blank')
        // t.visible → whether the toast is currently visible
        // t.height → height of the toast (used internally for animations)
        // t.ariaProps → ARIA attributes for accessibility
        // t.dismiss() / t.remove() → functions to close the toast programmatically
          toast.custom((t)=>(
            <Notification t={t} message={message}/>
          ),{position:"bottom-right"})
        }
      };

      eventSource.onerror = (event) => {
        console.error("SSE Error:", event);
        console.log("EventSource readyState:", eventSource.readyState);
      };
    } catch (error) {
      console.error("Failed to get token for SSE:", error);
    }
  };

  connectSSE();

  // ✅ cleanup
  return () => {
    if (eventSource) {
      console.log("Closing SSE connection");
      eventSource.close();
    }
  };
}, [user, dispatch, getToken]);


   


  return (
    <>
    {/* now we can use Toaster notifications in any file */}
    <Toaster/>
    <Routes>
       <Route path="/" element={!user?<Login/>:<Layout/>}>
          <Route index element={<Feed/>}/>
          <Route path="messages" element={<Messages/>}/>
          <Route path="messages/:userId" element={<Chatbox/>}/>
          <Route path="connections" element={<Connections/>}/>
          <Route path="discover" element={<Discover/>}/>
          <Route path="profile" element={<Profile/>}/>
          <Route path="profile/:profileId" element={<Profile/>}/>
          <Route path="create-post" element={<CreatePost/>}/>
       </Route>
    </Routes>

    </>
  )
}

export default App
