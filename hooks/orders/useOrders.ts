import { config } from '@/constants/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../useAuth';

export default function useOrders() {
    const { auth } = useAuth();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: () => axios.get(`${config.URL}/orders`, {
            headers: {
                Authorization: `Bearer ${auth?.token}`,
            },
        }).then(res => res.data),
    })
    return {
        orders: data,
        isLoading,
        error,
        refetch,
    }
}
