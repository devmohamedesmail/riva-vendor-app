import BottomPaper from '@/components/ui/bottom-paper';
import { useSetting } from "@/hooks/useSetting";
import BottomSheet from "@gorhom/bottom-sheet";
import Constants from "expo-constants";
import React, { useEffect, useRef } from "react";
import {  Linking, View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "./text";
import Button from './button';

export default function AppUpdateChecker() {
    const { t } = useTranslation();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { settings } = useSetting()
    const version = Constants.expoConfig?.version;



    useEffect(() => {
        checkUpdate();
    }, []);

    const checkUpdate = () => {
        if (!settings?.vendor_version || !version) return;

        // console.log("current:", version);
        // console.log("latest:", settings.vendor_version);

        if (version !== settings.vendor_version) {
            bottomSheetRef.current?.expand();
        }
    };



    return (
        <>

            <BottomPaper ref={bottomSheetRef} snapPoints={['50%']}>
                <View className="p-6 items-center w-full mt-2">
                    <View className="bg-primary/10 p-5 rounded-full mb-5">
                        <Text className="text-5xl">🚀</Text>
                    </View>

                    <Text className="text-2xl cairoBold text-black dark:text-white mb-3 text-center">
                        {t('update.title')}
                    </Text>

                    <Text className="text-base text-gray-500 dark:text-gray-400 text-center mb-8 px-2 leading-6">
                        {t('update.description')}
                    </Text>

                  
                    <Button
                
                    className='w-full'
                    title={t('update.button')}
                    onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.dev.mohamed.esmail.tawsilaagent")}
                    />
                </View>
            </BottomPaper>
        </>
    );
}