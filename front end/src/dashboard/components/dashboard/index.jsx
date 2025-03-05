import React from 'react'
import CommuterComponent from './components/commuterComponent'
import useAuth from '../../../libs/hooks/UseAuth'
import Admin from './components/admin';
import { USER_ROLES } from '../../../libs/constants/roles';
import Operator from './components/operator';

function Dashboard() {
    const { auth } = useAuth()
    if (auth.userRole === USER_ROLES.USER) {
        return <CommuterComponent />;
    } else if (auth.userRole === USER_ROLES.ADMIN) {
        return <Admin />;
    } else if (auth.userRole === USER_ROLES.OPERATOR) {
        return <Operator />;
    }
}

export default Dashboard