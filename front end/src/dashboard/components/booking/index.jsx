import React from "react";
import useAuth from '../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import Booking from "./components/booking";

function Bookings() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.OPERATOR) {
        return <Booking />;
    }
}

export default Bookings