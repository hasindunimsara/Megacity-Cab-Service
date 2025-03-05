import React, { useState, useEffect } from 'react';
import useAuth from '../../../../libs/hooks/UseAuth';
import { getGreetingMessage } from '../../../../libs/helpers/greeting';
import fetchWithAuth from '../../../../libs/configs/fetchWithAuth';
import toast, { Toaster } from 'react-hot-toast';

function UserComponent() {
    const { auth } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const greeting = getGreetingMessage();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const response = await fetchWithAuth(`/customer/bookings`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${auth.accessToken}` },
                    redirect: "follow"
                });
                if (response.ok) {
                    const result = await response.json();
                    setBookings(result || []);
                } else {
                    console.error('Failed to fetch bookings');
                    toast.error('Failed to fetch bookings');
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
                toast.error('Error fetching bookings');
            }
        };

        const fetchPayments = async () => {
            try {
                const response = await fetchWithAuth(`/customer/payments`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${auth.accessToken}` },
                    redirect: "follow"
                });
                if (response.ok) {
                    const result = await response.json();
                    setPayments(result || []);
                } else {
                    console.error('Failed to fetch payments');
                    toast.error('Failed to fetch payments');
                }
            } catch (error) {
                console.error('Error fetching payments:', error);
                toast.error('Error fetching payments');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
        fetchPayments();
    }, [auth.accessToken]);

    return (
        <div className="ml-64 mt-16 p-6 overflow-y-auto h-screen bg-gray-100">
            <Toaster />
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 capitalize">Hello, {greeting}!</h1>
                <p className="text-gray-600 mt-2">View your booking history and payment details below.</p>
            </header>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Bookings Overview</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-4xl font-bold text-gray-800">{bookings.length}</p>
                            <p className="text-gray-600 mt-2">Total Bookings</p>
                        </div>
                        <div className="text-gray-500">
                            <p>Your past and current trips.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Payments Overview</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-4xl font-bold text-gray-800">{payments.length}</p>
                            <p className="text-gray-600 mt-2">Total Payments</p>
                        </div>
                        <div className="text-gray-500">
                            <p>Your payment history.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">My Bookings</h2>
                {isLoading ? (
                    <div className="text-center text-gray-500 py-10">Loading...</div>
                ) : (
                    <div className="max-h-64 overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Booking Number</th>
                                    <th className="px-6 py-3">Destination</th>
                                    <th className="px-6 py-3">Distance (km)</th>
                                    <th className="px-6 py-3">Total Amount</th>
                                    <th className="px-6 py-3">Driver</th>
                                    <th className="px-6 py-3">Car</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{booking.bookingNumber}</td>
                                            <td className="px-6 py-4">{booking.destination}</td>
                                            <td className="px-6 py-4">{booking.distance.toFixed(2)}</td>
                                            <td className="px-6 py-4">${booking.totalAmount ? booking.totalAmount.toFixed(2) : 'N/A'}</td>
                                            <td className="px-6 py-4">{booking.driverName}</td>
                                            <td className="px-6 py-4">{booking.carNumber}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No bookings found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Payments Table */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">My Payments</h2>
                {isLoading ? (
                    <div className="text-center text-gray-500 py-10">Loading...</div>
                ) : (
                    <div className="max-h-64 overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Booking Number</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Payment Date</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length > 0 ? (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{payment.bookingNumber}</td>
                                            <td className="px-6 py-4">${payment.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4">{new Date(payment.paymentDate).toLocaleString()}</td>
                                            <td className="px-6 py-4">{payment.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                            No payments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserComponent;