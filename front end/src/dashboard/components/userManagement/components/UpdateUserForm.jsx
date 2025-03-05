import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

const UpdateUserForm = ({ user, onSubmit, onClose, error }) => {
    const [isCopied, setIsCopied] = useState(false);

    const generatePassword = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const formik = useFormik({
        initialValues: {
            id: user?._id || user?.id || "",
            username: user?.username || "",
            email: user?.email || "",
            password: "", // Start blank since API doesn’t provide it
            roles: user?.roles?.[0] || "user",
        },
        enableReinitialize: true, // Reinitialize when user prop changes
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            // Password is optional unless explicitly set
            password: Yup.string().min(8, "Password must be at least 8 characters"),
            roles: Yup.string().required("Role is required"),
        }),
        onSubmit: (values) => {
            const submitValues = {
                id: values.id,
                username: values.username,
                email: values.email,
                // Only include password if it’s provided; backend can ignore if empty
                ...(values.password && { password: values.password }),
                roles: [values.roles],
            };
            console.log("Submitting values:", submitValues);
            onSubmit(submitValues);
        },
    });

    const handleCopyPassword = () => {
        if (!formik.values.password) {
            toast.error("No password to copy!");
            return;
        }
        navigator.clipboard
            .writeText(formik.values.password)
            .then(() => {
                setIsCopied(true);
                toast.success("Password copied to clipboard!");
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(() => {
                toast.error("Failed to copy password.");
            });
    };

    const handleResetPassword = () => {
        const newPassword = generatePassword();
        formik.setFieldValue("password", newPassword);
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
                    className={`block w-full text-gray-700 border ${formik.touched.username && formik.errors.username
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded py-3 px-4 leading-tight`}
                    placeholder="Enter Username"
                />
                {formik.touched.username && formik.errors.username && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded py-3 px-4 leading-tight`}
                    placeholder="Enter Email"
                />
                {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Password (Leave blank to keep unchanged)
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`block w-full text-gray-700 border ${formik.touched.password && formik.errors.password
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded py-3 px-4 leading-tight`}
                        placeholder="Enter new password or reset"
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
                {isCopied && (
                    <div className="text-green-500 text-sm mt-2">Password copied!</div>
                )}
                {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Role</label>
                <select
                    name="roles"
                    value={formik.values.roles}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`block w-full text-gray-700 border ${formik.touched.roles && formik.errors.roles
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded py-3 px-4 leading-tight`}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                </select>
                {formik.touched.roles && formik.errors.roles && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.roles}</div>
                )}
            </div>

            <div className="mt-4 flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                >
                    Update User
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

export default UpdateUserForm;