import { config } from '@/constants/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useOrderStatusUpdate() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {

            const token = await AsyncStorage.getItem('token');
            console.log(token)
            console.log(orderId)
            console.log(status)
            const response = await axios.patch(
                `${config.URL}/orders/${orderId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daily-orders'] });
            queryClient.invalidateQueries({ queryKey: ['order-details'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            Toast.show({
                type: 'success',
                text1: t('orders.statusUpdatedSuccessfully'),
            });
        },
        onError: (error) => {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: t('orders.statusUpdateFailed'),
            });
        },
    });

    return { updateStatusMutation };
}
