import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";
import Select from "react-select";

const CreateBookingForm = ({ onSubmit, onClose, auth, error }) => {
    const [drivers, setDrivers] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`/moderator/drivers`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${auth.accessToken}` },
                redirect: "follow",
            });
            if (response.ok) {
                const result = await response.json();
                setDrivers(result.map(driver => ({
                    value: driver.id,
                    label: driver.name,
                })));
            } else {
                toast.error("Failed to load drivers");
            }
        } catch (error) {
            console.error("Error fetching drivers:", error);
            toast.error("An error occurred while fetching drivers");
        } finally {
            setLoading(false);
        }
    };

    const fetchCars = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`/moderator/cars`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${auth.accessToken}` },
                redirect: "follow",
            });
            if (response.ok) {
                const result = await response.json();
                setCars(result.map(car => ({
                    value: car.id,
                    label: `${car.carNumber} (${car.model})`,
                })));
            } else {
                toast.error("Failed to load cars");
            }
        } catch (error) {
            console.error("Error fetching cars:", error);
            toast.error("An error occurred while fetching cars");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
            customerName: Yup.string()
                .min(2, "Name must be at least 2 characters")
                .max(50, "Name must not exceed 50 characters")
                .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
                .required("Customer name is required"),
            address: Yup.string()
                .min(5, "Address must be at least 5 characters")
                .max(100, "Address must not exceed 100 characters")
                .required("Address is required"),
            phoneNumber: Yup.string()
                .matches(/^\d{9,12}$/, "Phone number must be 9-12 digits")
                .required("Phone number is required"),
            destination: Yup.string()
                .min(5, "Destination must be at least 5 characters")
                .max(100, "Destination must not exceed 100 characters")
                .required("Destination is required"),
            distance: Yup.number()
                .positive("Distance must be positive")
                .max(1000, "Distance must not exceed 1000 km")
                .required("Distance is required"),
            driverId: Yup.number()
                .positive("Driver ID must be positive")
                .integer("Driver ID must be an integer")
                .required("Driver selection is required"),
            carId: Yup.number()
                .positive("Car ID must be positive")
                .integer("Car ID must be an integer")
                .required("Car selection is required"),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Toaster />
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
                <label className="block text-gray-700 font-medium mb-2">Customer Name</label>
                <input
                    type="text"
                    name="customerName"
                    value={formik.values.customerName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.customerName && formik.errors.customerName ? "border-red-500" : "border-gray-300"} rounded py-3 px-4`}
                    placeholder="Enter Customer Name"
                />
                {formik.touched.customerName && formik.errors.customerName && (
                    <div className="text-red-500 text-sm">{formik.errors.customerName}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.address && formik.errors.address ? "border-red-500" : "border-gray-300"} rounded py-3 px-4`}
                    placeholder="Enter Address"
                />
                {formik.touched.address && formik.errors.address && (
                    <div className="text-red-500 text-sm">{formik.errors.address}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.phoneNumber && formik.errors.phoneNumber ? "border-red-500" : "border-gray-300"} rounded py-3 px-4`}
                    placeholder="Enter Phone Number (e.g., 0771234567)"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <div className="text-red-500 text-sm">{formik.errors.phoneNumber}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Destination</label>
                <input
                    type="text"
                    name="destination"
                    value={formik.values.destination}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.destination && formik.errors.destination ? "border-red-500" : "border-gray-300"} rounded py-3 px-4`}
                    placeholder="Enter Destination"
                />
                {formik.touched.destination && formik.errors.destination && (
                    <div className="text-red-500 text-sm">{formik.errors.destination}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Distance (km)</label>
                <input
                    type="number"
                    name="distance"
                    value={formik.values.distance}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.distance && formik.errors.distance ? "border-red-500" : "border-gray-300"} rounded py-3 px-4`}
                    placeholder="Enter Distance"
                    step="0.1"
                />
                {formik.touched.distance && formik.errors.distance && (
                    <div className="text-red-500 text-sm">{formik.errors.distance}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Driver</label>
                <Select
                    options={drivers}
                    onChange={(option) => formik.setFieldValue("driverId", option?.value)}
                    onBlur={formik.handleBlur}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Driver"
                    isDisabled={loading}
                />
                {formik.touched.driverId && formik.errors.driverId && (
                    <div className="text-red-500 text-sm">{formik.errors.driverId}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Car</label>
                <Select
                    options={cars}
                    onChange={(option) => formik.setFieldValue("carId", option?.value)}
                    onBlur={formik.handleBlur}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Car"
                    isDisabled={loading}
                />
                {formik.touched.carId && formik.errors.carId && (
                    <div className="text-red-500 text-sm">{formik.errors.carId}</div>
                )}
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                    disabled={loading || formik.isSubmitting}
                >
                    Create Booking
                </button>
                <button
                    type="button"
                    className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
                    onClick={onClose}
                    disabled={formik.isSubmitting}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CreateBookingForm;