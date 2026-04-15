import React, { useState, useEffect } from 'react'
import { Stack } from 'expo-router'
import AppProviders from '@/providers'
import '../i18n/i18n'
import '../global.css'
import { initI18n } from '@/i18n/i18n';
import usePushNotifications from '@/hooks/notifications/usePushNotifications';
import useLocationTracking from '@/hooks/delivery/useLocationTracking';
import { startLocationTracking } from '@/services/locationService'
import { config } from '@/constants/config'
import { useAuth } from '@/hooks/auth/useAuth'
import { Platform } from 'react-native'
import { useFonts, Cairo_400Regular, Cairo_700Bold } from "@expo-google-fonts/cairo";
import { Poppins_400Regular, Poppins_600SemiBold } from "@expo-google-fonts/poppins";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Cairo_400Regular,
        Cairo_700Bold,
        Poppins_400Regular,
        Poppins_600SemiBold
    })



    const { expoPushToken } = usePushNotifications();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        initI18n().then(() => setReady(true));
    }, []);

    if (!fontsLoaded || !ready) return null;






    return (

        <AppProviders>
            {/* <Stack screenOptions={{ headerShown: false }} /> */}
            <RootNavigation />
        </AppProviders>
    )
}


function RootNavigation() {
    const { expoPushToken } = usePushNotifications();
    const { auth } = useAuth();
    useLocationTracking();
    startLocationTracking();

    useEffect(() => {
        if (!expoPushToken) return;

        fetch(`${config.URL}/devices/devices/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth?.token}`,
            },
            body: JSON.stringify({
                pushToken: expoPushToken,
                platform: Platform.OS,
            }),

        });
        console.log(auth?.token)
    }, [expoPushToken]);
    return <Stack screenOptions={{ headerShown: false }} />;
}
