import React from "react";
import useAuth from './../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import DriverManagement from  './components/driverManagement'

function DriverManagements() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.ADMIN) {
        return <DriverManagement />;
    }
}

export default DriverManagements