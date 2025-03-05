import React from "react";
import useAuth from './../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import MyBooking from "./components/myBooking";

function MyBookings() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.USER) {
        return <MyBooking />;
    }
}

export default MyBookings