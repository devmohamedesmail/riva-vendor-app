import React from 'react'
import { View } from 'react-native'
import Text from '@/components/ui/text'
import { useTranslation } from 'react-i18next'
import OrderItem from '@/components/ui/order/order-item'

export default function OrderDetailsInfo({ subOrder }: { subOrder: any }) {
    const { t } = useTranslation();
    return (
        <View className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
            <Text className="text-gray-600 dark:text-gray-300 text-xs cairoBold mb-3 uppercase tracking-wider">
                {t('orders.items_ordered')} ({subOrder.orderItems?.length || 0})
            </Text>

            <View className="space-y-3">
                {subOrder.orderItems && subOrder.orderItems.length > 0 ? (
                    subOrder.orderItems.map((item: any, idx: number) => (
                        <OrderItem key={idx} item={item} />
                    ))
                ) : (
                    <Text className="text-gray-500 dark:text-gray-400 text-sm italic">
                        {t('orders.no_items_details')}
                    </Text>
                )}
            </View>
        </View>
    )
}
