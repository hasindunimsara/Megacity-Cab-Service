import React, { useEffect, useState } from "react";
import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from "../../../../libs/hooks/UseAuth";
import { FaBusAlt } from "react-icons/fa";
import Popup from "../../../../libs/components/Popup";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";
import CreateBusScheduleForm from "./CreateBusScheduleForm";
import UpdateBusScheduleForm from "./UpdateBusScheduleForm";


function TripManagement() {
    const { auth } = useAuth();
    const [allTrips, setAllTrips] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [searchColumn, setSearchColumn] = useState("busNumber");

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [tripData, setTripData] = useState({
        type: "create",
        data: {},
        error: null
    });

    const fetchAllTrips = async () => {
        try {
            const response = await fetchWithAuth(`/operator/trips`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`
                },
                redirect: "follow"
            });
            if (response.ok) {
                const result = await response.json();
                setAllTrips(result);
                setFilteredTrips(result);
            } else {
                console.error('Failed to fetch trips');
            }
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    };

    useEffect(() => {
        fetchAllTrips();
    }, [auth.accessToken]);

    useEffect(() => {
        const filtered = allTrips.filter((trip) => {
            const valueToSearch =
                searchColumn === "busNumber"
                    ? trip.bus.busNumber
                    : searchColumn === "routeName"
                        ? trip.route.name
                        : searchColumn === "operator"
                            ? trip.operator
                            : "";

            return valueToSearch.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredTrips(filtered);
    }, [searchQuery, searchColumn, allTrips]);

    const handleCreateTrip = async (tripData) => {
        console.log(tripData)
        try {
            const response = await fetchWithAuth(`/operator/trip`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify(
                    {
                        bus: tripData.bus,
                        availableSeats: tripData.availableSeats,
                        route: tripData.route,
                        ticket_price: tripData.ticketPrice
                    }
                ),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Trip created successfully!');
                fetchAllTrips();
                setIsPopupOpen(false);
            } else {
                const errorMessage = data.error?.errorResponse?.errmsg || 'Error creating trip';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Error creating trip:", error);
            setTripData((prevData) => ({
                ...prevData,
                error: error.message || 'An unexpected error occurred',
            }));
        }
    };

    const handleUpdateTrip = async (trip) => {
        try {
            const response = await fetchWithAuth(`/operator/trips/${trip.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    bus: trip.bus,
                    availableSeats: trip.availableSeats,
                    route: trip.route,
                    ticket_price: trip.ticketPrice
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Trip updated successfully!');
                fetchAllTrips();
                setIsPopupOpen(false);
            } else {
                const errorMessage = data.error?.errorResponse?.errmsg || 'Error updating trip';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Error updating trip:", error);
            setTripData((prevData) => ({
                ...prevData,
                error: error.message || 'An unexpected error occurred while updating the trip.',
            }));
            toast.error(error.message || 'Something went wrong while updating the trip.');
        }
    };

    const handleDeleteTrip = async (tripId) => {
        try {
            const response = await fetchWithAuth(`/operator/trips/${tripId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Trip deleted successfully!');
                fetchAllTrips();
            } else {
                const errorMessage = data.error?.errorResponse?.errmsg || 'Error deleting trip';
                throw new Error(errorMessage);
            }
        } catch (error) {
            setTripData((prevData) => ({
                ...prevData,
                error: error.message || 'An unexpected error occurred while deleting the trip.',
            }));
            toast.error(error.message || 'Something went wrong while deleting the trip.');
        }
    };

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">Trip Management</h1>
                <p className="text-lg font-normal">Manage trips including bus details, routes, and ticket prices.</p>
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Search By:</label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="busNumber"
                            checked={searchColumn === "busNumber"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Bus Number
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="routeName"
                            checked={searchColumn === "routeName"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Route
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="operator"
                            checked={searchColumn === "operator"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Operator
                    </label>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-between mb-6">
                <input
                    name="search"
                    className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    placeholder="Search Here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className="ml-4 flex items-center justify-center px-4 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    onClick={() => {
                        setIsPopupOpen(true);
                        setTripData({
                            type: "create",
                            data: {},
                        });
                    }}
                >
                    <FaBusAlt className="w-5 h-5" />
                </button>
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-gray-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Bus Number</th>
                        <th scope="col" className="px-6 py-3">Route</th>
                        <th scope="col" className="px-6 py-3">Available Seats</th>
                        <th scope="col" className="px-6 py-3">Ticket Price</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTrips.map((trip) => (
                        <tr
                            key={trip._id}
                            className="bg-white cursor-pointer border-b border-gray-300"
                        >
                            <td className="px-6 py-4 font-medium text-gray-600">{trip.bus.busNumber}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{trip.route.name}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{trip.availableSeats}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">${trip.ticket_price.$numberDecimal}</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => {
                                        setIsPopupOpen(true);
                                        setTripData({
                                            type: "update",
                                            data: trip,
                                        });
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="ml-4 text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteTrip(trip._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={tripData.type === "create" ? "Create Route" : "Edit Route"}
                width="w-[500px]"
            >
                {tripData.type === "create" ? (
                    <CreateBusScheduleForm
                        onSubmit={handleCreateTrip}
                        onClose={() => setIsPopupOpen(false)}
                        auth={auth}
                    />
                ) : tripData.type === 'update' &&
                <UpdateBusScheduleForm
                    existingSchedule={tripData.data}
                    onSubmit={handleUpdateTrip}
                        onClose={() => setIsPopupOpen(false)}
                        auth={auth}
                    />
                }
            </Popup>
        </div>
    );
}

export default TripManagement;
