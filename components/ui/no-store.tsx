import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import Button from './button'
import { useRouter } from 'expo-router'
import { useStore } from '@/hooks/store/useStore'
import colors from '@/constants/colors'

export default function NoStore() {
    const { t } = useTranslation()
    const router = useRouter()
    const { store, getStore } = useStore();
    const [reload, setReload] = useState(false)
    const handleReload = async () => {
        setReload(true);
        await getStore();
        setReload(false);
    }
    return (
        <View className="flex-1 justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
            <Ionicons name="storefront-outline" size={64} color="#9ca3af" />
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mt-4">
                {t('store.noStoreTitle')}
            </Text>
            <Text className="text-sm mb-4 text-gray-500 dark:text-gray-400 text-center mt-2">
                {t('store.noStoreMessage')}
            </Text>

            <View className="flex-row gap-2">
                <Button
                    title={t('store.createStore')}
                    onPress={() => router.push('/(store)/create')}
                    icon={<Ionicons name="add" size={20} color={colors.light.tabIconSelected} />}
                />
                <Button

                    disabled={reload}
                    icon={<Ionicons name="refresh" size={20} color={colors.light.tabIconSelected} />}
                    variant="outline"
                    title={t('common.refresh')}
                    onPress={handleReload} />
            </View>
        </View>
    )
}
