// import * as Updates from 'expo-updates';
import Header from '@/components/ui/header'
import Layout from '@/components/ui/layout'
import React from 'react'
import { View, ScrollView, Text, I18nManager } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'
import OptionButton from '@/components/screens/account/option-button'
import { useColorScheme } from 'nativewind'
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking } from 'react-native';
import AccountActionSection from '@/components/screens/account/account-action-section'
import { useSetting } from '@/hooks/useSetting'
import { useLanguage } from '@/hooks/useLangauge'

export default function Account() {
    const { t } = useTranslation()
    const { auth } = useAuth()
    const { colorScheme, toggleColorScheme } = useColorScheme()
    const router = useRouter()
    const { settings } = useSetting();
    const { toggleLanguage } = useLanguage();

    return (
        <Layout>
            <Header title={t('account.account')} />


            <ScrollView className="flex-1">
                {/* Profile Section */}
                <View className="mx-4 mt-4 rounded-xl">
                    <View className="p-6 items-center border-b">
                        <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-3">
                            <Text className="text-white text-2xl font-bold">
                                {auth?.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </Text>
                        </View>
                        <Text className="text-lg font-bold text-black dark:text-white"> {auth?.user?.name}</Text>
                        <Text className="mt-1 text-black dark:text-white"> {auth?.user?.email || auth?.user?.phone}
                        </Text>
                        <View className="mt-2 bg-primary px-3 py-1 rounded-full">
                            <Text className="text-white text-sm font-medium">
                                {auth?.user?.role?.role === "store_owner" ? t('account.store_owner') : ''}
                                {auth?.user?.role?.role === "driver" ? t('account.driver') : ''}
                            </Text>
                        </View>
                    </View>


                </View>



                <View className='px-5'>
                    <OptionButton
                        title={t('account.edit_profile')}
                        onPress={() => router.push('/account/edit-profile')}
                        icon={<Ionicons name="person" size={20} color='red' />}
                    />

                    <OptionButton
                        title={t('account.theme')}
                        onPress={toggleColorScheme}
                        icon={<Ionicons name={colorScheme === 'dark' ? "moon" : "sunny"} size={20} color='red' />}
                    />

                    <OptionButton
                        title={t('account.language')}
                        onPress={toggleLanguage}
                        icon={<Ionicons name="language" size={20} color='red' />}
                    />


                    <OptionButton
                        title={t('account.whatsup_support')}
                        onPress={() => Linking.openURL(`https://wa.me/${settings?.whatsapp}`)}
                        icon={<AntDesign name="whats-app" size={20} color='red' />}
                    />

                    <OptionButton
                        title={t('account.phone_support')}
                        onPress={() => Linking.openURL(`tel:${settings?.phone}`)}
                        icon={<AntDesign name="phone" size={20} color='red' />}
                    />


                    <AccountActionSection />



                </View>
                {/* App Version */}
                <View className="items-center py-8">
                    <Text
                        className="text-sm"
                    >
                        {t('account.app_version')} 1.0.0
                    </Text>
                </View>


            </ScrollView>
        </Layout>
    )
}
