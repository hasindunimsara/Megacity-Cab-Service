import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../../libs/hooks/UseAuth";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";

function AllOperator() {
    const { auth } = useAuth();
    const [allOperators, setAllOperators] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOperators, setFilteredOperators] = useState([]);
    const [searchColumn, setSearchColumn] = useState("name");

    const fetchAllOperators = async () => {
        try {
            const response = await fetchWithAuth(`/admin/operators`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                redirect: "follow",
            });

            if (response.ok) {
                const result = await response.json();
                setAllOperators(result);
                setFilteredOperators(result);
            } else {
                console.error("Failed to fetch operators");
            }
        } catch (error) {
            console.error("Error fetching operators:", error);
        }
    };

    useEffect(() => {
        fetchAllOperators();
    }, [auth.accessToken]);

    useEffect(() => {
        const filtered = allOperators.filter((operator) => {
            const valueToSearch =
                searchColumn === "name"
                    ? operator.name
                    : searchColumn === "email"
                        ? operator.email
                        : searchColumn === "role"
                            ? operator.role.join(", ")  // Joining array of roles into a string
                            : "";

            return valueToSearch.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredOperators(filtered);
    }, [searchQuery, searchColumn, allOperators]);

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">Operator Management</h1>
                <p className="text-lg font-normal">
                    Manage operators, including user details, roles, and creation dates.
                </p>
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
                            value="email"
                            checked={searchColumn === "email"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Email
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="role"
                            checked={searchColumn === "role"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Role
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
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-gray-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Created At</th>
                        <th scope="col" className="px-6 py-3">Updated At</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOperators.map((operator) => (
                        <tr key={operator._id} className="bg-white border-b">
                            <td className="px-6 py-4">{operator.name}</td>
                            <td className="px-6 py-4">{operator.email}</td>
                            <td className="px-6 py-4">{operator.role.join(", ")}</td>
                            <td className="px-6 py-4">
                                {new Date(operator.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                {new Date(operator.updatedAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllOperator;
