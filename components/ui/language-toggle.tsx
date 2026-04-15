import { useLanguage } from '@/hooks/common/useLangauge';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Text, View } from 'react-native';

export default function LanguageToggle() {
    const { i18n } = useTranslation();
    const { toggleLanguage } = useLanguage();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const isArabic = i18n.language === 'ar';

    return (
        <View className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {/* EN pill */}
            <View className={`px-2 py-0.5 rounded-lg ${!isArabic ? 'bg-primary' : 'bg-transparent'}`}>
                <Text
                    className={`text-xs font-extrabold tracking-wider ${!isArabic ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                        }`}
                >
                    EN
                </Text>
            </View>

            <Switch
                value={isArabic}
                onValueChange={toggleLanguage}
                trackColor={{
                    false: isDark ? '#374151' : '#d1d5db',
                    true: '#fd4a12',
                }}
                thumbColor="#ffffff"
                ios_backgroundColor={isDark ? '#374151' : '#d1d5db'}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
            />

            {/* AR pill */}
            <View className={`px-2 py-0.5 rounded-lg ${isArabic ? 'bg-primary' : 'bg-transparent'}`}>
                <Text
                    className={`text-sm font-extrabold ${isArabic ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                        }`}
                >
                    ع
                </Text>
            </View>
        </View>
    );
}
