import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/useAuth';
import { config } from '@/constants/config';
import axios from 'axios';

export default function useNotifications() {
    const { t } = useTranslation();
    const { auth } = useAuth()
    const userRole = auth?.user?.role?.role
    const target_type =
        userRole === "store_owner"
            ? "store"
            : userRole === "delivery_man"
                ? "delivery_man"
                : userRole === "admin"
                    ? "admin"
                    : null

    const target_id = auth?.user?.id;


    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["notifications" , target_type , target_id],
        queryFn: () => axios.get(`${config.URL}/notifications?target_type=${target_type}&target_id=${target_id}`).then(res => res.data.data),
    })
    return {
        data,
        isLoading,
        error,
        refetch,
        t
    }
}
