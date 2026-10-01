import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/auth/AuthContext";
import type { ROLE } from "@job-platform/contracts";

interface Props {
    allowedRoles?: ROLE
}

export  function    ProtectedRoute({ allowedRoles }: Props) {
    const   {isLoading, user} = useAuth();

    // still wainting for silent refresh
    if(isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/>
            </div>
        )
    }
    // User Not logged-in
    if(!user) {
        return <Navigate to={'/login'} replace />
    }
    // User logged-in but dose not have the required Role
    if(allowedRoles && !allowedRoles.includes(user.role)) {
        <Navigate to={'/'} replace />
    }
    return <Outlet/>;
}