import React from "react";
import useAuth from './../../../libs/hooks/UseAuth';
import User from "./components/user";
import { USER_ROLES } from "../../../libs/constants/roles";

function SeatReservation() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.USER) {
        return <User />;
    }
}

export default SeatReservation