import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '@/components/ui/text';


export default function EmptyNotification() {
    const { t } = useTranslation();
  return (
     <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name="notifications-outline" size={40} color="#9ca3af" />
      </View>
      <Text className="text-lg font-semibold text-gray-900 mb-2">
        {t('notifications.no_notifications')}
      </Text>
      <Text className="text-sm text-gray-500 text-center px-8">
        {t('notifications.no_notifications_description')}
      </Text>
    </View>
  )
}
