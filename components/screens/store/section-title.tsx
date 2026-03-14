import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
export default function SectionTitle({ title, icon }: any) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar'
    return (
        <View>
            <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                {/* <Ionicons name="storefront-outline" size={24} color="#fd4a12" /> */}
                {icon}
                <Text className="text-lg font-semibold text-gray-800 ml-2">
                    {title}
                </Text>
            </View>
            <View className="h-1 w-20 bg-primary rounded mb-4" />
        </View>
    )
}
