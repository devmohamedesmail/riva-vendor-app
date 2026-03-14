import React from 'react'
import { TouchableOpacity, View, Pressable, Text } from 'react-native'

export default function CategoryFilterBtn({ setSelectedCategory, item, isSelected }: any) {
    return (
        <Pressable
            onPress={() => setSelectedCategory(item.id)}
            className={`px-4 py-2 rounded-full border flex-row items-center gap-2 ${isSelected
                ? "bg-primary border-primary"
                : "bg-white dark:bg-card-dark border-gray-200 dark:border-gray-800"
                }`}
        >
            <Text className={`font-medium ${isSelected ? "text-white" : "text-black dark:text-white"}`}>
                {item.name}
            </Text>
            <View className={`px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"}`}>
                <Text className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-500"}`}>
                    {item.count}
                </Text>
            </View>
        </Pressable>
    )
}