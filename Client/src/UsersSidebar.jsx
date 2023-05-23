import Avatar from "./Avatar";
import Logo from "./Logo";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

const UsersSidebar = () => {
   const {id, selectedUserId, onlinePeople,  setSelectedUserId, } = useContext(UserContext);
  

  
  onlinePeople[id] = 'You';


  return (
    <div className={`bg-white sm:w-1/3 ${selectedUserId ? 'w-1/3 scroll-p-72' : 'w-full'}`}>
        <Logo/>
        {Object.keys(onlinePeople).map(userId =>(
          <div key={userId} onClick={()=> setSelectedUserId(userId)}
           className={`border-b border-gray-100 py-2  flex items-center gap-2 relative ${userId === selectedUserId ? 'bg-blue-200' : ''}`}>
            <span  className={`absolute w-1 h-full ${userId === selectedUserId ? 'bg-blue-600' : ''}`}></span>
            <Avatar  userId={userId} userName={onlinePeople[userId]}/>
           <span className="text-gray-800 font-medium cursor-pointer">            {onlinePeople[userId]}
            </span>
          </div>
        ))}
      </div>
  )
}

export default UsersSidebar