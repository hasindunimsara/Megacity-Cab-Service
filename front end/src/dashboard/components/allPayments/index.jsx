import React from "react";
import useAuth from './../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import AllPayment from "./components/allPayment";

function AllPayments() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.ADMIN) {
        return <AllPayment />;
    }
}

export default AllPayments