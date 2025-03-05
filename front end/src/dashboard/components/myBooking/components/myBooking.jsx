import React, { useEffect, useState } from "react";
import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from "../../../../libs/hooks/UseAuth";
import SiderLayout from "../../../../libs/components/Sider";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BASE_URL } from "../../../../libs/configs/config";
import Popup from "../../../../libs/components/Popup";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";

function MyBooking() {
    const { auth } = useAuth();
    const [allBookings, setAllBookings] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [filteredBookings, setFilteredBookings] = useState([]); // State for filtered bookings
    const [searchColumn, setSearchColumn] = useState("routeName"); // State for selected column

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [tripBookingData, setTripBookingData] = useState({})

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [bookingData, setBookingData] = useState(null);

    const validationSchema = Yup.object({
        fullName: Yup.string().required('Full name is required'),
        cardNumber: Yup.string().required('Card number is required'),
        expiry: Yup.string().required('Card expiration is required'),
        cvv: Yup.string().required('CVV is required'),
        card: Yup.string().required('Please select a card') // Card selection validation
    });

    const fetchAllBookings = async () => {
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
                setAllBookings(result);
                setFilteredBookings(result); // Initialize filtered bookings
            } else {
                console.error('Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [auth.accessToken]);

    useEffect(() => {
        // Filter bookings based on the selected column and search query
        const filtered = allBookings.filter((booking) => {
            const valueToSearch =
                searchColumn === "busNumber"
                    ? booking.bus.busNumber
                    : searchColumn === "bookingStatus"
                        ? booking.status
                        : searchColumn === "paymentStatus"
                            ? booking.payment_status
                            : searchColumn === "routeName"
                                ? booking.route.name
                                : "";

            // Textual filtering for other columns
            return valueToSearch.toString().toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredBookings(filtered);
    }, [searchQuery, searchColumn, allBookings]);


    const openSiderWithSetData = (isOpen, data) => {
        setIsSidebarOpen(isOpen)
        setBookingData(data)
    }

    const handleCancelBooking = async (bookingId) => {
        console.log(bookingId)
        try {
            const response = await fetchWithAuth(`/commuter/bookings/${bookingId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`
                },
                redirect: "follow"
            });
            if (response.ok) {
                const result = await response.json();
                await fetchAllBookings()
                toast.success(`${result.message}`);
            } else {
                console.error('Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">My Bookings</h1>
                <p className="text-lg font-normal">The appointment section simply lists your upcoming bookings, including the date and time, so you can easily keep track of your schedule.</p>
            </div>

            {/* Column Selection */}
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
                        Route Name
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="bookingStatus"
                            checked={searchColumn === "bookingStatus"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Booking Status
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="paymentStatus"
                            checked={searchColumn === "paymentStatus"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Payment Status
                    </label>
                </div>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-1/2 mb-10 md:mb-0">
                <input
                    name="search"
                    className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    placeholder="Search Here"
                    value={searchQuery} // Bind input value to searchQuery state
                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                />
            </div>

            {/* Bookings Table */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-gray-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Bus Number</th>
                        <th scope="col" className="px-6 py-3">Booked Seats</th>
                        <th scope="col" className="px-6 py-3">Booking Status</th>
                        <th scope="col" className="px-6 py-3">Payment Status</th>
                        <th scope="col" className="px-6 py-3">Route Name</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.map((booking) => (
                        <tr
                            key={booking._id}
                            className="bg-white cursor-pointer border-b border-gray-300"
                            onClick={() => openSiderWithSetData(true, booking)}
                        >
                            <td className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap">
                                {booking.bus.busNumber}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-600">{booking.seatNumber}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{booking.status}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{booking.payment_status}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{booking.route.name}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">
                                {booking.payment_status === "pending" && booking.status === "booked" ? (
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering row click
                                                setTripBookingData(booking)
                                                setIsPopupOpen(true)
                                            }}
                                        >
                                            Update Booking
                                        </button>
                                        <button
                                            className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering row click
                                                handleCancelBooking(booking._id);
                                            }}
                                        >
                                            Cancel Booking
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-red-500 font-medium">
                                        {booking.status === "completed"
                                            ? "Booking completed"
                                            : "Booking Canceled"}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title="Update Seat Number"
            >
                <p className="text-gray-600 mb-4">
                    Update your seat number. Ensure the number is within the available capacity.
                </p>
                {tripBookingData ? (
                    <Formik
                        initialValues={{
                            seatNumber: tripBookingData.seatNumber || "", // Initialize with current seat number
                        }}
                        validationSchema={Yup.object({
                            seatNumber: Yup.number()
                                .required("Seat number is required")
                                .min(1, "Seat number must be at least 1")
                                .max(
                                    tripBookingData.trip?.availableSeats + tripBookingData.seatNumber || 0,
                                    `Seat number cannot exceed ${tripBookingData.trip?.availableSeats + tripBookingData.seatNumber || "available seats"}`
                                ),
                        })}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            setSubmitting(true);

                            const totalAmount = parseFloat(tripBookingData.trip.ticket_price.$numberDecimal) * values.seatCount;

                            const requestOptions = {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${auth.accessToken}`,
                                    "X-API-Key": "{{token}}"
                                },
                                body: JSON.stringify({
                                    seatNumber: values.seatNumber,
                                    dueAmount: totalAmount,
                                })
                            };

                            try {
                                const response = await fetchWithAuth(`/commuter/bookings/${tripBookingData._id}`, requestOptions);
                                const data = await response.json();

                                if (response.ok) {
                                    fetchAllBookings();
                                    setIsPopupOpen(false);
                                    toast.success(`${data.message}`);
                                    resetForm(); // Reset the form after successful submission
                                } else {
                                    toast.error(`${data.message}`);
                                }
                            } catch (error) {
                                toast.error('An error occurred while updating the booking');
                            }
                        }}
                    >
                        {({ errors, touched, resetForm, isSubmitting, values }) => (
                            <Form>
                                {/* Seat Number Field */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="seatNumber"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Seat Number
                                    </label>
                                    <Field
                                        id="seatNumber"
                                        name="seatNumber"
                                        type="number"
                                        value={values.seatNumber}
                                        className={`px-6 py-4 w-full border rounded-md ${errors.seatNumber && touched.seatNumber
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                    />
                                    <ErrorMessage
                                        name="seatNumber"
                                        component="p"
                                        className="mt-2 text-sm text-red-600"
                                    />
                                    <label htmlFor="seatCount" className="block text-lg mb-2">
                                        Total Amount = {(parseFloat(tripBookingData.trip.ticket_price.$numberDecimal) * values.seatNumber).toFixed(2)}
                                    </label>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                        onClick={() => setIsPopupOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 ${isSubmitting && "opacity-50 cursor-not-allowed"
                                            }`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Update"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <p className="text-gray-600">Loading trip details...</p>
                )}
            </Popup>




            <SiderLayout
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                width="w-[500px]"
            >
                {bookingData ? (
                    <div>
                        <h1 className="text-4xl font-bold">{bookingData.route.name}</h1>
                        <div className="my-4">
                            <p className="text-gray-700 mb-2"><span>{bookingData.route.startPoint}</span> to <span>{bookingData.route.endPoint}</span></p>
                            <table className="">
                                <tbody>
                                    <tr>
                                        <td className="text-lg font-medium w-28">Arrival</td>
                                        <td className="text-lg font-normal">: {bookingData.route.startPoint}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg font-medium w-28">Departure</td>
                                        <td className="text-lg font-normal">: {bookingData.route.endPoint}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold">Payment Details</h2>
                            <p className="text-md font-normal text-gray-600">If you need to contact the bus operator, see the contact details below.</p>
                            <table className="mt-2">
                                <tbody>
                                    <tr>
                                        <td className="text-md font-medium text-gray-800">Total Due Amount</td>
                                        <td className="text-md font-normal">: {bookingData.dueAmount.$numberDecimal}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6">
                            <Formik
                                initialValues={{
                                    fullName: '',
                                    cardNumber: '',
                                    expiry: '',
                                    cvv: '',
                                    card: '' // Initial value for card selection
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values, { resetForm }) => {
                                    // Handle form submission here
                                    const requestOptions = {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${auth.accessToken}`,
                                            "X-API-Key": "{{token}}"
                                        },
                                        body: JSON.stringify({
                                            bookingId: bookingData._id,
                                            amount: bookingData.dueAmount.$numberDecimal,
                                            paymentMethod: "credit_card"
                                        })
                                    };

                                    try {
                                        const response = await fetchWithAuth(`/commuter/payments`, requestOptions);
                                        const data = await response.json();

                                        if (response.ok) {
                                            fetchAllBookings();
                                            setIsSidebarOpen(false);
                                            toast.success(`${data.message}`);
                                            resetForm(); // Reset the form after successful submission
                                        } else {
                                            toast.error(`${data.message}`);
                                        }
                                    } catch (error) {
                                        console.log(error)
                                        toast.error('An error occurred while making the booking');
                                    }
                                }}
                            >
                            {({ setFieldValue, resetForm, errors, touched }) => (
                                    <Form>
                                        {/* Card Selection */}
                                        <div className="">
                                            <div className="flex border border-gray-300 p-4 rounded-lg my-5">
                                                <Field
                                                    type="radio"
                                                    id="visa-card"
                                                    name="card"
                                                    value="visa"
                                                    className="mr-4 accent-black"
                                                />
                                                <div className="flex flex-col flex-grow">
                                                    <div className="text-sm mb-1">Visa ending in 7658</div>
                                                    <div className="text-xs text-gray-800">Expiry 10/2024</div>
                                                </div>
                                                <img
                                                    className="h-8 w-auto dark:flex ml-4"
                                                    src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg"
                                                    alt="VisaCard logo"
                                                />
                                            </div>

                                            <div className="flex border border-gray-300 p-4 rounded-lg mt-5">
                                                <Field
                                                    type="radio"
                                                    id="mastercard"
                                                    name="card"
                                                    value="mastercard"
                                                    className="mr-4 accent-black"
                                                />
                                                <div className="flex flex-col flex-grow">
                                                    <div className="text-sm mb-1">Mastercard ending in 8429</div>
                                                    <div className="text-xs text-gray-800">Expiry 04/2026</div>
                                                </div>
                                                <img
                                                    className="h-8 w-auto dark:flex ml-4"
                                                    src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard-dark.svg"
                                                    alt="Mastercard logo"
                                                />
                                            </div>

                                            <ErrorMessage name="card" component="div" className="text-red-500 text-xs" />
                                        </div>

                                        <div className="max-w-lg mx-auto p-6 rounded-lg border border-gray-300 mt-6">
                                            <div className="mb-4">
                                                <label htmlFor="full-name" className="block text-sm text-gray-900 font-medium">Full name (as displayed on card)*</label>
                                                <Field
                                                    type="text"
                                                    id="full-name"
                                                    name="fullName"
                                                    className="mt-2 w-full p-3 rounded-md placeholder-gray-500 focus:outline-none border-gray-300 border"
                                                    placeholder="Bonnie Green"
                                                />
                                                <ErrorMessage name="fullName" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="card-number" className="block text-sm text-gray-900 font-medium">Card number*</label>
                                                <Field
                                                    type="text"
                                                    id="card-number"
                                                    name="cardNumber"
                                                    className="mt-2 w-full p-3 rounded-md placeholder-gray-500 focus:outline-none border-gray-300 border"
                                                    placeholder="XXXX-XXXX-XXXX-XXXX"
                                                />
                                                <ErrorMessage name="cardNumber" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>

                                            <div className="mb-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="expiry" className="block text-sm text-gray-900 font-medium">Card expiration*</label>
                                                    <Field
                                                        type="text"
                                                        id="expiry"
                                                        name="expiry"
                                                        className="mt-2 w-full p-3 rounded-md placeholder-gray-500 focus:outline-none border-gray-300 border"
                                                        placeholder="12/23"
                                                    />
                                                    <ErrorMessage name="expiry" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>
                                                <div>
                                                    <label htmlFor="cvv" className="block text-sm text-gray-900 font-medium">CVV*</label>
                                                    <div className="relative">
                                                        <Field
                                                            type="text"
                                                            id="cvv"
                                                            name="cvv"
                                                            className="mt-2 w-full p-3 rounded-md placeholder-gray-500 focus:outline-none border-gray-300 border pr-10"
                                                            placeholder="***"
                                                        />
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h12M12 6h0m6 6l-6 6l-6-6"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <ErrorMessage name="cvv" component="div" className="text-red-500 text-xs mt-1" />
                                                </div>
                                            </div>

                                        </div>

                                        {(bookingData.status === "booked") &&
                                            (bookingData.payment_status === "pending") ? (
                                            <div className="flex flex-col w-full mt-6">
                                                <div className="flex w-full">
                                                    <button
                                                        type="submit"
                                                        className="px-6 py-4 mr-4 bg-black text-white rounded-md"
                                                    >
                                                        Make Payment
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsSidebarOpen(false);
                                                            // Reset form here
                                                        }}
                                                        className="px-6 py-4 border border-black rounded-md"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-6 text-center text-sm text-gray-500">
                                                You have already completed this booking or payment.
                                            </div>
                                        )}

                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                ) : (
                    <p>Loading route details...</p>
                )}
            </SiderLayout>
        </div>
    );
}

export default MyBooking;
