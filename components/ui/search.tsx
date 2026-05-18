import React, { useState } from 'react'
import { View, TextInput } from 'react-native'
import { useTranslation } from 'react-i18next'
import colors from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'

type Props = {
    value: string
    onChangeText: (search: string) => void
    placeholder?: string
}

export default function Search({
    value,
    onChangeText,
    placeholder
}: Props) {
    const { t, i18n } = useTranslation()
    const [focus, setFocus] = useState(false)

    const isArabic = i18n.language === 'ar'

    return (
        <View className="px-4 pt-3">
            <View
                className={`
                    flex-row items-center
                    h-14 px-4 rounded-2xl bg-white
                    border
                    ${focus ? 'border-primary' : 'border-gray-200'}
                    shadow-sm
                `}
                style={{
                    elevation: 3,
                    shadowOpacity: 0.08,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 2 }
                }}
            >
                <Ionicons
                    name="search"
                    size={20}
                    color={focus ? colors.light.tabIconSelected : '#9CA3AF'}
                    style={{
                        marginRight: isArabic ? 0 : 10,
                        marginLeft: isArabic ? 10 : 0
                    }}
                />

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={
                        placeholder || t('common.search')
                    }
                    placeholderTextColor="#9CA3AF"
                    cursorColor={colors.light.tabIconSelected}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    className={`
                        flex-1 text-base
                        ${isArabic
                            ? 'text-right font-cairo'
                            : 'text-left font-poppins'}
                    `}
                />
            </View>
        </View>
    )
}