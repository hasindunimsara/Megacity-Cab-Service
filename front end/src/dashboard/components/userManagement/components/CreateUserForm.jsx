import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const CreateUserForm = ({ onSubmit, onClose, error }) => {
    const [isCopied, setIsCopied] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            roles: "", // Single string initially
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
            roles: Yup.string().required("Role is required"),
        }),
        onSubmit: (values) => {
            const submitValues = {
                ...values,
                roles: [values.roles] // Send as array as expected by SignupRequest
            };
            console.log("Submitting values:", submitValues); // Debug log
            onSubmit(submitValues);
        },
    });

    useEffect(() => {
        const generatePassword = () => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
            let password = "";
            for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        };

        formik.setFieldValue("password", generatePassword());
    }, []);

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(formik.values.password)
            .then(() => {
                setIsCopied(true);
                toast.success("Password copied to clipboard!");
            })
            .catch(() => {
                toast.error("Failed to copy password.");
            });
    };

    const handleEmailChange = (e) => {
        formik.handleChange(e);
    };

    const handleResetPassword = () => {
        const generatePassword = () => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
            let password = "";
            for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        };

        formik.setFieldValue("password", generatePassword());
        setIsCopied(false);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
                <label className="block text-gray-700 font-medium mb-2">Username</label>
                <input
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.username && formik.errors.username ? "border-red-500" : "border-gray-300"} rounded py-3 px-4 leading-tight`}
                    placeholder="Enter Username"
                />
                {formik.touched.username && formik.errors.username && <div className="text-red-500">{formik.errors.username}</div>}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={handleEmailChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"} rounded py-3 px-4 leading-tight`}
                    placeholder="Enter Email"
                />
                {formik.touched.email && formik.errors.email && <div className="text-red-500">{formik.errors.email}</div>}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Password (Auto-generated)</label>
                <div className="flex items-center">
                    <input
                        type="text"
                        name="password"
                        value={formik.values.password}
                        readOnly
                        className="block w-full text-gray-700 border border-gray-300 rounded py-3 px-4 leading-tight"
                    />
                    <button
                        type="button"
                        onClick={handleCopyPassword}
                        className="ml-2 text-white bg-blue-500 rounded p-2 hover:bg-blue-600"
                    >
                        <FaCopy className="text-white" />
                    </button>
                    <button
                        type="button"
                        onClick={handleResetPassword}
                        className="ml-2 text-white bg-red-500 rounded p-2 hover:bg-red-600"
                    >
                        <FiRefreshCw className="text-white" />
                    </button>
                </div>
                {isCopied && <div className="text-green-500 text-sm mt-2">Password copied!</div>}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Role</label>
                <select
                    name="roles"
                    value={formik.values.roles}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.roles && formik.errors.roles ? "border-red-500" : "border-gray-300"} rounded py-3 px-4 leading-tight`}
                >
                    <option value="" disabled>Select a role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                </select>
                {formik.touched.roles && formik.errors.roles && <div className="text-red-500">{formik.errors.roles}</div>}
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                >
                    Create User
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

export default CreateUserForm;