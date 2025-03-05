import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateDriverForm = ({ onSubmit, onClose, error }) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            licenseNumber: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            licenseNumber: Yup.string().required("License number is required"),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
                        } rounded py-3 px-4 leading-tight`}
                    placeholder="Enter Driver Name"
                />
                {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500">{formik.errors.name}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">License Number</label>
                <input
                    type="text"
                    name="licenseNumber"
                    value={formik.values.licenseNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.licenseNumber && formik.errors.licenseNumber ? "border-red-500" : "border-gray-300"
                        } rounded py-3 px-4 leading-tight`}
                    placeholder="Enter License Number"
                />
                {formik.touched.licenseNumber && formik.errors.licenseNumber && (
                    <div className="text-red-500">{formik.errors.licenseNumber}</div>
                )}
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                >
                    Create Driver
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

export default CreateDriverForm;