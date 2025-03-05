import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../libs/hooks/UseAuth';
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { USER_ROLES } from '../../../libs/constants/roles';
import { IoMdBus } from "react-icons/io";
import fetchWithAuth from '../../../libs/configs/fetchWithAuth';
import { TbBrandBooking } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { TbBusStop } from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast"; // Added Toaster import

function SideBar() {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetchWithAuth('/auth/signout', {
                method: 'POST',
                headers: { "Authorization": `Bearer ${auth.accessToken}` },
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message || 'Log out successful!'); // Display the message from the response
                localStorage.removeItem('auth');
                setAuth(null);
                navigate('/'); // Navigate to root "/"
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            toast.error('Failed to sign out. Please try again.');
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
        { to: '/dashboard/all_payments', label: 'All Reports', icon: <MdOutlinePayments className="mr-2" />, roles: [USER_ROLES.ADMIN] },
        { to: '/dashboard/trip_management', label: 'All Trips', icon: <TbBusStop className="mr-2" />, roles: [USER_ROLES.OPERATOR] },
        { to: '/dashboard/bookings', label: 'All Bookings', icon: <TbBrandBooking className="mr-2" />, roles: [USER_ROLES.OPERATOR] },
    ];

    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-300 flex flex-col p-4 z-10">
            <Toaster /> {/* Added Toaster component for notifications */}
            <nav className="flex-1 overflow-y-auto">
                {menuItems
                    .filter(item => item.roles.includes(auth?.userRole))
                    .map((item, index) => (
                        <Link
                            key={index}
                            to={item.to}
                            className="flex items-center text-black py-2.5 px-4 my-2 rounded transition duration-200 hover:font-bold hover:bg-gray-100 text-lg"
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
            </nav>
            <Link
                onClick={handleLogout}
                className="flex items-center text-black py-2.5 px-4 my-2 rounded transition duration-200 hover:font-bold hover:bg-gray-100 text-lg"
            >
                <MdLogout className="mr-2" />
                Log Out
            </Link>
            <div className="mt-auto">
                <p className="text-xs text-gray-500 px-4 py-2">
                    Copyright ICBT@{new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}

export default SideBar;