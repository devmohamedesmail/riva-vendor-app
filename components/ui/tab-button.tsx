import React from 'react'
import { Pressable } from 'react-native'
import Text from '@/components/ui/text';

export default function TabButton({ label, onPress, active }: { label: string, onPress: () => void, active: boolean }) {
    return (
        <Pressable
            className={`flex-1 pb-3 ${active ? 'border-b-2 border-primary' : 'border-b-2 border-gray-200'}`}
            onPress={onPress}
        >
            <Text className={`text-center font-medium ${active ? 'text-primary' : 'text-gray-500'}`}>
                {label}
            </Text>
        </Pressable>
    )
}
