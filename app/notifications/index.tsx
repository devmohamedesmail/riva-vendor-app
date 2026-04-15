import EmptyNotification from '@/components/screens/notifications/empty-notification';
import Header from '@/components/ui/header';
import Layout from '@/components/ui/layout';
import NotificationItem from '@/components/screens/notifications/notification-item';
import React, { useCallback, useState } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import useNotifications from '@/hooks/notifications/useNotifications';
import Loading from '@/components/ui/loading';



export default function Notifications() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, t, refetch } = useNotifications()
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);


  return (
    <Layout>
      <Header title={t('notifications.title')} />

      <View className="flex-1 px-4 py-4">
        {isLoading ? (<><Loading /></>) : (<>

          {data?.length > 0 ? (
            <FlatList
              data={data || []}
              renderItem={({ item }) => <NotificationItem item={item} />}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <EmptyNotification />
          )}

        </>)
        }
      </View>
    </Layout>
  );
}
