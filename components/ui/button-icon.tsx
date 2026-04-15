import React from 'react'
import { Pressable, View, Text } from 'react-native'


export default function ButtonIcon({ icon, onPress, count }: { icon: React.ReactNode, onPress: () => void, count?: number }) {
    return (
        <Pressable onPress={onPress} className='bg-gray-800 rounded-full p-2 relative w-10 h-10 flex items-center justify-center'>
            {icon}
            {count ? <View className='absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center' >
                <Text className='text-xs text-white font-bold'>{count}</Text>
            </View> : null}
        </Pressable>
    )
}
