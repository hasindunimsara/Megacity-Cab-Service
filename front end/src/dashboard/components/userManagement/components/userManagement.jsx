import React, { useEffect, useState } from "react";
import 'react-dropdown/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from "../../../../libs/hooks/UseAuth";
import { FaUserPlus } from "react-icons/fa6";
import Popup from "../../../../libs/components/Popup";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";
import CreateUserForm from "./CreateUserForm";
import UpdateUserForm from "./UpdateUserForm";

function UserManagement() {
    const { auth } = useAuth();
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchColumn, setSearchColumn] = useState("username");

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userData, setUserData] = useState({
        type: "create",
        data: {},
        error: null
    });

    const fetchAllUsers = async () => {
        try {
            const response = await fetchWithAuth(`/users/admin/all`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`
                },
                redirect: "follow"
            });
            if (response.ok) {
                const result = await response.json();
                setAllUsers(result);
                setFilteredUsers(result);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [auth.accessToken]);

    useEffect(() => {
        const filtered = allUsers.filter((user) => {
            const valueToSearch =
                searchColumn === "username"
                    ? user.username
                    : searchColumn === "email"
                        ? user.email
                        : "";

            return valueToSearch.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredUsers(filtered);
    }, [searchQuery, searchColumn, allUsers]);

    const handleCreateUser = async (userData) => {
        console.log(userData);
        try {
            const response = await fetchWithAuth(`/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                    "X-API-Key": "{{token}}"
                },
                body: JSON.stringify({
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    roles: userData.roles
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'User created successfully!');
                fetchAllUsers();
                setIsPopupOpen(false);
            } else {
                if (data.error && data.error.errorResponse) {
                    const { errmsg, keyValue } = data.error.errorResponse;
                    if (errmsg && errmsg.includes("duplicate key error")) {
                        const duplicateEmail = keyValue?.email || keyValue?.username;
                        throw new Error(`The ${duplicateEmail.includes('@') ? 'email' : 'username'} ${duplicateEmail} is already in use.`);
                    }
                }
                const errorMessage = data.error?.errorResponse?.errmsg || 'Error creating user';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Error creating user:", error);
            setUserData((prevData) => ({
                ...prevData,
                error: error.message || 'An unexpected error occurred',
            }));
        }
    };

    const handleUpdateUser = async (user) => {
        try {
            const response = await fetchWithAuth(`/admin/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                    "X-API-Key": "{{token}}"
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    roles: user.roles
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'User updated successfully!');
                fetchAllUsers();
                setIsPopupOpen(false);
            } else {
                if (data.error && data.error.errorResponse) {
                    const { errmsg, keyValue } = data.error.errorResponse;
                    if (errmsg && errmsg.includes("duplicate key error")) {
                        const duplicateEmail = keyValue?.email || keyValue?.username;
                        throw new Error(`The ${duplicateEmail.includes('@') ? 'email' : 'username'} ${duplicateEmail} is already in use.`);
                    }
                }
                const errorMessage = data.error?.errorResponse?.errmsg || 'Error updating user';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Error updating user:", error);
            setUserData((prevData) => ({
                ...prevData,
                error: error.message || 'An unexpected error occurred while updating the user.',
            }));
            toast.error(error.message || 'Something went wrong while updating the user.');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetchWithAuth(`/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                    "X-API-Key": "{{token}}",
                },
            });

            // Handle responses that might not have a body (e.g., 204 No Content)
            let data = {};
            if (response.status !== 204) {
                data = await response.json();
            }

            if (response.ok) {
                toast.success(data.message || 'User deleted successfully!');
                fetchAllUsers();
            } else {
                const errorMessage = data.error?.errorResponse?.errmsg || `Error deleting user (Status: ${response.status})`;
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            setUserData((prevData) => ({
                ...prevData,
                error: error.message || 'An unexpected error occurred while deleting the user.',
            }));
            toast.error(error.message || 'Something went wrong while deleting the user.');
        }
    };

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">User Management</h1>
                <p className="text-lg font-normal">Manage user details including username, email, and roles assigned.</p>
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Search By:</label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="username"
                            checked={searchColumn === "username"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Username
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="email"
                            checked={searchColumn === "email"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Email
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
                        setIsPopupOpen(true);
                        setUserData({
                            type: "create",
                            data: {},
                        });
                    }}
                >
                    <FaUserPlus className="w-5 h-5" />
                </button>
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-gray-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Username</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Roles</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr
                            key={user.id}
                            className="bg-white cursor-pointer border-b border-gray-300"
                        >
                            <td className="px-6 py-4 font-medium text-gray-600">{user.username}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{user.email}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{user.roles.join(", ")}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            console.log("Editing user:", user);
                                            setUserData({
                                                type: "update",
                                                data: user,
                                            });
                                            setIsPopupOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="ml-2 text-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Deleting user ID:", user.id);
                                            handleDeleteUser(user.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={userData.type === "create" ? "Create User" : "Edit User"}
                width="w-[500px]"
            >
                {userData.type === "create" ? (
                    <CreateUserForm
                        onSubmit={handleCreateUser}
                        onClose={() => setIsPopupOpen(false)}
                        error={userData.error}
                    />
                ) : userData.type === 'update' && (
                    <UpdateUserForm
                        user={userData.data}
                        onSubmit={handleUpdateUser}
                        onClose={() => setIsPopupOpen(false)}
                        error={userData.error}
                    />
                )}
            </Popup>
        </div>
    );
}

export default UserManagement;