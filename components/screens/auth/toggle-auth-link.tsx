import React from 'react'
import { Text, Pressable, View } from 'react-native'
export default function ToggleAuthLink({title, linkTitle, onPress}: {title: string, linkTitle: string, onPress: () => void}) {
    return (
        <View className="flex-row justify-center items-center mt-8">
            <Text className="text-gray-600 dark:text-white">
                {title}
            </Text>
            <Pressable onPress={onPress}>
                <Text className="text-primary dark:text-white font-semibold ml-1">
                    {linkTitle}
                </Text>
            </Pressable>
        </View>
    )
}
