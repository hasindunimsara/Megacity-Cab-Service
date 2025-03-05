import React from 'react';
import { Route, Routes } from 'react-router';
import MainLayout from '../libs/layouts/MainLayout';
import RegisterLoginLayout from './../auth/layout/RegisterLoginLayout/index';
import RequireAuth from './../libs/components/RequireAuth';
import DashboardLayout from '../dashboard/layouts/DashboardLayout';
import Dashboard from './../dashboard/components/dashboard/index';
import SeatReservation from '../dashboard/components/seatReservation';
import Settings from '../dashboard/components/settings';
import MyBookings from '../dashboard/components/myBooking';
import { USER_ROLES } from '../libs/constants/roles';
import UserManagements from '../dashboard/components/userManagement';
import CarManagements from '../dashboard/components/carManagement';
import AllOperators from '../dashboard/components/allOperators';
import TripManagements from '../dashboard/components/tripManagement';
import Bookings from '../dashboard/components/booking';
import DriverManagements from '../dashboard/components/driverManagement';
import CustomerBookings from '../dashboard/components/customerBookings';
import AdminReports from '../dashboard/components/reports';

function AppRoute() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<RegisterLoginLayout />} />

                <Route element={<RequireAuth allowRole={[USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.OPERATOR]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dashboard/settings" element={<Settings />} />
                    </Route>
                </Route>

                <Route element={<RequireAuth allowRole={[USER_ROLES.USER]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="/dashboard/seat_reservation" element={<SeatReservation />} />
                        <Route path="/dashboard/my_bookings" element={<MyBookings />} />
                    </Route>
                </Route>

                <Route element={<RequireAuth allowRole={[USER_ROLES.ADMIN]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="/dashboard/user_management" element={<UserManagements />} />
                        <Route path="/dashboard/car_management" element={<CarManagements />} />
                        <Route path="/dashboard/driver_management" element={<DriverManagements />} />
                        <Route path="/dashboard/customer_bookings" element={<CustomerBookings />} />
                        <Route path="/dashboard/all_payments" element={<AdminReports />} />
                        <Route path="/dashboard/all_operators" element={<AllOperators />} />
                    </Route>
                </Route>

                {/* <Route element={<RequireAuth allowRole={[USER_ROLES.ADMIN, USER_ROLES.OPERATOR]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="/dashboard/driver_management" element={<BusManagements />} />
                    </Route>
                </Route> */}

                <Route element={<RequireAuth allowRole={[USER_ROLES.OPERATOR]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="/dashboard/trip_management" element={<TripManagements />} />
                        <Route path="/dashboard/bookings" element={<Bookings />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoute;
