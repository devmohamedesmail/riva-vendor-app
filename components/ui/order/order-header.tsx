import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Text from '@/components/ui/text'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import OrderStatusBadge from './order-status-badge'



export default function OrderHeader({ order }: { order: any }) {
    const { t } = useTranslation();
    return (
        <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
            <View className="flex-row items-center">
                <View className="bg-primary/10 p-2 rounded-full mr-3 h-10 w-10 items-center justify-center">
                    <Ionicons name="receipt" size={20} color="#fd4a12" />
                </View>
                <View>
                    <Text className="text-gray-900 dark:text-white cairoBold text-base">
                        {t('orders.order_id')} #{order.group_code}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 font-medium">
                        {dayjs(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </Text>
                </View>
            </View>
            <OrderStatusBadge status={order.status} />
        </View>
    )
}
