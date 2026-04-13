import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import { useColorScheme } from 'nativewind';
import Text from '@/components/ui/text';


export default function OptionButton({ onPress, title, icon }: { title: string, onPress: () => void, icon: React.ReactNode }) {
    const { colorScheme } = useColorScheme()


    return (
        <TouchableOpacity
            activeOpacity={1}
            className='py-5 border-b border-gray-200 dark:border-gray-800 rounded-xl px-4 mb-1 flex-row justify-center items-center bg-white dark:bg-card-dark'

            onPress={onPress}>
            <View>
                <Entypo name="chevron-left" size={24} color={colorScheme === 'dark' ? '#9ca3af' : 'gray'} />
            </View>
            <View className='flex-1 flex flex-row items-center justify-end mx-3 '>
                <Text className='text-black dark:text-white'>{title}</Text>
            </View>
            <View className='bg-primary/20 rounded-full p-2 flex items-center justify-center w-10 h-10'>
                {icon}
            </View>
        </TouchableOpacity>
    )
}
