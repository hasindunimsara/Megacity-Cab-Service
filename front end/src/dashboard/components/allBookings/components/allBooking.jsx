import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../../libs/hooks/UseAuth";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";
import Popup from "../../../../libs/components/Popup";

function AllBooking() {
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
            const response = await fetchWithAuth(`/admin/bookings`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                redirect: "follow",
            });

            if (response.ok) {
                const result = await response.json();
                setAllBookings(result || []);
                setFilteredBookings(result || []);
            } else {
                console.error("Failed to fetch bookings");
                toast.error("Failed to fetch bookings");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
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
                searchColumn === "customerName"
                    ? booking.customerName
                    : searchColumn === "bookingNumber"
                        ? booking.bookingNumber
                        : searchColumn === "driverName"
                            ? booking.driverName
                            : searchColumn === "carNumber"
                                ? booking.carNumber
                                : "";

            return valueToSearch?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        });
        setFilteredBookings(filtered);
    }, [searchQuery, searchColumn, allBookings]);

    const handleCreateBooking = async (bookingData) => {
        try {
            const response = await fetchWithAuth(`/admin/bookings`, {
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
            toast.error(error.message || 'An unexpected error occurred');
            setBookingData(prev => ({ ...prev, error: error.message }));
        }
    };

    const handleUpdateBooking = async (booking) => {
        try {
            const response = await fetchWithAuth(`/admin/bookings/${booking.bookingNumber}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    customerName: booking.customerName,
                    address: booking.address,
                    phoneNumber: booking.phoneNumber,
                    destination: booking.destination,
                    distance: parseFloat(booking.distance),
                    driverId: parseInt(booking.driverId),
                    carId: parseInt(booking.carId),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Booking updated successfully!');
                fetchAllBookings();
                setIsPopupOpen(false);
            } else {
                throw new Error(data.error || 'Error updating booking');
            }
        } catch (error) {
            console.error("Error updating booking:", error);
            toast.error(error.message || 'Something went wrong while updating the booking.');
            setBookingData(prev => ({ ...prev, error: error.message }));
        }
    };

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">Booking Management</h1>
                <p className="text-lg font-normal">
                    Manage bookings, including customer details, car and driver assignments.
                </p>
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Search By:</label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="customerName"
                            checked={searchColumn === "customerName"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Customer Name
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="bookingNumber"
                            checked={searchColumn === "bookingNumber"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Booking Number
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="driverName"
                            checked={searchColumn === "driverName"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Driver Name
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="carNumber"
                            checked={searchColumn === "carNumber"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Car Number
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
                        setBookingData({ type: "create", data: {}, error: null });
                        setIsPopupOpen(true);
                    }}
                >
                    Create Booking
                </button>
            </div>

            {isLoading ? (
                <div className="text-center">Loading bookings...</div>
            ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Booking Number</th>
                            <th scope="col" className="px-6 py-3">Customer Name</th>
                            <th scope="col" className="px-6 py-3">Address</th>
                            <th scope="col" className="px-6 py-3">Phone Number</th>
                            <th scope="col" className="px-6 py-3">Destination</th>
                            <th scope="col" className="px-6 py-3">Distance</th>
                            <th scope="col" className="px-6 py-3">Driver</th>
                            <th scope="col" className="px-6 py-3">Car</th>
                            <th scope="col" className="px-6 py-3">Total Amount</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <tr key={booking.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{booking.bookingNumber}</td>
                                    <td className="px-6 py-4">{booking.customerName}</td>
                                    <td className="px-6 py-4">{booking.address}</td>
                                    <td className="px-6 py-3">{booking.phoneNumber}</td>
                                    <td className="px-6 py-4">{booking.destination}</td>
                                    <td className="px-6 py-4">{booking.distance}</td>
                                    <td className="px-6 py-4">{booking.driverName}</td>
                                    <td className="px-6 py-4">{booking.carNumber}</td>
                                    <td className="px-6 py-4">{booking.totalAmount || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                setBookingData({ type: "update", data: booking, error: null });
                                                setIsPopupOpen(true);
                                            }}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="px-6 py-4 text-center">
                                    No bookings found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={bookingData.type === "create" ? "Create Booking" : "Edit Booking"}
                width="w-[600px]"
            >
                <BookingForm
                    type={bookingData.type}
                    initialData={bookingData.data}
                    onSubmit={bookingData.type === "create" ? handleCreateBooking : handleUpdateBooking}
                    onClose={() => setIsPopupOpen(false)}
                    error={bookingData.error}
                    auth={auth}
                />
            </Popup>
        </div>
    );
}

function BookingForm({ type, initialData, onSubmit, onClose, error, auth }) {
    const [formData, setFormData] = useState({
        customerName: initialData.customerName || "",
        address: initialData.address || "",
        phoneNumber: initialData.phoneNumber || "",
        destination: initialData.destination || "",
        distance: initialData.distance || "",
        driverId: initialData.driverId || "",
        carId: initialData.carId || "",
        bookingNumber: initialData.bookingNumber || "",
        driverName: initialData.driverName || "",
        carNumber: initialData.carNumber || "",
    });
    const [drivers, setDrivers] = useState([]);
    const [cars, setCars] = useState([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setIsLoadingOptions(true);

                // Fetch drivers
                const driversResponse = await fetchWithAuth(`/admin/drivers`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                    redirect: "follow",
                });
                if (driversResponse.ok) {
                    const driversData = await driversResponse.json();
                    setDrivers(driversData || []);
                } else {
                    toast.error("Failed to fetch drivers");
                }

                // Fetch cars
                const carsResponse = await fetchWithAuth(`/admin/cars`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                    redirect: "follow",
                });
                if (carsResponse.ok) {
                    const carsData = await carsResponse.json();
                    setCars(carsData || []);
                } else {
                    toast.error("Failed to fetch cars");
                }
            } catch (error) {
                console.error("Error fetching options:", error);
                toast.error("Error fetching drivers and cars");
            } finally {
                setIsLoadingOptions(false);
            }
        };

        if (isPopupOpen) {
            fetchOptions();
        }
    }, [auth.accessToken, isPopupOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            customerName: formData.customerName,
            address: formData.address,
            phoneNumber: formData.phoneNumber,
            destination: formData.destination,
            distance: formData.distance,
            driverId: formData.driverId,
            carId: formData.carId,
            bookingNumber: formData.bookingNumber,
        };
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
                <label className="block text-gray-700 font-medium mb-2">Customer Name</label>
                <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4"
                    placeholder="Enter Customer Name"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4"
                    placeholder="Enter Address"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4"
                    placeholder="Enter Phone Number"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Destination</label>
                <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4"
                    placeholder="Enter Destination"
                    required
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Distance (km)</label>
                <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4"
                    placeholder="Enter Distance"
                    step="0.1"
                    required
                />
            </div>

            {type === "update" && (
                <>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Current Driver</label>
                        <input
                            type="text"
                            value={formData.driverName}
                            className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 bg-gray-100"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Current Car</label>
                        <input
                            type="text"
                            value={formData.carNumber}
                            className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 bg-gray-100"
                            readOnly
                        />
                    </div>
                </>
            )}

            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    {type === "create" ? "Driver" : "Assign New Driver"}
                </label>
                <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4"
                    disabled={isLoadingOptions}
                    required
                >
                    <option value="">Select a driver</option>
                    {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                            {driver.name}
                        </option>
                    ))}
                </select>
                {isLoadingOptions && <p className="text-sm text-gray-500">Loading drivers...</p>}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    {type === "create" ? "Car" : "Assign New Car"}
                </label>
                <select
                    name="carId"
                    value={formData.carId}
                    onChange={handleChange}
                    className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4"
                    disabled={isLoadingOptions}
                    required
                >
                    <option value="">Select a car</option>
                    {cars.map((car) => (
                        <option key={car.id} value={car.id}>
                            {car.carNumber} - {car.model}
                        </option>
                    ))}
                </select>
                {isLoadingOptions && <p className="text-sm text-gray-500">Loading cars...</p>}
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                    disabled={isLoadingOptions}
                >
                    {type === "create" ? "Create Booking" : "Update Booking"}
                </button>
                <button
                    type="button"
                    className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default AllBooking;