import React from 'react'
import { View, Text } from 'react-native'
import { useAuth } from '@/hooks/auth/useAuth'
import { useTranslation } from 'react-i18next'
export default function ProfileInfoSection() {
    const { auth } = useAuth()
    const { t } = useTranslation()
    return (
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
                        {auth?.user?.role?.role === "admin" ? t('account.admin') : ''}
                    </Text>
                </View>
            </View>


        </View>
    )
}
