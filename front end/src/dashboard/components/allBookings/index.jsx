import React from "react";
import useAuth from './../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import AllBooking from "./components/allBooking";

function AllBookings() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.ADMIN) {
        return <AllBooking />;
    }
}

export default AllBookings