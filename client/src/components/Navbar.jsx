import Logo from '../assets/finlogo.png'
import { CiMenuBurger } from "react-icons/ci";
import { IoIosAddCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { RiGalleryView } from "react-icons/ri";
import { TiDocumentDelete } from "react-icons/ti";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from 'react';

export const Navbar = ({onAddIncomeClick, onAddExpenseClick, onDeleteExpenseClick, onEditExpenseClick }) => {

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [loggedInUser, setLoggedInUser] = useState(storedUser);
  const [userName, setUserName] = useState("");

   useEffect(() => {
    if (loggedInUser?.username) setUserName(loggedInUser.username);
  }, [loggedInUser?.username]);
  const handleLogout = () => {

  localStorage.removeItem("user_id");

  window.location.href = "/login"; 
};
  return (
    <div className='w-screen h-screen bg-[#FFF8D4] flex flex-row'>
    <div className="bg-[#313647] w-50 h-screen">

    <div className='pt-6 flex flex-row justify-between align-bottom items-center'>
        <img src={Logo} alt="" className='h-10 w-10 rounded-full ml-6 '/>
        {/* <CiMenuBurger className='flex mr-8 text-2xl  text-[#FFF8D4]'/> */}
        
    </div>  

    <div className='mt-6 ml-4 '>
      <p className='text-gray-300 text-[14px] mb-4'>Profile</p>
      <p className='text-[#FFF8D4]'>Hello, {loggedInUser?.username}</p>
    </div>
    <div className='mt-10 ml-4'>
      <p className='text-gray-300 text-[14px]'>Pages</p>
       <div className='flex mt-4 justify-between'>
          <ul className='text-[#FFF8D4] text-[16px]'>
             <Link to= '/mainpage'>
            <li className='py-3 flex flex-row items-center gap-2' > <IoHomeOutline className='text-xl' /> Home Page</li>
            </Link>
            <Link to= '/dashboard'>
            <li className='py-3 flex flex-row items-center gap-2' > <MdOutlineSpaceDashboard className='text-xl' /> Dashboard</li>
            </Link>
           
          </ul>
        </div>
    </div>
    <div className='mt-10 ml-4'>
        <p className='text-gray-300 text-[14px]'>General</p>

        <div className='flex mt-4 justify-between'>
          <ul className='text-[#FFF8D4] text-[16px]'>
            <li className='py-3 flex flex-row items-center gap-2 cursor-pointer ' onClick={onAddIncomeClick}><IoMdAdd className=' text-xl cursor-pointer' />Add Income</li>
            <li className='py-3 flex flex-row items-center gap-2 cursor-pointer' onClick={onAddExpenseClick}  > <IoIosAddCircle className=' text-xl cursor-pointer' /> Add Expense</li>
            {/* <li className='py-3 flex flex-row items-center gap-2 cursor-pointer' onClick={onEditExpenseClick} > <FaRegEdit className='text-xl cursor-pointer' />Edit Expense</li> */}
            <li className='py-3 flex flex-row items-center gap-2 cursor-pointer' onClick={onDeleteExpenseClick} > <TiDocumentDelete className='text-xl cursor-pointer' /> Delete Expense </li>
            <Link to= '/alltransaction'>
            <li className='py-3 flex flex-row items-center gap-2'> <RiGalleryView className='text-xl' />All Transaction</li>
            </Link>
          </ul>
        </div>
    </div> 

    

     <div className='mt-14 ml-4 flex flex-row gap-2'>
      <p className='text-[#FFF8D4] text-[16px] hover:text-red-800 cursor-pointer' onClick={handleLogout} >Logout</p>
      <IoLogOutOutline className='text-2xl text-[#FFF8D4] hover:text-red-800 '/>
     </div>
    
    </div>
    </div>
  )
}

export default Navbar