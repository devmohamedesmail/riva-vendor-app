import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Text from '@/components/ui/text'
import { useTranslation } from 'react-i18next'

export default function OrderDeliveryInfo({ order }: { order: any }) {
    const { t } = useTranslation();
    return (
        <View className="w-[48%]">
            <View className="flex-row justify-end items-center mb-1">
                <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                    {t('orders.delivery_address', 'Delivery To')}
                </Text>
                <Ionicons name="location-outline" size={14} color="#9ca3af" className="mr-1" />
            </View>
            <Text className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                {order.delivery_address}
            </Text>
            {order.area_name && (
                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                    {order.area_name}
                </Text>
            )}
        </View>
    )
}