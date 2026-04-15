import React from 'react'
import { View, Image } from 'react-native'
import Text from '@/components/ui/text'
import { useTranslation } from 'react-i18next'

export default function OrderItem({ item }: { item: any }) {
    const { t } = useTranslation();
    return (
        <View className="flex-row items-center">
            <View className="bg-white dark:bg-gray-700 rounded-lg p-0.5 mr-3 border border-gray-200 dark:border-gray-600 shadow-sm relative">
                <Image
                    source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                    className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800"
                    resizeMode="cover"
                />
                <View className="absolute -top-2 -right-2 bg-primary rounded-full w-5 h-5 items-center justify-center border-2 border-white dark:border-gray-800">
                    <Text className="text-white text-[10px] font-bold">{item.quantity}</Text>
                </View>
            </View>

            <View className="flex-1">
                <Text className="text-gray-800 dark:text-white text-sm font-semibold" numberOfLines={1}>
                    {item.name}
                </Text>

                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                    {item?.attribute_name}: {item?.attribute_value}
                </Text>

                {/* {item.selectedAttribute && (
                    <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                        {item.selectedAttribute.name}: {item.selectedAttribute.value}
                    </Text>
                )} */}
            </View>

            <View className="items-end ml-2">
                <Text className="text-gray-900 dark:text-white text-sm font-bold">
                    {item.price * item.quantity} {t('common.currency', 'EGP')}
                </Text>
            </View>
        </View>
    )
}
