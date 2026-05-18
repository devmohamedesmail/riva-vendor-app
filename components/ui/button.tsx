import React from 'react'
import { Pressable, View, ActivityIndicator } from 'react-native'
import clsx from 'clsx'
import Text from '@/components/ui/text';

type ButtonVariant = 'primary' | 'danger' | 'outline' | 'secondary' | 'success' | 'warning' | 'info'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  title?: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        pressed && !isDisabled && { opacity: 0.8 },
      ]}
      className={clsx(
        'flex-row items-center justify-center rounded-md ',

        // 🎨 Variants
        variant === 'primary' && 'bg-primary',
        variant === 'secondary' && 'bg-green-600',
        variant === 'success' && 'bg-green-600',
        variant === 'danger' && 'bg-red-600',
        variant === 'warning' && 'bg-yellow-500',
        variant === 'info' && 'bg-blue-500',
        variant === 'outline' &&
          'border border-primary bg-transparent',

        // 📏 Sizes
        size === 'sm' && 'px-4 py-2',
        size === 'md' && 'px-6 py-3',
        size === 'lg' && 'px-8 py-4',

        isDisabled && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#3b82f6' : '#fff'}
        />
      ) : (
        <>
          <Text
            className={clsx(
              '',
              variant === 'outline'
                ? 'text-primary'
                : 'text-white',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-base',
              size === 'lg' && 'text-lg'
            )}
          >
            {title}
          </Text>

          {icon && <View className="ml-2">{icon}</View>}
        </>
      )}
    </Pressable>
  )
}
