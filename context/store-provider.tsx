import React, { createContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import axios from "axios";
import { config } from "@/constants/config";


interface StoreContextType {
    store: any;
    isLoading: boolean;
    getStore: () => Promise<void>;
}
export const StoreContext = createContext<StoreContextType | null>(null);



export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const [store, setStore] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useAuth();


    const getStore = async () => {
        if (!auth?.token) {
            return;
        }
        try {
            const response = await axios.get(`${config.URL}/auth/get-profile`, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
            });
            setStore(response.data?.data?.store);
            setIsLoading(false);
        } catch (error: any) {
            setStore(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!auth) return;
        setIsLoading(true);
        getStore();
    }, [auth]);

    return (
        <StoreContext.Provider value={{ store, isLoading, getStore }}>
            {children}
        </StoreContext.Provider>
    );
}
