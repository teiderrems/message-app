import { SearchUserDto } from "@/types";

interface UserSearchItemProps {
  user: SearchUserDto;
  handleClic:(userId:number,username?:string|null)=>void
}

const UserSearchItem = (props: UserSearchItemProps) => {
  const {user,handleClic} = props;

  return (
    <div
    onClick={()=>handleClic(user.id,user.email || user.username)}
      className={`h-14 hover:border text-black hover:border-gray-300 hover:cursor-pointer rounded-md flex px-1 py-3 items-center space-x-1`}
    >
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-lg font-semibold">{user.avatar}</span>
      </div>
      <div className="flex flex-col text-sm grow">
        <span className="font-bold self-start">{user.email || user.username}</span>
        <span className="items-center flex space-x-1">
          {user.isOnline ? (
            <span className=" w-2 h-2 rounded-full bg-green-400"></span>
          ) : (
            <span className=" w-2 h-2 rounded-full bg-gray-700"></span>
          )}
          <span className="text-xs">
            {user.isOnline ? "En ligne" : "Hors ligne"}
          </span>
        </span>
      </div>
    </div>
  )
}

export default UserSearchItem;
