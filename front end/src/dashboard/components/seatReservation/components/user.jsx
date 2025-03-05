import React, { useEffect, useState } from "react";
import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from "../../../../libs/hooks/UseAuth";
import SiderLayout from "../../../../libs/components/Sider";
import TripScheduleTable from "../../../../libs/components/TripScheduleTable";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";

function User() {
    const { auth } = useAuth();
    const [allTrips, setAllTrips] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [filteredTrips, setFilteredTrips] = useState([]); // State for filtered trips
    const [searchColumn, setSearchColumn] = useState("routeName"); // State for selected column

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tripData, setTripData] = useState(null);

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
                setFilteredTrips(result); // Initialize filtered trips
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
        // Filter trips based on the selected column and search query
        const filtered = allTrips.filter((trip) => {
            const valueToSearch =
                searchColumn === "routeName"
                    ? trip.route.name
                    : searchColumn === "busNumber"
                        ? trip.bus.busNumber
                        : searchColumn === "capacity"
                            ? trip.bus.capacity
                            : searchColumn === "availableSeats"
                                ? trip.availableSeats
                                : "";

            // Numeric filtering for capacity and availableSeats
            if (searchColumn === "capacity" || searchColumn === "availableSeats") {
                const queryNumber = parseInt(searchQuery, 10);
                return !isNaN(queryNumber) && valueToSearch >= queryNumber;
            }

            // Textual filtering for other columns
            return valueToSearch.toString().toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredTrips(filtered);
    }, [searchQuery, searchColumn, allTrips]);


    const openSiderWithSetData = (isOpen, data) => {
        setIsSidebarOpen(isOpen)
        setTripData(data)
    }

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">Seat Reservation</h1>
                <p className="text-lg font-normal">The appointment section simply lists your upcoming trips, including the date and time, so you can easily keep track of your schedule.</p>
            </div>

            {/* Column Selection */}
            <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Search By:</label>
                <div className="flex space-x-4">
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
                            value="capacity"
                            checked={searchColumn === "capacity"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Capacity
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="availableSeats"
                            checked={searchColumn === "availableSeats"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Available Seats
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

            {/* Trips Table */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-gray-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Route Name</th>
                        <th scope="col" className="px-6 py-3">Bus Number</th>
                        <th scope="col" className="px-6 py-3">Capacity</th>
                        <th scope="col" className="px-6 py-3">Available Seats</th>
                        <th scope="col" className="px-6 py-3">Ticket Price</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTrips.map(trip => (
                        <tr
                            key={trip._id}
                            className="bg-white cursor-pointer border-b border-gray-300"
                            onClick={() => openSiderWithSetData(true, trip)}
                        >
                            <td className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap">
                                {trip.route.name}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-600">{trip.bus.busNumber}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{trip.bus.capacity}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{trip.availableSeats}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{trip.ticket_price.$numberDecimal} </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <SiderLayout
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                width="w-[500px]"
            >
                {tripData ? (
                    <div>
                        <h1 className="text-4xl font-bold">{tripData.route.name}</h1>
                        <div className="my-4">
                            <p className="text-gray-700 mb-2"><span>{tripData.route.startPoint}</span> to <span>{tripData.route.endPoint}</span></p>
                            <table className="">
                                <tbody>
                                    <tr>
                                        <td className="text-xl font-medium w-28">Arrival</td>
                                        <td className="text-lg font-normal">: {tripData.route.startPoint}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-xl font-medium w-28">Departure</td>
                                        <td className="text-lg font-normal">: {tripData.route.endPoint}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-md font-medium w-28">Ticket Price</td>
                                        <td className="text-md font-normal">: {tripData.ticket_price.$numberDecimal}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <TripScheduleTable tripData={tripData} />
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Bus Details</h2>
                            <p className="text-md font-normal text-gray-600">Description here</p>
                            <table className="mt-2">
                                <tbody>
                                    <tr>
                                        <td className="text-lg font-medium w-32 text-gray-800">Bus Number</td>
                                        <td className="text-md font-normal">: {tripData.bus.busNumber}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg font-medium w-32 text-gray-800">Capacity</td>
                                        <td className="text-md font-normal">: {tripData.bus.capacity}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg font-medium w-32 text-gray-800">availableSeats</td>
                                        <td className="text-md font-normal">: {tripData.availableSeats}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Bus Operator Details</h2>
                            <p className="text-md font-normal text-gray-600">If you need to contact the bus operator, see the contact details below.</p>
                            <table className="mt-2">
                                <tbody>
                                    <tr>
                                        <td className="text-lg font-medium w-32 text-gray-800">Operator Name</td>
                                        <td className="text-md font-normal">: {tripData.operator.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg font-medium w-32 text-gray-800">Operator Email</td>
                                        <td className="text-md font-normal">
                                            : <a
                                                href={`mailto:${tripData.operator.email}`}
                                                className="text-blue-500 underline hover:text-blue-700"
                                            >
                                                {tripData.operator.email}
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Available Time Slot</h2>
                            <table className="mt-2">
                                <tbody>
                                    <tr>
                                        <td className="text-lg font-medium w-32 text-gray-800">{tripData.route.schedule.day}</td>
                                        <td className="text-md font-normal">: {tripData.route.schedule.time}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col w-full mt-6">
                            <Formik
                                initialValues={{ seatCount: '', dueAmount:0.00 }}
                                onSubmit={async (values, { resetForm }) => {

                                    const totalAmount = parseFloat(tripData.ticket_price.$numberDecimal) * values.seatCount;

                                    const requestOptions = {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${auth.accessToken}`,
                                            "X-API-Key": "{{token}}"
                                        },
                                        body: JSON.stringify({
                                            tripId: tripData._id,
                                            seatNumber: values.seatCount,
                                            dueAmount: totalAmount
                                        })
                                    };

                                    try {
                                        const response = await fetchWithAuth(`/commuter/bookings`, requestOptions);
                                        const data = await response.json();

                                        if (response.ok) {
                                            fetchAllTrips();
                                            setIsSidebarOpen(false);
                                            toast.success(`${data.message}`);
                                            resetForm(); // Reset the form after successful submission
                                        } else {
                                            toast.error(`${data.message}`);
                                        }
                                    } catch (error) {
                                        toast.error('An error occurred while making the booking');
                                    }
                                }}
                                validationSchema={Yup.object({
                                    seatCount: Yup.number()
                                        .required('Seat count is required')
                                        .min(1, 'Seat count must be at least 1')
                                        .max(
                                            tripData.availableSeats,
                                            `Seat count cannot exceed ${tripData.availableSeats}`
                                        )
                                        .integer('Seat count must be an integer'),
                                })}
                                validateOnChange={true} // Enable validation on every change
                                validateOnBlur={false} // Disable validation on blur
                            >
                                {({ setFieldValue, resetForm, values, errors, touched, validateForm }) => (
                                    <Form>
                                        <div className="mb-4">
                                            <label htmlFor="seatCount" className="block text-lg mb-2">
                                                Seat Count
                                            </label>
                                            <Field
                                                type="number"
                                                name="seatCount"
                                                id="seatCount"
                                                className="px-6 py-4 w-full border rounded-md"
                                                onChange={(e) => setFieldValue('seatCount', e.target.value)}
                                                value={values.seatCount} // Ensures field is controlled
                                            />
                                            
                                            {touched.seatCount && errors.seatCount ? (
                                                <div className="text-red-500 text-sm mt-1">{errors.seatCount}</div>
                                            ) : <label htmlFor="seatCount" className="block text-lg mb-2">
                                                Total Amount = {(parseFloat(tripData.ticket_price.$numberDecimal) * values.seatCount).toFixed(2)}
                                            </label>}
                                        </div>

                                        <div className="flex w-full">
                                            <button
                                                type="submit"
                                                className="px-6 py-4 mr-4 bg-black text-white rounded-md"
                                            >
                                                Reservation
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsSidebarOpen(false);
                                                    resetForm();
                                                    validateForm();
                                                }}
                                                className="px-6 py-4 border border-black rounded-md"
                                            >
                                                Cancel
                                            </button>
                                        </div>
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

export default User;
