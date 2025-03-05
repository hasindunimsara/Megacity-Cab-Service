import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../libs/hooks/UseAuth';
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { USER_ROLES } from '../../../libs/constants/roles';
import { FaRoute } from "react-icons/fa";
import { IoMdBus } from "react-icons/io";
import fetchWithAuth from '../../../libs/configs/fetchWithAuth';
import { TbBrandBooking } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { MdEmojiPeople } from "react-icons/md";
import { TbBusStop } from "react-icons/tb";

function SideBar() {
    const { auth, setAuth } = useAuth()
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Notify the backend to invalidate the refresh token
            await fetchWithAuth('/auth/logout', {
                method: 'POST',
                "Authorization": `Bearer ${auth.accessToken}`,
                credentials: 'include', // Ensure cookies are sent
            });

            // Clear local storage and auth state
            localStorage.removeItem('auth');
            setAuth(null)

            // Redirect to the login page
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const menuItems = [
        { to: '/dashboard', label: 'Dashboard', icon: <MdOutlineDashboard className="mr-2" />, roles: [USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.OPERATOR] },
        { to: '/dashboard/seat_reservation', label: 'Seat Reservation', icon: <FaRegFileAlt className="mr-2" />, roles: [USER_ROLES.USER] },
        { to: '/dashboard/my_bookings', label: 'My Bookings', icon: <FaRegFileAlt className="mr-2" />, roles: [USER_ROLES.USER] },
        { to: '/dashboard/user_management', label: 'User Management', icon: <FaUserCog className="mr-2" />, roles: [USER_ROLES.ADMIN] },
        { to: '/dashboard/car_management', label: 'Car Management', icon: <FaCarSide className="mr-2" />, roles: [USER_ROLES.ADMIN] },
        { to: '/dashboard/driver_management', label: 'Driver Management', icon: <IoMdBus className="mr-2" />, roles: [USER_ROLES.ADMIN] },
        { to: '/dashboard/customer_bookings', label: 'Customer Bookings', icon: <TbBrandBooking className="mr-2" />, roles: [USER_ROLES.ADMIN] },
        { to: '/dashboard/all_payments', label: 'All Payments', icon: <MdOutlinePayments className="mr-2" />, roles: [USER_ROLES.ADMIN] },
        { to: '/dashboard/all_operators', label: 'All Operators', icon: <MdEmojiPeople className="mr-2" />, roles: [USER_ROLES.ADMIN] },
        { to: '/dashboard/trip_management', label: 'All Trips', icon: <TbBusStop className="mr-2" />, roles: [USER_ROLES.OPERATOR] },
        { to: '/dashboard/bookings', label: 'All Bookings', icon: <TbBrandBooking className="mr-2" />, roles: [USER_ROLES.OPERATOR] },
        // { to: '/dashboard/settings', label: 'Settings', icon: <MdOutlineSettings className="mr-2" />, roles: [USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.OPERATOR] },
    ];

    return (
        <div className="p-2 bg-white w-[400px] flex flex-col md:flex border-r-[0.5px] border-gray-300" id="sideNav">
            <nav>
                {menuItems
                    .filter(item => item.roles.includes(auth?.userRole)) // Render items allowed for the user's role
                    .map((item, index) => (
                        <Link
                            key={index}
                            to={item.to}
                            className="flex items-center text-black py-2.5 px-4 my-4 rounded transition duration-200 hover:font-bold text-lg"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
            </nav>
            <Link
                onClick={handleLogout}
                className="flex items-center text-black py-2.5 px-4 my-4 rounded transition duration-200 hover:font-bold text-lg"
            >
                <MdLogout className="mr-2" />
                Log Out
            </Link>
            <div className="absolute bottom-0 w-full">
                <p className="mb-1 px-5 py-3 text-left text-xs blue-700">
                    Copyright NIBM@{new Date().getFullYear()}
                </p>
            </div>
        </div>
    )
}

export default SideBar