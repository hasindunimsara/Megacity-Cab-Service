import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../../libs/hooks/UseAuth";
import { FaBusAlt } from "react-icons/fa";
import Popup from "../../../../libs/components/Popup";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";
import CreateBookingForm from "./CreateBookingForm";

function BookingManagement() {
    const { auth } = useAuth();
    const [allBookings, setAllBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchColumn, setSearchColumn] = useState("customerName");
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [bookingData, setBookingData] = useState({
        type: "create",
        data: {},
        error: null
    });

    const fetchAllBookings = async () => {
        try {
            setIsLoading(true);
            const response = await fetchWithAuth(`/moderator/bookings`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${auth.accessToken}` },
                redirect: "follow"
            });
            if (response.ok) {
                const result = await response.json();
                setAllBookings(result || []);
                setFilteredBookings(result || []);
            } else {
                toast.error("Failed to fetch bookings");
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error("Error fetching bookings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [auth.accessToken]);

    useEffect(() => {
        const filtered = allBookings.filter((booking) => {
            const valueToSearch =
                searchColumn === "customerName" ? booking.customerName :
                    searchColumn === "bookingNumber" ? booking.bookingNumber :
                        searchColumn === "driverName" ? booking.driverName :
                            searchColumn === "carNumber" ? booking.carNumber : "";
            return valueToSearch.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredBookings(filtered);
    }, [searchQuery, searchColumn, allBookings]);

    const handleCreateBooking = async (bookingData) => {
        try {
            const response = await fetchWithAuth(`/moderator/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    customerName: bookingData.customerName,
                    address: bookingData.address,
                    phoneNumber: bookingData.phoneNumber,
                    destination: bookingData.destination,
                    distance: parseFloat(bookingData.distance),
                    driverId: parseInt(bookingData.driverId),
                    carId: parseInt(bookingData.carId),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Booking created successfully!');
                fetchAllBookings();
                setIsPopupOpen(false);
            } else {
                throw new Error(data.error || 'Error creating booking');
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            setBookingData((prev) => ({ ...prev, error: error.message }));
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    const handlePrintBill = async (bookingNumber) => {
        try {
            const response = await fetchWithAuth(`/moderator/bookings/${bookingNumber}/bill`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${auth.accessToken}` },
                redirect: "follow",
            });

            if (response.ok) {
                const billAmount = await response.text();
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Booking Bill</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 20px; }
                                .bill { max-width: 400px; margin: auto; border: 1px solid #ccc; padding: 20px; }
                                h1 { text-align: center; font-size: 24px; }
                                p { margin: 10px 0; }
                            </style>
                        </head>
                        <body>
                            <div class="bill">
                                <h1>Booking Bill</h1>
                                <p><strong>Booking Number:</strong> ${bookingNumber}</p>
                                <p><strong>Total Amount:</strong> $${parseFloat(billAmount).toFixed(2)}</p>
                            </div>
                            <script>
                                window.print();
                                setTimeout(() => window.close(), 1000);
                            </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                await fetchAllBookings();
            } else {
                toast.error("Failed to fetch bill amount");
            }
        } catch (error) {
            console.error("Error fetching bill:", error);
            toast.error("Error fetching bill amount");
        }
    };

    return (
        <div className="ml-64 mt-16 p-6 overflow-y-auto h-screen bg-gray-100">
            <Toaster />
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Booking Management</h1>
                <p className="text-gray-600 mt-2">Manage customer bookings, assign drivers and cars, and print bills.</p>
            </header>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center">
                            <input type="radio" name="searchColumn" value="customerName" checked={searchColumn === "customerName"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                            Customer Name
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="searchColumn" value="bookingNumber" checked={searchColumn === "bookingNumber"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                            Booking Number
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="searchColumn" value="driverName" checked={searchColumn === "driverName"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                            Driver Name
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="searchColumn" value="carNumber" checked={searchColumn === "carNumber"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                            Car Number
                        </label>
                    </div>
                    <input
                        name="search"
                        className="w-full sm:w-64 text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        onClick={() => {
                            setIsPopupOpen(true);
                            setBookingData({ type: "create", data: {}, error: null });
                        }}
                    >
                        <FaBusAlt className="w-5 h-5 mr-2" />
                        Create Booking
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500 py-10">Loading bookings...</div>
                ) : (
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Booking Number</th>
                                    <th className="px-6 py-3">Customer Name</th>
                                    <th className="px-6 py-3">Address</th>
                                    <th className="px-6 py-3">Phone Number</th>
                                    <th className="px-6 py-3">Destination</th>
                                    <th className="px-6 py-3">Distance (km)</th>
                                    <th className="px-6 py-3">Total Amount</th>
                                    <th className="px-6 py-3">Driver</th>
                                    <th className="px-6 py-3">Car</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.length > 0 ? (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{booking.bookingNumber}</td>
                                            <td className="px-6 py-4">{booking.customerName}</td>
                                            <td className="px-6 py-4">{booking.address}</td>
                                            <td className="px-6 py-4">{booking.phoneNumber}</td>
                                            <td className="px-6 py-4">{booking.destination}</td>
                                            <td className="px-6 py-4">{booking.distance.toFixed(2)}</td>
                                            <td className="px-6 py-4">${booking.totalAmount ? booking.totalAmount.toFixed(2) : 'N/A'}</td>
                                            <td className="px-6 py-4">{booking.driverName}</td>
                                            <td className="px-6 py-4">{booking.carNumber}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handlePrintBill(booking.bookingNumber)}
                                                    className="text-green-600 hover:underline"
                                                >
                                                    Print Bill
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                                            No bookings found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Create Booking"
                width="w-[600px]"
            >
                <CreateBookingForm
                    onSubmit={handleCreateBooking}
                    onClose={() => setIsPopupOpen(false)}
                    auth={auth}
                    error={bookingData.error}
                />
            </Popup>
        </div>
    );
}

export default BookingManagement;