import { useState, useEffect } from "react";

const Avatar = ({ userId, userName, online }) => {
  const colors = [
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-red-200",
    "bg-yellow-200",
    "bg-orange-200",
    "bg-pink-200",
    "bg-fuchsia-200",
    "bg-rose-200",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];
   const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if(userName){
     setIsLoading(false)
    } 
    // console.log(userName)
  }, [userName]);

  if (isLoading) {
    return undefined;
  }

  return (
    <div className={`w-9 h-9 relative rounded-full flex items-center justify-center ml-6 ${color}`}>
      {userName[0]}
      {online && (
        <div className="absolute w-3 h-3 rounded-md bg-green-400 right-0 bottom-0 border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 rounded-md bg-gray-400 right-0 bottom-0 border border-white"></div>
      )}
    </div>
  );
};

export default Avatar;
