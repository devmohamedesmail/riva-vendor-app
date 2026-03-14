import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function ProductsSearch({ searchText, setSearchText, t }: any) {
    return (
        <View className="flex-row items-center bg-gray-100 dark:bg-card-dark rounded-xl px-4 py-3 border border-gray-200 dark:border-gray-800">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
                className="flex-1 ml-3 text-base text-black dark:text-white"
                placeholder={t("products.search_placeholder", "Search products...")}
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
                style={{ paddingVertical: 0 }}
            />
            {searchText ? (
                <TouchableOpacity onPress={() => setSearchText("")}>
                    <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
            ) : null}
        </View>
    )
}
