import Avatar from "./Avatar";
import Logo from "./Logo";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserContext";
import axios from "axios";

const UsersSidebar = () => {
  const [offlinePeople, setOfflinePeople] = useState({})
  const {id, setId, setWs, setUsername, username, selectedUserId, onlinePeople,  setSelectedUserId} = useContext(UserContext);
  
  useEffect(() => {
    axios.get('/people')
    .then(res =>{
     const offlinePeopleArr = res.data
     .filter(p => !Object.keys(onlinePeople).includes(p._id))
     const offlinePeople = {};
     offlinePeopleArr.forEach(p =>{
      offlinePeople[p._id] = p;
     })
     setOfflinePeople(offlinePeople)
    // console.log(offlinePeopleArr)
    // console.log(offlinePeople)
    })
  }, [onlinePeople])
  
  onlinePeople[id] = 'You';

  const logout =()=>{
    axios.post('/logout').then(()=>{
      setWs(null)
      setId(null)
      setUsername(null)
    })
  }
  return (
    <div className={`flex flex-col bg-white sm:w-1/3 overflow-scroll ${selectedUserId ? 'w-1/3 scroll-p-72' : 'w-full'}`}>
      <div className="flex-grow">
        <Logo/>
        {Object.keys(onlinePeople).map(userId =>(
          <div key={userId} onClick={()=> setSelectedUserId(userId)}
          className={`border-b border-gray-100 py-2  flex items-center gap-2 relative ${userId === selectedUserId ? 'bg-blue-200' : ''}`}>
            <span  className={`absolute w-1 h-full ${userId === selectedUserId ? 'bg-blue-600' : ''}`}></span>
            <Avatar  online={true} userId={userId} userName={onlinePeople[userId]}/>
           <span className="text-gray-800 font-medium cursor-pointer">            {onlinePeople[userId]}
            </span>
          </div>
        ))}
        {Object.keys(offlinePeople).map(userId =>(
          <div key={userId} onClick={()=> setSelectedUserId(userId)}
           className={`border-b border-gray-100 py-2  flex items-center gap-2 relative ${userId === selectedUserId ? 'bg-blue-200' : ''}`}>
            <span  className={`absolute w-1 h-full ${userId === selectedUserId ? 'bg-blue-600' : ''}`}></span>
            <Avatar  online={false} userId={userId} userName={offlinePeople[userId].username}/>
           <span className="text-gray-800 font-medium cursor-pointer">            {offlinePeople[userId].username}
            </span>
          </div>
        ))}
        </div>
        <div className="flex justify-center flex-row">
          <span className="mr-2 text-sm text-grey-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
             <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {username}
          </span>
         <button onClick={logout} className="text-sm text-gray-500 bg-blue-100 py-1 px-2 rounded-sm border">logout</button>
        </div>
      </div>
  )
}


export default UsersSidebar