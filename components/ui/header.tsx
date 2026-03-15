import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BackButton from './back-button'
import ButtonIcon from './button-icon'
import NotificationIcon from './notification-icon'


export default function Header({ title, backButton = true }: { title?: string, backButton?: boolean }) {
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()
  const router = useRouter()


  return (
    <View
      className="bg-black px-4 shadow-sm border-b border-white/10"
      style={{ paddingTop: Math.max(insets.top, 20) + 12, paddingBottom: 16 }}
    >
      <View className="flex-row items-center justify-between relative">

        {/* Left Action */}
        <View className="z-10 items-start">
          {backButton && <BackButton />}
        </View>

        {/* Center Title */}
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
          style={{ paddingHorizontal: 100 }}
        >
          <Text
            className="text-lg font-semibold text-white tracking-wide"
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>

        {/* Right Actions */}
        <View className="z-10 flex-row items-center justify-end gap-3">
          <NotificationIcon />

          <ButtonIcon
            icon={<FontAwesome name="user-o" size={20} color="white" />}
            onPress={() => router.push('/account')}
          />
        </View>

      </View>
    </View>
  )
}
