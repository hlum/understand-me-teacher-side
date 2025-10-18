import { Navigate } from "react-router-dom";
import type { User } from "firebase/auth";
import type { JSX } from "react";

interface ProtectedRouteProps {
    user: User | null;
    children: JSX.Element;
}

export const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
