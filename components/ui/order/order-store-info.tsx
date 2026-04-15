import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Text from '@/components/ui/text'
import { useTranslation } from 'react-i18next'

export default function OrderStoreInfo({ order }: { order: any }) {
    const { t } = useTranslation();
    return (
        <View className="w-full mb-3 pl-2 border-l border-gray-100 dark:border-gray-800">
            <View className="flex-row justify-end items-center mb-1">
                <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                    {t('orders.store', 'Store')}
                </Text>
                <Ionicons name="storefront-outline" size={14} color="#9ca3af" className="mx-1" />
            </View>
            <Text className="text-gray-800 dark:text-gray-200 text-sm font-medium" numberOfLines={1}>
                {order?.store?.name}
            </Text>
            <Text className="text-gray-800 dark:text-gray-200 text-sm font-medium" numberOfLines={1}>
                {order?.store?.phone}
            </Text>
        </View>
    )
}
