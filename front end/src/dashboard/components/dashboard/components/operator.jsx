import React, { useState, useEffect } from 'react';
import useAuth from '../../../../libs/hooks/UseAuth';
import { getGreetingMessage } from '../../../../libs/helpers/greeting';
import fetchWithAuth from '../../../../libs/configs/fetchWithAuth';
import toast, { Toaster } from 'react-hot-toast';

function Operator() {
  const { auth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const greeting = getGreetingMessage();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await fetchWithAuth('/moderator/bookings', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${auth.accessToken}`,
          },
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [auth.accessToken]);

  return (
    <div className="ml-64 mt-16 p-6 overflow-y-auto h-screen">
      <Toaster />
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 capitalize">Hello, {greeting}!</h1>
        <p className="text-gray-600 mt-2">Manage and review all customer bookings efficiently.</p>
      </header>

      {/* Summary Card */}
      <div className="mb-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Booking Overview</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-gray-800">{bookings.length}</p>
              <p className="text-gray-600 mt-2">Total Bookings</p>
            </div>
            <div className="text-gray-500">
              <p>Monitor and manage all bookings from here.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">All Bookings</h2>
        {isLoading ? (
          <div className="text-center text-gray-500 py-10">Loading bookings...</div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3">Booking Number</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Address</th>
                  <th className="px-6 py-3">Phone Number</th>
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
                      <td className="px-6 py-4">{booking.customerName}</td>
                      <td className="px-6 py-4">{booking.address}</td>
                      <td className="px-6 py-4">{booking.phoneNumber}</td>
                      <td className="px-6 py-4">{booking.destination}</td>
                      <td className="px-6 py-4">{booking.distance.toFixed(2)}</td>
                      <td className="px-6 py-4">${booking.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">{booking.driverName}</td>
                      <td className="px-6 py-4">{booking.carNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                      No bookings found
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

export default Operator;