import React, { useEffect } from 'react'
import ButtonIcon from '@/components/ui/button-icon'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useStore } from '@/hooks/store/useStore'
import { io } from "socket.io-client"
import * as Notifications from 'expo-notifications'
import useNotifications from '@/hooks/notifications/useNotifications'


export default function NotificationIcon() {
    const router = useRouter()
    const { store } = useStore()
    const { data, isLoading, error, refetch } = useNotifications();
  
    useEffect(() => {
        const s = io("https://tawsila-app.onrender.com");

        if (store?.id) {
            s.emit("join_store", store.id);
        }

        s.on("new_order", async (data) => {
            refetch();

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "New Order",
                    body: `Order #${data.order_id}`,
                    sound: true,
                },
                trigger: null,
            });
        });

        return () => {
            s.disconnect();
        };
    }, [store?.id]);


    return (
        <ButtonIcon
            count={data?.length}
            icon={<Ionicons name="notifications-outline" size={20} color="white" />}
            onPress={() => router.push({
                pathname: '/notifications',
                params: {
                    notifiable_id: store?.id,
                    notifiable_type: 'store'
                }
            })} />


    )
}
