import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Text from '@/components/ui/text'
import { useTranslation } from 'react-i18next'

export default function OrderCustomerInfo({ order }: { order: any }) {
    const { t } = useTranslation();
    return (
        <View className="w-[48%] mb-3">
            <View className="flex-row justify-end items-center mb-1">

                <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                    {t('orders.customer')}
                </Text>
                <Ionicons name="person-outline" size={14} color="#9ca3af" className="mx-1" />
            </View>
            <Text className="text-gray-800 dark:text-gray-200 text-sm font-medium" numberOfLines={1}>
                {order.customer_name || t('orders.unknown')}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                {order.phone}
            </Text>
        </View>
    )
}
