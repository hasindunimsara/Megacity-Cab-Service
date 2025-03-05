import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../../libs/hooks/UseAuth";
import fetchWithAuth from "../../../../libs/configs/fetchWithAuth";

function Reports() {
    const { auth } = useAuth();
    const [bookingReport, setBookingReport] = useState(null);
    const [revenueReport, setRevenueReport] = useState(null);
    const [driverReport, setDriverReport] = useState([]);
    const [carReport, setCarReport] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchColumn, setSearchColumn] = useState("driverName");
    const [isLoading, setIsLoading] = useState(false);

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const bookingResponse = await fetchWithAuth(`/admin/reports/bookings`, { method: "GET", headers: { Authorization: `Bearer ${auth.accessToken}` }, redirect: "follow" });
            if (bookingResponse.ok) setBookingReport(await bookingResponse.json());
            else toast.error("Failed to fetch booking report");

            const revenueResponse = await fetchWithAuth(`/admin/reports/revenue`, { method: "GET", headers: { Authorization: `Bearer ${auth.accessToken}` }, redirect: "follow" });
            if (revenueResponse.ok) setRevenueReport(await revenueResponse.json());
            else toast.error("Failed to fetch revenue report");

            const driverResponse = await fetchWithAuth(`/admin/reports/drivers`, { method: "GET", headers: { Authorization: `Bearer ${auth.accessToken}` }, redirect: "follow" });
            if (driverResponse.ok) {
                const driverData = await driverResponse.json();
                setDriverReport(driverData || []);
                setFilteredDrivers(driverData || []);
            } else toast.error("Failed to fetch driver report");

            const carResponse = await fetchWithAuth(`/admin/reports/cars`, { method: "GET", headers: { Authorization: `Bearer ${auth.accessToken}` }, redirect: "follow" });
            if (carResponse.ok) {
                const carData = await carResponse.json();
                setCarReport(carData || []);
                setFilteredCars(carData || []);
            } else toast.error("Failed to fetch car report");
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error("Error fetching reports");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [auth.accessToken]);

    useEffect(() => {
        if (searchColumn === "driverName" || searchColumn === "licenseNumber") {
            const filtered = driverReport.filter((driver) => {
                const valueToSearch = searchColumn === "driverName" ? driver.driverName : driver.licenseNumber;
                return valueToSearch?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
            });
            setFilteredDrivers(filtered);
        } else {
            const filtered = carReport.filter((car) => {
                const valueToSearch = searchColumn === "carNumber" ? car.carNumber : car.model;
                return valueToSearch?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
            });
            setFilteredCars(filtered);
        }
    }, [searchQuery, searchColumn, driverReport, carReport]);

    return (
        <div className="ml-64 mt-16 p-6 overflow-y-auto h-screen">
            <Toaster />
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Reports Dashboard</h1>
                <p className="text-gray-600 mt-2">View key insights on bookings, revenue, drivers, and cars.</p>
            </header>

            {isLoading ? (
                <div className="text-center text-gray-500 py-10">Loading reports...</div>
            ) : (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Booking Summary</h2>
                            {bookingReport ? (
                                <div className="space-y-2">
                                    <p className="text-gray-600"><span className="font-medium">Total Bookings:</span> {bookingReport.totalBookings}</p>
                                    <p className="text-gray-600"><span className="font-medium">Daily:</span> {bookingReport.dailyBookings}</p>
                                    <p className="text-gray-600"><span className="font-medium">Weekly:</span> {bookingReport.weeklyBookings}</p>
                                    <p className="text-gray-600"><span className="font-medium">Monthly:</span> {bookingReport.monthlyBookings}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No booking data available</p>
                            )}
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Summary</h2>
                            {revenueReport ? (
                                <div className="space-y-2">
                                    <p className="text-gray-600"><span className="font-medium">Total Revenue:</span> ${revenueReport.totalRevenue.toFixed(2)}</p>
                                    <p className="text-gray-600"><span className="font-medium">Daily:</span> ${revenueReport.dailyRevenue.toFixed(2)}</p>
                                    <p className="text-gray-600"><span className="font-medium">Weekly:</span> ${revenueReport.weeklyRevenue.toFixed(2)}</p>
                                    <p className="text-gray-600"><span className="font-medium">Monthly:</span> ${revenueReport.monthlyRevenue.toFixed(2)}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No revenue data available</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Reports</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center">
                                    <input type="radio" name="searchColumn" value="driverName" checked={searchColumn === "driverName"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                                    Driver Name
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="searchColumn" value="licenseNumber" checked={searchColumn === "licenseNumber"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                                    License Number
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="searchColumn" value="carNumber" checked={searchColumn === "carNumber"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                                    Car Number
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="searchColumn" value="model" checked={searchColumn === "model"} onChange={(e) => setSearchColumn(e.target.value)} className="mr-2" />
                                    Car Model
                                </label>
                            </div>
                            <input
                                name="search"
                                className="w-full sm:w-64 text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Driver Performance</h2>
                        <div className="max-h-64 overflow-y-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">Driver Name</th>
                                        <th className="px-6 py-3">License Number</th>
                                        <th className="px-6 py-3">Total Bookings</th>
                                        <th className="px-6 py-3">Total Earnings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDrivers.length > 0 ? (
                                        filteredDrivers.map((driver) => (
                                            <tr key={driver.driverId} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{driver.driverName}</td>
                                                <td className="px-6 py-4">{driver.licenseNumber}</td>
                                                <td className="px-6 py-4">{driver.totalBookings}</td>
                                                <td className="px-6 py-4">${driver.totalEarnings.toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No drivers found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Car Utilization</h2>
                        <div className="max-h-64 overflow-y-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3">Car Number</th>
                                        <th className="px-6 py-3">Model</th>
                                        <th className="px-6 py-3">Total Bookings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCars.length > 0 ? (
                                        filteredCars.map((car) => (
                                            <tr key={car.carId} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4">{car.carNumber}</td>
                                                <td className="px-6 py-4">{car.model}</td>
                                                <td className="px-6 py-4">{car.totalBookings}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No cars found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reports;