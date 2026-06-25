import { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { config } from '@/constants/config';
import { useAuth } from '@/hooks/auth/useAuth';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function usePushNotifications() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  const { auth } = useAuth();

  useEffect(() => {

    const registerForPushNotifications = async () => {

      try {

        if (Platform.OS === 'android') {

          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: 'default',
          });

        }

        if (!Device.isDevice) {
          Alert.alert('خطأ', 'يجب استخدام جهاز حقيقي');
          return;
        }

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {

          const { status } =
            await Notifications.requestPermissionsAsync();

          finalStatus = status;

        }

        if (finalStatus !== 'granted') {
          Alert.alert('خطأ', 'لم يتم السماح بالإشعارات');
          return;
        }

        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;

        console.log('PROJECT ID =>', projectId);

        if (!projectId) {
          Alert.alert('خطأ', 'Project ID غير موجود');
          return;
        }

        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

        console.log('EXPO PUSH TOKEN =>', token);

        setExpoPushToken(token);

        if (auth?.token) {

          const response = await fetch(
            `${config.URL}/devices/devices/register`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
              },
              body: JSON.stringify({
                pushToken: token,
                platform: Platform.OS,
              }),
            }
          );

          const data = await response.json();

          console.log('REGISTER RESPONSE =>', data);

        }

      } catch (error) {

        console.log('PUSH NOTIFICATION ERROR =>', error);

      }

    };

    registerForPushNotifications();

    const notificationListener =
      Notifications.addNotificationReceivedListener(n => {
        setNotification(n);
      });

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(r => {
        console.log(r);
      });

    return () => {

      notificationListener.remove();
      responseListener.remove();

    };

  }, [auth?.token]);

  return {
    expoPushToken,
    notification,
  };
}