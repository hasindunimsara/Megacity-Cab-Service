import React, { useState, useEffect } from 'react';
import { HiOutlineDocumentReport } from "react-icons/hi";
import useAuth from '../../../../libs/hooks/UseAuth';
import { getGreetingMessage } from '../../../../libs/helpers/greeting';
import fetchWithAuth from '../../../../libs/configs/fetchWithAuth';

function Operator() {
  const { setAuth, auth } = useAuth();
  const [buses, setBuses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tripCount, setTripCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const greeting = getGreetingMessage();

  useEffect(() => {
    // Fetch buses data
    const fetchBuses = async () => {
      try {
        const response = await fetchWithAuth('/operator/buses', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${auth.accessToken}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setBuses(result.data); // Update buses state
        } else {
          console.error('Failed to fetch buses');
        }
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };

    // Fetch trips data
    const fetchTrips = async () => {
      try {
        const response = await fetchWithAuth('/operator/trips', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${auth.accessToken}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setTrips(result); // Update trips state
          setTripCount(result.length); // Set the count of trips
        } else {
          console.error('Failed to fetch trips');
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    // Fetch bookings data
    const fetchBookings = async () => {
      try {
        const response = await fetchWithAuth('/operator/bookings', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${auth.accessToken}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          setBookings(result); // Update bookings state
          setBookingCount(result.length); // Set the count of bookings
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBuses();
    fetchTrips();
    fetchBookings();
  }, [auth.accessToken]);

  return (
    <div className="m-10 w-full">
      <div className="mb-10 w-4/5">
        <h1 className="text-2xl mb-4 font-semibold capitalize">Hello, {greeting} !!</h1>
        <p className='text-lg font-normal'>
          The operator dashboard is where you can manage buses, trips, and bookings efficiently.
        </p>
      </div>
      <div>
        <div className='grid grid-cols-3 gap-4 w-4/5'>
          {/* Buses Count */}
          <div className="flex-grow flex flex-col ml-4 p-10 border border-gray-300 rounded-md">
            <h1 className='text-4xl font-bold'>{buses.length}</h1>
            <div className="pt-5 text-base font-semibold leading-7">
              <p>
                <a href="#" className="text-sky-500 transition-all duration-300 group-hover:font-bold">
                  Buses
                </a>
              </p>
            </div>
            <div className="space-y-6 pt-5 text-base leading-7 text-gray-600">
              <p>
                Manage all the buses in the system here.
              </p>
            </div>
          </div>

          {/* Trips Count */}
          <div className="flex-grow flex flex-col ml-4 p-10 border border-gray-300 rounded-md">
            <h1 className='text-4xl font-bold'>{tripCount}</h1>
            <div className="pt-5 text-base font-semibold leading-7">
              <p>
                <a href="#" className="text-sky-500 transition-all duration-300 group-hover:font-bold">
                  Trips
                </a>
              </p>
            </div>
            <div className="space-y-6 pt-5 text-base leading-7 text-gray-600">
              <p>
                View and manage trips scheduled for buses.
              </p>
            </div>
          </div>

          {/* Bookings Count */}
          <div className="flex-grow flex flex-col ml-4 p-10 border border-gray-300 rounded-md">
            <h1 className='text-4xl font-bold'>{bookingCount}</h1>
            <div className="pt-5 text-base font-semibold leading-7">
              <p>
                <a href="#" className="text-sky-500 transition-all duration-300 group-hover:font-bold">
                  Bookings
                </a>
              </p>
            </div>
            <div className="space-y-6 pt-5 text-base leading-7 text-gray-600">
              <p>
                Manage all the user bookings for the trips here.
              </p>
            </div>
          </div>
        </div>


        {/* Trips List */}
        <div className="relative overflow-x-auto w-4/5 mt-10">
          <div className='mb-5'>
            <h1 className='text-xl font-semibold'>All Trips</h1>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 border border-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Trip Name</th>
                <th scope="col" className="px-6 py-3">Bus Number</th>
                <th scope="col" className="px-6 py-3">Departure Date</th>
                <th scope="col" className="px-6 py-3">Available Seats</th>
                <th scope="col" className="px-6 py-3">Ticket Price</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip._id} className="bg-white border-b">
                  <td className="px-6 py-4">{trip.route.name}</td>
                  <td className="px-6 py-4">{trip.bus.busNumber}</td>
                  <td className="px-6 py-4">{new Date(trip.departureDate).toLocaleString()}</td>
                  <td className="px-6 py-4">{trip.availableSeats}</td>
                  <td className="px-6 py-4">${trip.ticket_price.$numberDecimal}</td>
                  <td className="px-6 py-4">{trip.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Operator;
