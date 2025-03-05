import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import useAuth from "../../../../libs/hooks/UseAuth";
import Popup from "../../../../libs/components/Popup";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";
import { FaUser } from "react-icons/fa6";
import CreateDriverForm from "./CreateDriverForm";
import UpdateDriverForm from "./UpdateDriverForm";

function DriverManagement() {
    const { auth } = useAuth();
    const [allDrivers, setAllDrivers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [searchColumn, setSearchColumn] = useState("name");
    const [isLoading, setIsLoading] = useState(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [driverData, setDriverData] = useState({
        type: "create",
        data: {},
        error: null
    });

    const fetchAllDrivers = async () => {
        try {
            setIsLoading(true);
            const response = await fetchWithAuth(`/admin/drivers`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`
                },
                redirect: "follow"
            });

            if (response.ok) {
                const result = await response.json();
                setAllDrivers(result || []);
                setFilteredDrivers(result || []);
            } else {
                console.error('Failed to fetch drivers');
                toast.error('Failed to fetch drivers');
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
            toast.error('Error fetching drivers');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDrivers();
    }, [auth.accessToken]);

    useEffect(() => {
        const filtered = allDrivers.filter((driver) => {
            const valueToSearch =
                searchColumn === "name"
                    ? driver.name
                    : driver.licenseNumber;

            return valueToSearch?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        });
        setFilteredDrivers(filtered);
    }, [searchQuery, searchColumn, allDrivers]);

    const handleDeleteDriver = async (driverId) => {
        try {
            const response = await fetchWithAuth(`/admin/drivers/${driverId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
            });

            if (response.ok) {
                fetchAllDrivers();
                toast.success('Driver deleted successfully!');
            } else {
                toast.error('Error deleting driver');
            }
        } catch (error) {
            console.error('Error deleting driver:', error);
            toast.error('Something went wrong while deleting the driver.');
        }
    };

    const handleCreateDriver = async (driverData) => {
        try {
            const response = await fetchWithAuth(`/admin/drivers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    name: driverData.name,
                    licenseNumber: driverData.licenseNumber,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Driver created successfully!');
                fetchAllDrivers();
                setIsPopupOpen(false);
            } else {
                throw new Error(data.error || 'Error creating driver');
            }
        } catch (error) {
            console.error("Error creating driver:", error);
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    const handleUpdateDriver = async (driver) => {
        try {
            const response = await fetchWithAuth(`/admin/drivers/${driver.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    name: driver.name,
                    licenseNumber: driver.licenseNumber,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Driver updated successfully!');
                fetchAllDrivers();
                setIsPopupOpen(false);
            } else {
                throw new Error(data.error || 'Error updating driver');
            }
        } catch (error) {
            console.error("Error updating driver:", error);
            toast.error(error.message || 'Something went wrong while updating the driver.');
        }
    };

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">Driver Management</h1>
                <p className="text-lg font-normal">Manage drivers including their names and license numbers.</p>
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Search By:</label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="name"
                            checked={searchColumn === "name"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Name
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="licenseNumber"
                            checked={searchColumn === "licenseNumber"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        License Number
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
                        setDriverData({ type: "create", data: {}, error: null });
                        setIsPopupOpen(true);
                    }}
                >
                    <FaUser className="w-5 h-5" />
                </button>
            </div>

            {isLoading ? (
                <div className="text-center">Loading drivers...</div>
            ) : (
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">License Number</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDrivers && filteredDrivers.length > 0 ? (
                            filteredDrivers.map((driver) => (
                                <tr key={driver.id} className="bg-white border-b">
                                    <td className="px-6 py-4">{driver.name}</td>
                                    <td className="px-6 py-4">{driver.licenseNumber}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => {
                                            setDriverData({ type: "update", data: driver, error: null });
                                            setIsPopupOpen(true);
                                        }}>
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteDriver(driver.id)} className="ml-2 text-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center">
                                    No drivers found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={driverData.type === "create" ? "Create Driver" : "Edit Driver"}
                width="w-[500px]"
            >
                {driverData.type === "create" ? (
                    <CreateDriverForm
                        onSubmit={handleCreateDriver}
                        onClose={() => setIsPopupOpen(false)}
                        error={driverData.error}
                    />
                ) : (
                    <UpdateDriverForm
                        driver={driverData.data}
                        onSubmit={handleUpdateDriver}
                        onClose={() => setIsPopupOpen(false)}
                        error={driverData.error}
                    />
                )}
            </Popup>
        </div>
    );
}

export default DriverManagement;