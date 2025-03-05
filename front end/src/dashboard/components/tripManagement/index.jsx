import React from "react";
import useAuth from '../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import TripManagement from "./components/tripManagement";

function TripManagements() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.OPERATOR) {
        return <TripManagement />;
    }
}

export default TripManagements