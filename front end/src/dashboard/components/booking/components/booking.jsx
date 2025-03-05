import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../../libs/hooks/UseAuth";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";

function Booking() {
    const { auth } = useAuth();
    const [allBookings, setAllBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchColumn, setSearchColumn] = useState("name");

    const fetchAllBookings = async () => {
        try {
            const response = await fetchWithAuth(`/operator/bookings`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                redirect: "follow",
            });

            if (response.ok) {
                const result = await response.json();
                setAllBookings(result);
                setFilteredBookings(result);
            } else {
                console.error("Failed to fetch bookings");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const cancelBooking = async (bookingId) => {
        try {
            const response = await fetchWithAuth(`/operator/bookings/${bookingId}/cancel`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            });

            if (response.ok) {
                toast.success("Booking cancelled successfully!");
                fetchAllBookings();  // Refresh the bookings after cancellation
            } else {
                toast.error("Failed to cancel booking");
            }
        } catch (error) {
            toast.error("Error cancelling booking");
            console.error("Error cancelling booking:", error);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [auth.accessToken]);

    useEffect(() => {
        const filtered = allBookings.filter((booking) => {
            const valueToSearch =
                searchColumn === "name"
                    ? booking.commuter.name
                    : searchColumn === "email"
                        ? booking.commuter.email
                        : searchColumn === "role"
                            ? booking.commuter.role.join(", ")  // Joining array of roles into a string
                            : "";

            return valueToSearch.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredBookings(filtered);
    }, [searchQuery, searchColumn, allBookings]);

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">Operator Bookings</h1>
                <p className="text-lg font-normal">
                    Manage operator bookings, including commuter details, bus details, and booking status.
                </p>
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Search By:</label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="name"
                            checked={searchColumn === "name"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Name
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="email"
                            checked={searchColumn === "email"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Email
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="role"
                            checked={searchColumn === "role"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Role
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
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-gray-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Commuter Name</th>
                        <th scope="col" className="px-6 py-3">Commuter Email</th>
                        <th scope="col" className="px-6 py-3">Commuter Role</th>
                        <th scope="col" className="px-6 py-3">Bus Number</th>
                        <th scope="col" className="px-6 py-3">Seat Number</th>
                        <th scope="col" className="px-6 py-3">Due Amount</th>
                        <th scope="col" className="px-6 py-3">Booking Status</th>
                        <th scope="col" className="px-6 py-3">Payment Status</th>
                        <th scope="col" className="px-6 py-3">Booking Date</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map((booking) => (
                        <tr key={booking._id} className="bg-white border-b">
                            <td className="px-6 py-4">{booking.commuter.name}</td>
                            <td className="px-6 py-4">{booking.commuter.email}</td>
                            <td className="px-6 py-4">{booking.commuter.role.join(", ")}</td>
                            <td className="px-6 py-4">{booking.bus.busNumber}</td>
                            <td className="px-6 py-4">{booking.seatNumber}</td>
                            <td className="px-6 py-4">${parseFloat(booking.dueAmount.$numberDecimal).toFixed(2)}</td>
                            <td className="px-6 py-4">{booking.status}</td>
                            <td className="px-6 py-4">{booking.payment_status}</td>
                            <td className="px-6 py-4">
                                {new Date(booking.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                {/* Conditional rendering based on status */}
                                {booking.status === "cancelled" ? (
                                    <span className="text-gray-500">Booking Cancelled</span>
                                ) : booking.status === "paid" ? (
                                    <span className="text-green-500">Payment Completed</span>
                                ) : (
                                    <button
                                        onClick={() => cancelBooking(booking._id)}
                                        className="text-red-500"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Booking;
