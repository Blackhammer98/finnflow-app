
import NavLinks from "./nav-links";


export default function SideNav() {
return (
    <div className=" flex  h-full flex-col px-3 py-4 md:px-2">
         <div className="w-32 text-dark md:w-40">
         FinFlow
        </div>
      <div className="flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2">
      <NavLinks/>
      </div>
   </div>
) 
}