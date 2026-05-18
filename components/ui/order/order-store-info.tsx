import React from 'react'
import { View, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Text from '@/components/ui/text'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/button'

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

            <View className="flex-row items-center justify-between mt-2 gap-2">
                <Button
                    title={t('common.call')}
                    onPress={() => Linking.openURL(`tel:${order?.store?.phone}`)}
                    variant="primary"
                    size='sm'
                    className='w-1/2'
                    icon={<Ionicons name="call-outline" size={14} color="#fff" />} />

                <Button
                    title={t('common.chat')}
                    onPress={() => Linking.openURL(`https://wa.me/+2${order?.store?.phone}`)}
                    variant="success"
                    size='sm'
                    className='w-1/2 '
                    icon={<Ionicons name="chatbox-outline" size={14} color="#fff" />} />
            </View>
        </View>
    )
}
