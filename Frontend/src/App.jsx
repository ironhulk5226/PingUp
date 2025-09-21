import { Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import Feed from "./pages/Feed"
import Messages from "./pages/Messages"
import Chatbox from "./pages/Chatbox"
import Connections from "./pages/Connections"
import Discover from "./pages/Discover"
import Profile from "./pages/Profile"
import CreatePost from "./pages/CreatePost"
import { useUser } from "@clerk/clerk-react"
import Layout from "./pages/Layout"
import { Toaster } from "react-hot-toast"
// index? meaning:
// When you go to / (the root URL):
// React will first load <Login />.

// Inside <Login />, React looks for child routes.
// Since you wrote <Route index element={<Feed />} />, that means:
// 👉 By default, show <Feed /> inside <Login />.
function App() {
  const {user} = useUser();
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
