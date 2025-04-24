import clsx from "clsx";
import { ArrowRightLeft, Home, List, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"



const links = [{
    name : 'Home',
    href : '/dashboard',
    icon : Home
},
{
   name : 'Transfer',
    href : '/dashboard/transfer',
    icon: ArrowRightLeft 
},
{
    name : 'Transactions',
    href : '/dashboard/transactions',
    icon: List
},
{
    name : 'P2P Transfer',
    href : '/dashboard/p2ptransfer',
    icon: Users
},
]



export default function NavLinks() {

    const pathname = usePathname();

return(
   <>
   {links.map((link) => {
    return (
        <Link
        key={link.name}
        href={link.href}
        
        className={clsx(
            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
            {
              'bg-sky-100 text-blue-600' : pathname === link.href,
            } ,
        )}
        
        >
         {link.icon && <link.icon className="h-5 w-5" />}
            {link.name}
        </Link>
    )
   })}
   </>
)
}