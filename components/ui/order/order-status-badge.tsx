import React from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import Text from '@/components/ui/text'

export default function OrderStatusBadge({ status }: { status: string }) {

    const { t } = useTranslation();

    let bgColor = 'bg-gray-100 dark:bg-gray-800';
    let textColor = 'text-gray-600 dark:text-gray-400';
    let label = status;

    if (status === 'pending') {
        bgColor = 'bg-orange-100 dark:bg-orange-900/40';
        textColor = 'text-orange-600 dark:text-orange-400';
        label = t('orders.status_pending', 'Pending');
    } else if (status === 'delivered') {
        bgColor = 'bg-green-100 dark:bg-green-900/40';
        textColor = 'text-green-600 dark:text-green-400';
        label = t('orders.status_delivered', 'Delivered');
    } else if (status === 'cancelled') {
        bgColor = 'bg-red-100 dark:bg-red-900/40';
        textColor = 'text-red-600 dark:text-red-400';
        label = t('orders.status_cancelled', 'Cancelled');
    } else if (status === 'processing') {
        bgColor = 'bg-blue-100 dark:bg-blue-900/40';
        textColor = 'text-blue-600 dark:text-blue-400';
        label = t('orders.status_processing', 'Processing');
    }
    return (
        <View className={`px-3 py-1 rounded-full ${bgColor} border border-transparent dark:border-gray-700/50`}>
            <Text className={`text-xs font-semibold ${textColor} capitalize`}>{label}</Text>
        </View>
    )
}
