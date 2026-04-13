import React from 'react'
import { Pressable, View } from 'react-native'
import Text from '@/components/ui/text';
interface Props {
    onPress?: () => void
    title?: string
    icon?: React.ReactNode
}
export default function AccountActionButton({ onPress, title, icon }: Props) {

    return (
        <Pressable
            onPress={onPress}
            className='flex flex-row items-center justify-center w-full bg-red-600 dark:bg-red-500 py-4 rounded-xl mb-3'>
            <View className='flex flex-row items-center space-x-2 justify-center' >
                <Text className='text-lg mx-2 text-white'>{title}</Text>
                {icon}
            </View>
        </Pressable>
    )
}
