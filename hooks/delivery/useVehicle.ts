import { config } from '@/constants/config'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/auth/useAuth'


export default function useVehicle() {
    const { auth } = useAuth()
    const [vehicle, setVehicle] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    const getVehicle = async () => {
        if (!auth?.token) {
            return;
        }
        try {
            const response = await axios.get(`${config.URL}/auth/get-profile`, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
            });
            setVehicle(response.data?.data?.vehicle);
            setIsLoading(false);
        } catch (error: any) {
            setVehicle(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!auth) return;
        setIsLoading(true);
        getVehicle();
    }, [auth]);



    return {
        vehicle,
        isLoading,
        getVehicle
    }
}
