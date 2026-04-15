import colors from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { useColorScheme } from 'nativewind'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import Text from '@/components/ui/text'

interface DropdownOption {
  label: string
  value: string
}

interface CustomDropdownProps {
  label?: string
  placeholder?: string
  value?: string
  onSelect?: (value: string) => void
  options: DropdownOption[]
  error?: string
  disabled?: boolean
}

export default function Select({
  label,
  placeholder = "Select an option",
  value,
  onSelect,
  options,
  error,
  disabled = false
}: CustomDropdownProps) {
  const { i18n } = useTranslation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { t } = useTranslation()
  const { colorScheme } = useColorScheme()
  const selectedOption = options.find(option => option.value === value)
  const isRTL = i18n.language === 'ar'

  const handleSelect = (selectedValue: string) => {
    onSelect?.(selectedValue)
    setIsModalVisible(false)
  }

  return (
    <View className='mb-5'>
      {label && (
        <Text
          className={`mb-3 text-sm font-medium text-black dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
        className={`
          border-2 rounded-xl px-4 py-4 w-full
          ${error
            ? 'border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-950/30'
            : 'border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800'
          }
          ${disabled ? 'opacity-50 bg-gray-100 dark:bg-gray-700' : ''}
          shadow-sm flex-row justify-between items-center
        `}
      >
        <Text
          style={{
            fontFamily: 'Cairo_400Regular',
            textAlign: isRTL ? 'right' : 'left'
          }}
          className={`text-base flex-1 ${selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
            }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>

        <Ionicons
          name={isModalVisible ? "chevron-up" : "chevron-down"}
          size={20}
          color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
        />
      </Pressable>

      {error && (
        <View className='flex-row items-center mt-2 px-1'>
          <Ionicons name="alert-circle" size={12} color="#EF4444" />
          <Text
            className='text-red-500 text-xs ml-2 flex-1'
            style={{ fontFamily: 'Cairo_400Regular' }}
          >
            {error}
          </Text>
        </View>
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        onBackButtonPress={() => setIsModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={300}
        backdropTransitionInTiming={300}
        backdropTransitionOutTiming={300}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        className="justify-center items-center"
      >
        <View className="bg-white dark:bg-gray-800 rounded-xl mx-6 max-h-96 w-80">
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Text
              className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100"
            >
              {label || t('common.selectOption')}
            </Text>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item.value)}
                className={`
                  px-4 py-4 
                  ${index !== options.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}
                  ${item.value === value ? 'bg-orange-50 dark:bg-orange-900/20' : ''}
                `}
              >
                <View className="flex-row justify-between items-center">
                  <Text
                    style={{
                      fontFamily: 'Cairo_400Regular',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    className={`text-base flex-1 ${item.value === value ? 'font-medium text-[#fd4a12]' : 'text-gray-800 dark:text-gray-200'
                      }`}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colorScheme === 'dark' ? colors.dark.tint : colors.light.tint}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />

          <Pressable
            onPress={() => setIsModalVisible(false)}
            className="p-4 border-t border-gray-200 dark:border-gray-700"
          >
            <Text
              className="text-center text-gray-600 dark:text-gray-400"
            >
              {t("common.close")}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  )
}