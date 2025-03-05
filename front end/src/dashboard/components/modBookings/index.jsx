import React from "react";
import useAuth from '../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import BookingManagement from "./components/bookingManagement";

function ModBookingManagement() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.OPERATOR) {
        return <BookingManagement />;
    }
}

export default ModBookingManagement