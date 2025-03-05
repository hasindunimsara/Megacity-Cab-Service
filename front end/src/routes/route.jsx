import React from 'react';
import { Route, Routes } from 'react-router';
import MainLayout from '../libs/layouts/MainLayout';
import RegisterLoginLayout from './../auth/layout/RegisterLoginLayout/index';
import RequireAuth from './../libs/components/RequireAuth';
import DashboardLayout from '../dashboard/layouts/DashboardLayout';
import Dashboard from './../dashboard/components/dashboard/index';
import MyBookings from '../dashboard/components/myBooking';
import { USER_ROLES } from '../libs/constants/roles';
import UserManagements from '../dashboard/components/userManagement';
import CarManagements from '../dashboard/components/carManagement';
import DriverManagements from '../dashboard/components/driverManagement';
import CustomerBookings from '../dashboard/components/customerBookings';
import AdminReports from '../dashboard/components/reports';
import ModBookingManagement from '../dashboard/components/modBookings';

function AppRoute() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route path="/" element={<RegisterLoginLayout />} />

                <Route element={<RequireAuth allowRole={[USER_ROLES.USER, USER_ROLES.ADMIN, USER_ROLES.OPERATOR]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                </Route>

                <Route element={<RequireAuth allowRole={[USER_ROLES.USER]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="/dashboard/my_bookings" element={<MyBookings />} />
                    </Route>
                </Route>

                <Route element={<RequireAuth allowRole={[USER_ROLES.ADMIN]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="/dashboard/user_management" element={<UserManagements />} />
                        <Route path="/dashboard/car_management" element={<CarManagements />} />
                        <Route path="/dashboard/driver_management" element={<DriverManagements />} />
                        <Route path="/dashboard/customer_bookings" element={<CustomerBookings />} />
                        <Route path="/dashboard/all_reports" element={<AdminReports />} />
                    </Route>
                </Route>

                <Route element={<RequireAuth allowRole={[USER_ROLES.OPERATOR]} />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route path="/dashboard/bookings" element={<ModBookingManagement />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoute;
