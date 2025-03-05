import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../../libs/hooks/UseAuth";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";

function AllPayment() {
    const { auth } = useAuth();
    const [allPayments, setAllPayments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [searchColumn, setSearchColumn] = useState("paymentMethod");

    const fetchAllPayments = async () => {
        try {
            const response = await fetchWithAuth(`/admin/payments`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
                redirect: "follow",
            });

            if (response.ok) {
                const result = await response.json();
                setAllPayments(result);
                setFilteredPayments(result);
            } else {
                console.error("Failed to fetch payments");
            }
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };

    useEffect(() => {
        fetchAllPayments();
    }, [auth.accessToken]);

    useEffect(() => {
        const filtered = allPayments.filter((payment) => {
            const valueToSearch =
                searchColumn === "paymentMethod"
                    ? payment.paymentMethod
                    : searchColumn === "status"
                        ? payment.status
                        : searchColumn === "bookingId"
                            ? payment.bookingId
                            : "";

            return valueToSearch.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredPayments(filtered);
    }, [searchQuery, searchColumn, allPayments]);

    return (
        <div className="m-10 w-full">
            <Toaster />
            <div className="mb-12 w-3/4">
                <h1 className="text-2xl mb-4 font-semibold">Payment Management</h1>
                <p className="text-lg font-normal">
                    Manage payments, including details like payment method, status, and amounts.
                </p>
            </div>

            <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-medium">Search By:</label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="paymentMethod"
                            checked={searchColumn === "paymentMethod"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Payment Method
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="status"
                            checked={searchColumn === "status"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Status
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="searchColumn"
                            value="bookingId"
                            checked={searchColumn === "bookingId"}
                            onChange={(e) => setSearchColumn(e.target.value)}
                            className="mr-2"
                        />
                        Booking ID
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
                        <th scope="col" className="px-6 py-3">Amount</th>
                        <th scope="col" className="px-6 py-3">Payment Method</th>
                        <th scope="col" className="px-6 py-3">Booking ID</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Payment Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPayments.map((payment) => (
                        <tr key={payment._id} className="bg-white border-b">
                            <td className="px-6 py-4">{payment.amount}</td>
                            <td className="px-6 py-4">{payment.paymentMethod}</td>
                            <td className="px-6 py-4">{payment.booking._id}</td>
                            <td className="px-6 py-4">{payment.status}</td>
                            <td className="px-6 py-4">
                                {new Date(payment.paymentDate).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllPayment;
