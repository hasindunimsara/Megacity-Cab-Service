import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";
import Select from "react-select";

const CreateBusScheduleForm = ({ onSubmit, onClose, auth }) => {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [busCapacity, setBusCapacity] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`/operator/buses`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                redirect: "follow",
            });

            if (response.ok) {
                const result = await response.json();
                setBuses(
                    result.data.map((bus) => ({
                        value: bus._id,
                        label: `${bus.busNumber} (Capacity: ${bus.capacity})`,
                        capacity: bus.capacity,
                    }))
                );
            } else {
                console.error("Failed to fetch buses");
                toast.error("Failed to load buses.");
            }
        } catch (error) {
            console.error("Error fetching buses:", error);
            toast.error("An error occurred while fetching buses.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const roleBasedUrl = auth.userRole === "admin" ? "admin" : "operator";
            const response = await fetchWithAuth(`/${roleBasedUrl}/routes`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                redirect: "follow",
            });

            if (response.ok) {
                const result = await response.json();
                setRoutes(
                    result.data.map((route) => ({
                        value: route._id,
                        label: `${route.name} (${route.startPoint} - ${route.endPoint})`,
                    }))
                );
            } else {
                console.error("Failed to fetch routes");
                toast.error("Failed to load routes.");
            }
        } catch (error) {
            console.error("Error fetching routes:", error);
            toast.error("An error occurred while fetching routes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuses();
        fetchRoutes();
    }, [auth.accessToken]);

    const formik = useFormik({
        initialValues: {
            bus: "",
            availableSeats: buses.capacity || "",
            route: "",
            ticketPrice: "",
        },
        validationSchema: Yup.object({
            bus: Yup.string().required("Bus is required"),
            availableSeats: Yup.number()
                .required("Available seats are required")
                .min(1, "Seats must be at least 1")
                .test(
                    "max-seats",
                    (value, context) => {
                        const capacity = busCapacity || "unknown";
                        return `Seats cannot exceed bus capacity (${capacity})`;
                    },
                    (value) => !busCapacity || value <= busCapacity
                ),
            route: Yup.string().required("Route is required"),
            ticketPrice: Yup.number()
                .required("Ticket price is required")
                .min(0, "Price must be a positive number"),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    useEffect(() => {
        if (busCapacity) {
            formik.setFieldValue("availableSeats", busCapacity);
        }
    }, [busCapacity]);

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Toaster />

            <div>
                <label className="block text-gray-700 font-medium mb-2">Bus</label>
                <Select
                    options={buses}
                    onChange={(option) => {
                        formik.setFieldValue("bus", option?.value);
                        setBusCapacity(option?.capacity || null);
                    }}
                    onBlur={formik.handleBlur}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Bus"
                />
                {formik.touched.bus && formik.errors.bus && (
                    <div className="text-red-500">{formik.errors.bus}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Available Seats</label>
                <input
                    type="number"
                    name="availableSeats"
                    value={formik.values.availableSeats}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.availableSeats && formik.errors.availableSeats
                        ? "border-red-500"
                        : "border-gray-300"
                        } rounded py-3 px-4 leading-tight`}
                    placeholder="Enter Available Seats"
                    max={busCapacity || ""}
                />
                {formik.touched.availableSeats && formik.errors.availableSeats && (
                    <div className="text-red-500">{formik.errors.availableSeats}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Route</label>
                <Select
                    options={routes}
                    onChange={(option) => formik.setFieldValue("route", option?.value)}
                    onBlur={formik.handleBlur}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Route"
                />
                {formik.touched.route && formik.errors.route && (
                    <div className="text-red-500">{formik.errors.route}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Ticket Price</label>
                <input
                    type="number"
                    name="ticketPrice"
                    value={formik.values.ticketPrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.ticketPrice && formik.errors.ticketPrice
                        ? "border-red-500"
                        : "border-gray-300"
                        } rounded py-3 px-4 leading-tight`}
                    placeholder="Enter Ticket Price"
                />
                {formik.touched.ticketPrice && formik.errors.ticketPrice && (
                    <div className="text-red-500">{formik.errors.ticketPrice}</div>
                )}
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                >
                    Create Schedule
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
};

export default CreateBusScheduleForm;
