import { createContext, useContext } from "react";
import type { AuthContextValue } from "./AuthProvider";

// default is null = no auth when used outside provider
export const   AuthContext = createContext<AuthContextValue|null>(null);


export  function   useAuth() : AuthContextValue {
    const   ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(
        'useAuth() must be called inside <AuthProvider>. ' +
        'Check that AuthProvider wraps your app in main.tsx.'
        );
    }

  return ctx;
}