import React, { useState, useEffect } from 'react';
import { HiOutlineDocumentReport } from "react-icons/hi";
import useAuth from '../../../../libs/hooks/UseAuth';
import { getGreetingMessage } from '../../../../libs/helpers/greeting';
import fetchWithAuth from '../../../../libs/configs/fetchWithAuth';

function Admin() {
  const { auth } = useAuth();

  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const greeting = getGreetingMessage();

  useEffect(() => {
    const fetchCars = async () => {
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
          setCars(result);
        } else {
          console.error('Failed to fetch cars');
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetchWithAuth(`/admin/drivers`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${auth.accessToken}`
          },
          redirect: "follow"
        });
        if (response.ok) {
          const result = await response.json();
          setDrivers(result);
        } else {
          console.error('Failed to fetch drivers');
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await fetchWithAuth(`/admin/bookings`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${auth.accessToken}`
          },
          redirect: "follow"
        });
        if (response.ok) {
          const result = await response.json();
          setBookings(result);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchCars();
    fetchDrivers();
    fetchBookings();
  }, []);

  return (
    <div className="ml-64 mt-16 p-6 overflow-y-auto h-screen">
      <div className="mb-10 w-4/5">
        <h1 className="text-2xl mb-4 font-semibold capitalize">Hello, {greeting} !!</h1>
        <p className='text-lg font-normal'>
          The admin dashboard is a centralized hub where administrators can manage various aspects of the system efficiently.</p>
      </div>
      <div>
        <div className='grid grid-cols-3 gap-4'>
          <div className="flex-grow flex flex-col ml-4 p-10 border border-gray-300 rounded-md">
            <h1 className='text-4xl font-bold'>{cars.length}</h1>
            <div className="pt-5 text-base font-semibold leading-7">
              <p>
                <a href="#" className="text-sky-500 transition-all duration-300 group-hover:font-bold">
                  Cars
                </a>
              </p>
            </div>
            <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:font-bold">
              <p>View all registered cars</p>
            </div>
          </div>

          <div className="flex-grow flex flex-col ml-4 p-10 border border-gray-300 rounded-md">
            <h1 className='text-4xl font-bold'>{drivers.length}</h1>
            <div className="pt-5 text-base font-semibold leading-7">
              <p>
                <a href="#" className="text-sky-500 transition-all duration-300 group-hover:font-bold">
                  Drivers
                </a>
              </p>
            </div>
            <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:font-bold">
              <p>View all registered drivers</p>
            </div>
          </div>

          <div className="flex-grow flex flex-col ml-4 p-10 border border-gray-300 rounded-md">
            <h1 className='text-4xl font-bold'>{bookings.length}</h1>
            <div className="pt-5 text-base font-semibold leading-7">
              <p>
                <a href="#" className="text-sky-500 transition-all duration-300 group-hover:font-bold">
                  Bookings
                </a>
              </p>
            </div>
            <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:font-bold">
              <p>View all booking details</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto w-4/5 mt-10">
          <div className='mb-5'>
            <h1 className='text-xl font-semibold'>All Bookings</h1>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-300">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Booking Number</th>
                <th scope="col" className="px-6 py-3">Customer Name</th>
                <th scope="col" className="px-6 py-3">Phone Number</th>
                <th scope="col" className="px-6 py-3">Destination</th>
                <th scope="col" className="px-6 py-3">Distance (km)</th>
                <th scope="col" className="px-6 py-3">Total Amount</th>
                <th scope="col" className="px-6 py-3">Driver Name</th>
                <th scope="col" className="px-6 py-3">Car Number</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {booking.bookingNumber}
                  </td>
                  <td className="px-6 py-4">{booking.customerName}</td>
                  <td className="px-6 py-4">{booking.phoneNumber}</td>
                  <td className="px-6 py-4">{booking.destination}</td>
                  <td className="px-6 py-4">{booking.distance}</td>
                  <td className="px-6 py-4">
                    {booking.totalAmount ? `$${booking.totalAmount}` : 'Pending'}
                  </td>
                  <td className="px-6 py-4">{booking.driverName}</td>
                  <td className="px-6 py-4">{booking.carNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;