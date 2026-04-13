import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Text from '@/components/ui/text';

interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  type?: 'text' | 'email' | 'password' | 'phone'
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  icon?: keyof typeof Ionicons.glyphMap
  error?: string
  editable?: boolean
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  type,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon,
  error,
  editable = true
}: InputProps) {
  const { i18n } = useTranslation()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const { colorScheme } = useColorScheme()
  const isDark = colorScheme === 'dark'

  // Support old 'type' prop for backward compatibility
  const isPassword = type === 'password' || secureTextEntry

  return (
    <View className="mb-4">
      {/* Label */}
      {label && (
        <Text className={`mb-2 mx-1 text-base block font-medium text-black dark:text-white `}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        className={`flex-row items-center rounded-xl px-4 py-3 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'
          } ${isFocused
            ? 'border-2 border-primary'
            : isDark
              ? 'border border-gray-700'
              : 'border border-gray-200'
          } ${error ? 'border-red-500' : ''} ${i18n.language === "ar" ? 'flex-row-reverse' : ''}`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? '#fd4a12' : isDark ? '#9CA3AF' : '#6B7280'}
            style={{ marginRight: i18n.language === "ar" ? 0 : 8, marginLeft: i18n.language === "ar" ? 8 : 0 }}
          />
        )}
        <TextInput
          className={`flex-1 text-base ${isDark ? 'text-white' : 'text-gray-900'} ${i18n.language === "ar" ? 'text-right font-cairo' : 'text-left font-poppins'}`}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={editable}
          cursorColor={isDark ? '#fd4a12' : '#fd4a12'}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={isDark ? '#9CA3AF' : '#6B7280'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <Text className={`text-red-500 text-sm mt-1 ml-1 ${i18n.language === "ar" ? 'text-right mr-1' : 'text-left'}`}>
          {error}
        </Text>
      )}
    </View>
  )
}
