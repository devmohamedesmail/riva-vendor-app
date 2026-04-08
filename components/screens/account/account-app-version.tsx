import React from 'react'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

export default function AccountAppVersion() {
    const { t } = useTranslation();
    return (
        <View className="items-center py-8">
            <Text
                className="text-sm dark:text-white"
            >
                {t('account.app_version')} 1.0.0
            </Text>
        </View>
    )
}
