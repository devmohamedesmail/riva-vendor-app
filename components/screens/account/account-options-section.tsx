import React from 'react'
import { View } from 'react-native'
import OptionButton from './option-button'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
import { Linking } from 'react-native'
import { useSetting } from '@/hooks/common/useSetting'
import { useColorScheme } from 'nativewind'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { useLanguage } from '@/hooks/common/useLangauge'
export default function AccountOptionsSection() {
    const { t } = useTranslation()
    const { colorScheme, toggleColorScheme } = useColorScheme()
    const router = useRouter()
    const { settings } = useSetting();
    const { toggleLanguage } = useLanguage();


    const options = [
        {
            title: t('account.edit_profile'),
            onPress: () => router.push('/account/edit-profile'),
            icon: <Ionicons name="person" size={20} color='red' />
        },
        {
            title: t('account.theme'),
            onPress: toggleColorScheme,
            icon: <Ionicons name={colorScheme === 'dark' ? "moon" : "sunny"} size={20} color='red' />
        },
        {
            title: t('account.language'),
            onPress: toggleLanguage,
            icon: <Ionicons name="language" size={20} color='red' />
        },
        {
            title: t('account.whatsup_support'),
            onPress: () => Linking.openURL(`https://wa.me/${settings?.whatsapp}`),
            icon: <AntDesign name="whats-app" size={20} color='red' />
        },
        {
            title: t('account.phone_support'),
            onPress: () => Linking.openURL(`tel:${settings?.phone}`),
            icon: <AntDesign name="phone" size={20} color='red' />
        },
    ]


    return (
        <View>


            {options.map((option, index) => (
                <OptionButton
                    key={index}
                    title={option.title}
                    onPress={option.onPress}
                    icon={option.icon}
                />
            ))}
        </View>
    )
}
