import React, { useState, useEffect } from 'react';
import useAuth from '../../../../libs/hooks/UseAuth';
import { getGreetingMessage } from '../../../../libs/helpers/greeting';
import SiderLayout from '../../../../libs/components/Sider';
import fetchWithAuth from '../../../../libs/configs/fetchWithAuth';


function CommuterComponent() {
    const { auth } = useAuth()
    const [availableAllRoutes, setAvailableAllRoutes] = useState([]);
    const [allBookingRoutes, setAllBookingRoutes] = useState([]);
    const [allTrips, setAllTrips] = useState([]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [routeData, setRouteData] = useState(null);
    const greeting = getGreetingMessage();

    useEffect(() => {
        const fetchAllAvailableRoutes = async () => {
            try {
                const response = await fetchWithAuth(`/commuter/routes`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.accessToken}`
                    },
                    redirect: "follow"
                });
                if (response.ok) {
                    const result = await response.json();
                    setAvailableAllRoutes(result);
                } else {
                    console.error('Failed to fetch routes');
                }
            } catch (error) {
                console.error('Error fetching routes:', error);
            }
        };

        const fetchAllBookingRoutes = async () => {
            try {
                const response = await fetchWithAuth(`/commuter/bookings`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.accessToken}`
                    },
                    redirect: "follow"
                });
                if (response.ok) {
                    const result = await response.json();
                    setAllBookingRoutes(result);
                } else {
                    console.error('Failed to fetch all bookings');
                }
            } catch (error) {
                console.error('Error fetching all bookings:', error);
            }
        };

        const fetchAllTrips = async () => {
            try {
                const response = await fetchWithAuth(`/commuter/trips`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${auth.accessToken}`
                    },
                    redirect: "follow"
                });
                if (response.ok) {
                    const result = await response.json();
                    setAllTrips(result);
                } else {
                    console.error('Failed to fetch trips');
                }
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };


        fetchAllTrips();
        fetchAllBookingRoutes();
        fetchAllAvailableRoutes();
    }, []);

    const openSiderWithSetData = (isOpen, data) => {
        setIsSidebarOpen(isOpen)
        setRouteData(data)
    }

    return (
        <div className="ml-64 mt-16 p-6 overflow-y-auto h-screen">
            <div className="mb-10 w-4/5">
                <h1 className="text-2xl mb-4 font-semibold capitalize">Hello, {greeting} !!</h1>
                <p className='text-lg font-normal'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi aperiam non consequuntur quaerat hic eius voluptatum omnis, animi odit neque.</p>
            </div>
            <div className="flex w-full">
                {/* Left Section */}
                <div className="w-3/5">
                    <div className="grid grid-cols-2 gap-4 w-auto">
                        {/* Available Routes Card */}
                        <div className="flex-grow flex flex-col p-10 border border-gray-300 rounded-md">
                            <h1 className="text-4xl font-bold">{availableAllRoutes.length}</h1>
                            <div className="pt-5 text-base font-semibold leading-7">
                                <p>
                                    <a
                                        href="#"
                                        className="text-sky-500 transition-all duration-300 group-hover:font-bold"
                                    >
                                        Available Routes
                                    </a>
                                </p>
                            </div>
                            <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:font-bold">
                                <p>Perfect for learning how the framework works</p>
                            </div>
                        </div>

                        {/* All Booking Routes Card */}
                        <div className="flex-grow flex flex-col p-10 border border-gray-300 rounded-md">
                            <h1 className="text-4xl font-bold">{allBookingRoutes.length}</h1>
                            <div className="pt-5 text-base font-semibold leading-7">
                                <p>
                                    <a
                                        href="#"
                                        className="text-sky-500 transition-all duration-300 group-hover:font-bold"
                                    >
                                        All Booking Routes
                                    </a>
                                </p>
                            </div>
                            <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:font-bold">
                                <p>Perfect for learning how the framework works</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="relative overflow-x-auto w-auto mt-10">
                        <div className="mb-5">
                            <h1 className="text-xl font-semibold">All Available Routes</h1>
                        </div>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Route Name</th>
                                    <th scope="col" className="px-6 py-3">Start Point</th>
                                    <th scope="col" className="px-6 py-3">End Point</th>
                                    <th scope="col" className="px-6 py-3">Schedules</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availableAllRoutes.map(route => (
                                    <tr
                                        key={route._id}
                                        className="bg-white border-b cursor-pointer"
                                        onClick={() => openSiderWithSetData(true, route)}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap">
                                            {route.name}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-600">{route.startPoint}</td>
                                        <td className="px-6 py-4 font-medium text-gray-600">{route.endPoint}</td>
                                        <td className="px-6 py-4 font-medium text-gray-600">
                                            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                                                <span className="font-semibold">{route.schedule.day}:</span>
                                                <span> {route.schedule.time}</span>
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-[800px] flex border border-gray-300 rounded-md px-10 mx-10 h-[650px]">
                    <div className="relative overflow-x-auto w-full mt-10">
                        <div className="mb-5">
                            <h1 className="text-xl font-semibold">All Available Trips</h1>
                        </div>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-none">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Route Name</th>
                                    <th scope="col" className="px-6 py-3">Bus Number</th>
                                    <th scope="col" className="px-6 py-3">Capacity</th>
                                    <th scope="col" className="px-6 py-3">Available Seats</th>
                                    <th scope="col" className="px-6 py-3">Ticket Price</th>
                                </tr>
                            </thead>
                            <tbody >
                                {allTrips.map(trip => (
                                    <tr
                                        key={trip._id}
                                        className="bg-white cursor-pointer border-b border-gray-100"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap">
                                            {trip.route.name}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-600">{trip.bus.busNumber}</td>
                                        <td className="px-6 py-4 font-medium text-gray-600">{trip.bus.capacity}</td>
                                        <td className="px-6 py-4 font-medium text-gray-600">{trip.availableSeats } </td>
                                        <td className="px-6 py-4 font-medium text-gray-600">{trip.ticket_price.$numberDecimal } </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <SiderLayout
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                width="w-[500px]"
            >
                {routeData ? (
                    <div>
                        <h2>{routeData.name}</h2>
                        <p>Start Point: {routeData.startPoint}</p>
                        <p>End Point: {routeData.endPoint}</p>
                        <div>
                            <h3 className="mt-4 font-semibold">Schedule:</h3>
                            <ul className="list-disc pl-6">
                                {routeData.schedule.day}: {routeData.schedule.time}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <p>Loading route details...</p>
                )}
            </SiderLayout>

        </div>

    );
}

export default CommuterComponent;
