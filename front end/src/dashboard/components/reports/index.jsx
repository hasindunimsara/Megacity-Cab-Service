import React from "react";
import useAuth from '../../../libs/hooks/UseAuth';
import { USER_ROLES } from "../../../libs/constants/roles";
import Reports from "./components/reports";

function AdminReports() {
    const { auth } = useAuth()

    if (auth.userRole === USER_ROLES.ADMIN) {
        return <Reports />;
    }
}

export default AdminReports