import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../../libs/hooks/UseAuth";
import Popup from "../../../../libs/components/Popup";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

function MyBooking() {
    const { auth } = useAuth();
    const [allBookings, setAllBookings] = useState([]);
    const [allPayments, setAllPayments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchColumn, setSearchColumn] = useState("bookingNumber");
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [bookingData, setBookingData] = useState({ type: "create", data: {}, error: null });

    const fetchAllBookings = async () => {
        try {
            setIsLoading(true);
            const response = await fetchWithAuth(`/customer/bookings`, {
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

    const fetchAllPayments = async () => {
        try {
            const response = await fetchWithAuth(`/customer/payments`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${auth.accessToken}` },
                redirect: "follow"
            });
            if (response.ok) {
                const result = await response.json();
                setAllPayments(result || []);
            } else {
                toast.error("Failed to fetch payments");
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error("Error fetching payments");
        }
    };

    useEffect(() => {
        fetchAllBookings();
        fetchAllPayments();
    }, [auth.accessToken]);

    useEffect(() => {
        const filtered = allBookings.filter((booking) => {
            const valueToSearch =
                searchColumn === "bookingNumber" ? booking.bookingNumber :
                    searchColumn === "customerName" ? booking.customerName :
                        searchColumn === "destination" ? booking.destination :
                            searchColumn === "driverName" ? booking.driverName : "";
            return valueToSearch.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredBookings(filtered);
    }, [searchQuery, searchColumn, allBookings]);

    const handleCreateBooking = async (values) => {
        try {
            const response = await fetchWithAuth(`/customer/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    customerName: values.customerName,
                    address: values.address,
                    phoneNumber: values.phoneNumber,
                    destination: values.destination,
                    distance: parseFloat(values.distance),
                    driverId: parseInt(values.driverId),
                    carId: parseInt(values.carId),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || "Booking created successfully!");
                await fetchAllBookings();
                setIsPopupOpen(false);
            } else {
                throw new Error(data.error || "Error creating booking");
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            setBookingData((prev) => ({ ...prev, error: error.message }));
            toast.error(error.message || "An unexpected error occurred");
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await fetchWithAuth(`/customer/bookings/${bookingId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${auth.accessToken}` },
                redirect: "follow"
            });
            if (response.ok) {
                toast.success("Booking canceled successfully!");
                fetchAllBookings(); // Refresh the table after cancellation
            } else {
                toast.error("Failed to cancel booking");
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
            toast.error("Error canceling booking");
        }
    };

    const handleMakePayment = async (bookingNumber) => {
        setBookingData({ type: "payment", data: { bookingNumber }, error: null });
        setIsPopupOpen(true);
    };

    const CreateBookingForm = () => {
        const [drivers, setDrivers] = useState([]);
        const [cars, setCars] = useState([]);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            const fetchDrivers = async () => {
                try {
                    setLoading(true);
                    const response = await fetchWithAuth(`/customer/drivers`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${auth.accessToken}` },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        setDrivers(result.map(driver => ({ value: driver.id, label: driver.name })));
                    } else {
                        toast.error("Failed to load drivers");
                    }
                } catch (error) {
                    toast.error("Error fetching drivers");
                } finally {
                    setLoading(false);
                }
            };

            const fetchCars = async () => {
                try {
                    setLoading(true);
                    const response = await fetchWithAuth(`/customer/cars`, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${auth.accessToken}` },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        setCars(result.map(car => ({ value: car.id, label: `${car.carNumber} (${car.model})` })));
                    } else {
                        toast.error("Failed to load cars");
                    }
                } catch (error) {
                    toast.error("Error fetching cars");
                } finally {
                    setLoading(false);
                }
            };

            fetchDrivers();
            fetchCars();
        }, [auth.accessToken]);

        const formik = useFormik({
            initialValues: {
                customerName: "",
                address: "",
                phoneNumber: "",
                destination: "",
                distance: "",
                driverId: "",
                carId: "",
            },
            validationSchema: Yup.object({
                customerName: Yup.string().min(2).max(50).matches(/^[a-zA-Z\s]+$/).required("Customer name is required"),
                address: Yup.string().min(5).max(100).required("Address is required"),
                phoneNumber: Yup.string().matches(/^\d{9,12}$/).required("Phone number is required"),
                destination: Yup.string().min(5).max(100).required("Destination is required"),
                distance: Yup.number().positive().max(1000).required("Distance is required"),
                driverId: Yup.number().positive().integer().required("Driver is required"),
                carId: Yup.number().positive().integer().required("Car is required"),
            }),
            onSubmit: handleCreateBooking,
        });

        return (
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Customer Name</label>
                    <input type="text" name="customerName" value={formik.values.customerName} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`block w-full border ${formik.touched.customerName && formik.errors.customerName ? "border-red-500" : "border-gray-300"} rounded py-2 px-4`} placeholder="Enter your name" />
                    {formik.touched.customerName && formik.errors.customerName && <div className="text-red-500 text-sm">{formik.errors.customerName}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Address</label>
                    <input type="text" name="address" value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`block w-full border ${formik.touched.address && formik.errors.address ? "border-red-500" : "border-gray-300"} rounded py-2 px-4`} placeholder="Enter your address" />
                    {formik.touched.address && formik.errors.address && <div className="text-red-500 text-sm">{formik.errors.address}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input type="text" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`block w-full border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? "border-red-500" : "border-gray-300"} rounded py-2 px-4`} placeholder="e.g., 0779876543" />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Destination</label>
                    <input type="text" name="destination" value={formik.values.destination} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`block w-full border ${formik.touched.destination && formik.errors.destination ? "border-red-500" : "border-gray-300"} rounded py-2 px-4`} placeholder="Enter destination" />
                    {formik.touched.destination && formik.errors.destination && <div className="text-red-500 text-sm">{formik.errors.destination}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Distance (km)</label>
                    <input type="number" name="distance" value={formik.values.distance} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`block w-full border ${formik.touched.distance && formik.errors.distance ? "border-red-500" : "border-gray-300"} rounded py-2 px-4`} placeholder="Enter distance" step="0.1" />
                    {formik.touched.distance && formik.errors.distance && <div className="text-red-500 text-sm">{formik.errors.distance}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Driver</label>
                    <Select options={drivers} onChange={(option) => formik.setFieldValue("driverId", option?.value)} onBlur={formik.handleBlur} placeholder="Select Driver" isDisabled={loading} />
                    {formik.touched.driverId && formik.errors.driverId && <div className="text-red-500 text-sm">{formik.errors.driverId}</div>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Car</label>
                    <Select options={cars} onChange={(option) => formik.setFieldValue("carId", option?.value)} onBlur={formik.handleBlur} placeholder="Select Car" isDisabled={loading} />
                    {formik.touched.carId && formik.errors.carId && <div className="text-red-500 text-sm">{formik.errors.carId}</div>}
                </div>
                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600" disabled={loading || formik.isSubmitting}>Create Booking</button>
                    <button type="button" className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600" onClick={() => setIsPopupOpen(false)} disabled={formik.isSubmitting}>Cancel</button>
                </div>
            </form>
        );
    };

    const PaymentForm = ({ bookingNumber }) => {
        const formik = useFormik({
            initialValues: { cardNumber: "" },
            validationSchema: Yup.object({
                cardNumber: Yup.string().matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, "Card number must be in XXXX-XXXX-XXXX-XXXX format").required("Card number is required"),
            }),
            onSubmit: async (values) => {
                try {
                    const response = await fetchWithAuth(`/customer/payments`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${auth.accessToken}`,
                        },
                        body: JSON.stringify({ bookingNumber, cardNumber: values.cardNumber }),
                    });
                    const data = await response.json();
                    if (response.ok) {
                        toast.success(data.message || "Payment made successfully!");
                        fetchAllBookings();
                        fetchAllPayments();
                        setIsPopupOpen(false);
                    } else {
                        throw new Error(data.error || "Error making payment");
                    }
                } catch (error) {
                    console.error("Error making payment:", error);
                    setBookingData((prev) => ({ ...prev, error: error.message }));
                    toast.error(error.message || "An unexpected error occurred");
                }
            },
        });

        return (
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Card Number</label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={formik.values.cardNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`block w-full border ${formik.touched.cardNumber && formik.errors.cardNumber ? "border-red-500" : "border-gray-300"} rounded py-2 px-4`}
                        placeholder="e.g., 1234-5678-9012-3456"
                    />
                    {formik.touched.cardNumber && formik.errors.cardNumber && <div className="text-red-500 text-sm">{formik.errors.cardNumber}</div>}
                </div>
                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600" disabled={formik.isSubmitting}>Make Payment</button>
                    <button type="button" className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600" onClick={() => setIsPopupOpen(false)} disabled={formik.isSubmitting}>Cancel</button>
                </div>
            </form>
        );
    };

    return (
        <div className="ml-64 mt-16 p-6 overflow-y-auto h-screen bg-gray-100">
            <Toaster />
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
                <p className="text-gray-600 mt-2">View and manage your bookings here.</p>
            </header>

            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center">
                            <input type="radio" name="searchColumn" value="bookingNumber" checked={searchColumn === "bookingNumber"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                            Booking Number
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="searchColumn" value="customerName" checked={searchColumn === "customerName"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                            Customer Name
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="searchColumn" value="destination" checked={searchColumn === "destination"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                            Destination
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="searchColumn" value="driverName" checked={searchColumn === "driverName"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                            Driver Name
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
                            setBookingData({ type: "create", data: {}, error: null });
                            setIsPopupOpen(true);
                        }}
                    >
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
                                    filteredBookings.map((booking) => {
                                        const payment = allPayments.find(p => p.bookingNumber === booking.bookingNumber);
                                        const isPaid = payment && payment.status === "COMPLETED";
                                        return (
                                            <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{booking.bookingNumber}</td>
                                                <td className="px-6 py-4">{booking.customerName}</td>
                                                <td className="px-6 py-4">{booking.destination}</td>
                                                <td className="px-6 py-4">{booking.distance.toFixed(2)}</td>
                                                <td className="px-6 py-4">${booking.totalAmount ? booking.totalAmount.toFixed(2) : 'N/A'}</td>
                                                <td className="px-6 py-4">{booking.driverName}</td>
                                                <td className="px-6 py-4">{booking.carNumber}</td>
                                                <td className="px-6 py-4 flex gap-2">
                                                    {!isPaid && (
                                                        <>
                                                            <button
                                                                onClick={() => handleMakePayment(booking.bookingNumber)}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Pay
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelBooking(booking.bookingNumber)}
                                                                className="text-red-600 hover:underline"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                    {isPaid && <span className="text-green-600">Paid</span>}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
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
                title={bookingData.type === "create" ? "Create New Booking" : "Make Payment"}
                width="w-[500px]"
            >
                {bookingData.type === "create" ? (
                    <CreateBookingForm />
                ) : (
                    <PaymentForm bookingNumber={bookingData.data.bookingNumber} />
                )}
                {bookingData.error && <div className="text-red-500 text-sm mt-2">{bookingData.error}</div>}
            </Popup>
        </div>
    );
}

export default MyBooking;