import React, { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import useAuth from "../../../../libs/hooks/UseAuth";
import Popup from "../../../../libs/components/Popup";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";
import { FaCar } from "react-icons/fa6";
import CreateCarForm from "./CreateCarForm";
import UpdateCarForm from "./UpdateCarForm";

function CarManagement() {
    const { auth } = useAuth();
    const [allCars, setAllCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchColumn, setSearchColumn] = useState("carNumber");

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [carData, setCarData] = useState({
        type: "create",
        data: {},
        error: null
    });

    const fetchAllCars = async () => {
        try {
            const response = await fetchWithAuth(`/admin/cars`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`
                },
                redirect: "follow"
            });

            if (response.ok) {
                const result = await response.json();
                setAllCars(result);
                setFilteredCars(result);
            } else {
                console.error('Failed to fetch cars');
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    useEffect(() => {
        fetchAllCars();
    }, [auth.accessToken]);

    useEffect(() => {
        const filtered = allCars.filter((car) => {
            const valueToSearch =
                searchColumn === "carNumber"
                    ? car.carNumber
                    : car.model;

            return valueToSearch.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredCars(filtered);
    }, [searchQuery, searchColumn, allCars]);

    const handleDeleteCar = async (carId) => {
        try {
            const response = await fetchWithAuth(`/admin/cars/${carId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
            });

            if (response.ok) {
                toast.success('Car deleted successfully!');
                fetchAllCars();
            } else {
                toast.error('Error deleting car');
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            toast.error('Something went wrong while deleting the car.');
        }
    };

    const handleSaveCar = async (carData) => {
        try {
            const response = await fetchWithAuth(`/admin/cars`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    carNumber: carData.carNumber,
                    model: carData.model,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Car created successfully!');
                fetchAllCars();
                setIsPopupOpen(false);
            } else {
                throw new Error(data.error || 'Error creating car');
            }
        } catch (error) {
            console.error("Error creating car:", error);
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    const handleUpdateCar = async (car) => {
        try {
            const response = await fetchWithAuth(`/admin/cars/${car.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${auth.accessToken}`,
                },
                body: JSON.stringify({
                    carNumber: car.carNumber,
                    model: car.model,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Car updated successfully!');
                fetchAllCars();
                setIsPopupOpen(false);
            } else {
                throw new Error(data.error || 'Error updating car');
            }
        } catch (error) {
            console.error("Error updating car:", error);
            toast.error(error.message || 'Something went wrong while updating the car.');
        }
    };

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">Car Management</h1>
                <p className="text-lg font-normal">Manage cars including car number and model.</p>
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Search By:</label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="carNumber"
                            checked={searchColumn === "carNumber"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Car Number
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="model"
                            checked={searchColumn === "model"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Model
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
                        setCarData({ type: "create", data: {}, error: null });
                        setIsPopupOpen(true);
                    }}
                >
                    <FaCar className="w-5 h-5" />
                </button>
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-gray-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Car Number</th>
                        <th scope="col" className="px-6 py-3">Model</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCars.map((car) => (
                        <tr
                            key={car.id}
                            className="bg-white cursor-pointer border-b border-gray-300"
                        >
                            <td className="px-6 py-4 font-medium text-gray-600">{car.carNumber}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">{car.model}</td>
                            <td className="px-6 py-4 font-medium text-gray-600">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setCarData({ type: "update", data: car, error: null });
                                            setIsPopupOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="ml-2 text-red-600"
                                        onClick={() => handleDeleteCar(car.id)}
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
                title={carData.type === "create" ? "Create Car" : "Edit Car"}
                width="w-[500px]"
            >
                {carData.type === "create" ? (
                    <CreateCarForm
                        onSubmit={handleSaveCar}
                        onClose={() => setIsPopupOpen(false)}
                        error={carData.error}
                    />
                ) : (
                    <UpdateCarForm
                        car={carData.data}
                        onSubmit={handleUpdateCar}
                        onClose={() => setIsPopupOpen(false)}
                        error={carData.error}
                    />
                )}
            </Popup>
        </div>
    );
}

export default CarManagement;