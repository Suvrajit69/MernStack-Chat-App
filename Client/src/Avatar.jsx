
const Avatar = ({userId, userName}) => {
   const colors = ['bg-teal-200', 'bg-red-200',
   'bg-green-200', 'bg-purple-200',
   'bg-red-200', 'bg-yellow-200',
   'bg-orange-200', 'bg-pink-200', 'bg-fuchsia-200', 'bg-rose-200']
   const userIdBase10 = parseInt(userId, 16) 
   const colorIndex = userIdBase10 % colors.length;
   const color = colors[colorIndex]
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center ml-6 ${color}`}>
        {userName[0]}
    </div>
  )
}

export default Avatar