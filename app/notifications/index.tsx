import EmptyNotification from '@/components/screens/notifications/empty-notification';
import Header from '@/components/ui/header';
import Layout from '@/components/ui/layout';
import NotificationItem from '@/components/screens/notifications/notification-item';
import { config } from '@/constants/config';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';



export default function Notifications() {
  const { t } = useTranslation();
  const { auth } = useAuth()

  const target_type =
    auth?.user?.role?.role === "store_owner"
      ? "store"
      : auth?.user?.role?.role === "delivery_man"
        ? "delivery_man"
        : null;

  const target_id = auth?.user?.id;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axios.get(`${config.URL}/notifications?target_type=${target_type}&target_id=${target_id}`).then(res => res.data),
  })

  const notifications = data?.data || [];

  return (
    <Layout>
      <Header title={t('notifications.title')} />

      <View className="flex-1 px-4 py-4">
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={({ item }) => <NotificationItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <EmptyNotification />
        )}
      </View>
    </Layout>
  );
}
