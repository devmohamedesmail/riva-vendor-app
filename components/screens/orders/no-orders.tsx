import React from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '@/components/ui/text';

export default function NoOrders() {
    const { t } = useTranslation();
    return (
        <View className="flex-1 justify-center items-center px-4">
            <Ionicons name="receipt-outline" size={80} color="#d1d5db" />
            <Text className="text-gray-900 text-xl mt-4">{t('orders.noOrders')}</Text>
            <Text className="text-gray-500 text-center mt-2">{t('orders.noOrdersDescription')}</Text>
            
        </View>
    )
}
