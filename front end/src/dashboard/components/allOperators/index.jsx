import React from "react";
import useAuth from './../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import AllOperator from "./components/allBooking";

function AllOperators() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.ADMIN) {
        return <AllOperator />;
    }
}

export default AllOperators