import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@job-platform/contracts";
import { api, setAccessToken } from "../../lib/axios";
import { AuthContext } from "./AuthContext";
import type { RegisterFormData } from "../../lib/validations/auth.schema";

export type RegisterPayload = Omit<RegisterFormData, 'confirmPassword'>

export interface AuthContextValue { // what exposed to every comp
    user:       User | null,
    isLoading:  boolean,
    login:      (email: string, password: string) => Promise<void>,
    register:   (data: RegisterPayload) => Promise<void>
    logout:     () => Promise<void>
}

export  function AuthProvider({ children } : { children: React.ReactNode }) {
    const   [user, setUser] = useState<User|null>(null);
    const   [isLoading, setIsLoading] = useState<boolean>(true);

    // runs once when the app loads
    useEffect(() => {
        const   restorSession = async () => {
            try {
                const   {data} = await api
                    .get<{data: {accessToken: string, user: User}}>
                    ('/auth/refresh', { withCredentials: true });
                
                setAccessToken(data.data.accessToken);
                setUser(data.data.user);
            } catch {
                setAccessToken(null);
                setUser(null);
                console.log("Catch in restore session")
            } finally{
                setIsLoading(false);
            }
        }
        restorSession();
    }, [])

    // Login
    // const   navigate = useNavigate();
    const   login = useCallback(async (email: string, password: string) => {
        const   { data } = await api
            .post<{data: { accessToken: string, user: User }}>
            ('/auth/login', {email, password}, { withCredentials: true });
        setAccessToken(data.data.accessToken);
        console.log("access Token In Login: ", data.data.accessToken);

        console.log("User In Login: ", data.data.user);
        setUser(data.data.user);
    }, []);
    // Register
    const   register = useCallback(async (payload: RegisterPayload) => {
        const {data} = await api
            .post<{data: {accessToken: string, user: User}}>
            ('/auth/signup', payload);
        setAccessToken(data.data.accessToken);
        setUser(data.data.user);
        // navigate('/', { replace: true });
    }, []);
    // logout
    const   logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setUser(null);
            setAccessToken(null);
        }
        await api.post('/auth/logout');
    }, [])

    // Context value
    // useMemo prevents new object reference on every render
    const   value = useMemo<AuthContextValue>(
        () => ({ user, isLoading, login, register, logout }),
        [user, isLoading, login, register, logout]
    );
    return (
        <AuthContext.Provider value={value}>
            <h1>Auth Provider</h1>
            {children}
            <h1>Auth Provider</h1>
        </AuthContext.Provider>
    );
}
