import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import Text from '@/components/ui/text'
import { config } from '@/constants/config'

export default function OrderPaymentInfo({ order }: { order: any }) {
    const { t } = useTranslation();
    return (
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
            <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <Ionicons name={(order.payment_method || 'cash') === 'cash' ? 'cash-outline' : 'card-outline'} size={14} color="#6b7280" className="mr-1.5" />
                <Text className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                    {order.payment_method} 
                </Text>
            </View>
            <View className="items-end">
                <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                    {t('orders.delivery-fee')}
                </Text>
                <Text className="text-primary font-bold text-lg leading-tight">
                    {order.delivery_fee}
                    {config.CURRENCY}
                </Text>
            </View>
            <View className="items-end">
                <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                    {t('orders.total-amount')}
                </Text>
                <Text className="text-primary font-bold text-lg leading-tight">
                    {order.total_price}
                    {config.CURRENCY}
                </Text>
            </View>
        </View>
    )
}
