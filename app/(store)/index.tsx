import Header from '@/components/ui/header'
import Layout from '@/components/ui/layout'
import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/hooks/useStore'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Loading from '@/components/ui/loading'
import NoStore from '@/components/ui/no-store'
import StoreInfo from '@/components/ui/store-info'
import usePushNotifications from '@/hooks/usePushNotifications'
import { Button, Text, View } from 'react-native'
import { router } from 'expo-router'

export default function Home() {
  const { t } = useTranslation();
  const { store, isLoading } = useStore();
  const { auth, isLoading: authLoading } = useAuth();


  // const { expoPushToken, notification } = usePushNotifications();

  // const sendPushNotification = async () => {
  //   if (!expoPushToken) return;

  //   const message = {
  //     to: expoPushToken,
  //     sound: 'default',
  //     title: 'عنوان الإشعار',
  //     body: 'هنا محتوى الإشعار!',
  //     data: { info: 'بيانات إضافية' },
  //   };

  //   await fetch('https://exp.host/--/api/v2/push/send', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Accept-encoding': 'gzip, deflate',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(message),
  //   });
  // };


  return (
    <Layout>
      <Header backButton={false} title={t('common.home')} />


      {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
        <Text>Token: {expoPushToken}</Text>
        {notification && (
          <View>
            <Text>Title: {notification.request.content.title}</Text>
            <Text>Body: {notification.request.content.body}</Text>
            <Text>Data: {JSON.stringify(notification.request.content.data)}</Text>
          </View>
        )}
        <Button title="إرسال إشعار" onPress={sendPushNotification} />
      </View> */}



<Button onPress={() => router.push("/(admin)/orders")} title="admin" />

      {isLoading ? (
        <Loading />
      ) : store ? (
        <StoreInfo />
      ) : (
        <NoStore />
      )}
    </Layout>
  )
}
