import React from 'react'
import { View, Linking, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Text from '@/components/ui/text'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/button'

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



            <View className="flex-row items-center justify-between mt-2 gap-2">
                <Button
                    title={t('common.call')}
                    onPress={() => Linking.openURL(`tel:${order.phone}`)}
                    variant="primary"
                    size='sm'
                    className='w-1/2'
                    icon={<Ionicons name="call-outline" size={14} color="#fff" />} />

                <Button
                    title={t('common.chat')}
                    onPress={() => Linking.openURL(`https://wa.me/+2${order.phone}`)}
                    variant="success"
                    size='sm'
                    className='w-1/2'
                    icon={<Ionicons name="chatbox-outline" size={14} color="#fff" />} />
            </View>



        </View>
    )
}
