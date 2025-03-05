import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateCarForm = ({ onSubmit, onClose, error }) => {
    const formik = useFormik({
        initialValues: {
            carNumber: "",
            model: "",
        },
        validationSchema: Yup.object({
            carNumber: Yup.string().required("Car number is required"),
            model: Yup.string().required("Model is required"),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
                <label className="block text-gray-700 font-medium mb-2">Car Number</label>
                <input
                    type="text"
                    name="carNumber"
                    value={formik.values.carNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.carNumber && formik.errors.carNumber ? "border-red-500" : "border-gray-300"
                        } rounded py-3 px-4 leading-tight`}
                    placeholder="Enter Car Number (e.g., CAB-001)"
                />
                {formik.touched.carNumber && formik.errors.carNumber && (
                    <div className="text-red-500">{formik.errors.carNumber}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Model</label>
                <input
                    type="text"
                    name="model"
                    value={formik.values.model}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.model && formik.errors.model ? "border-red-500" : "border-gray-300"
                        } rounded py-3 px-4 leading-tight`}
                    placeholder="Enter Car Model (e.g., Toyota Corolla)"
                />
                {formik.touched.model && formik.errors.model && (
                    <div className="text-red-500">{formik.errors.model}</div>
                )}
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                >
                    Create Car
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

export default CreateCarForm;