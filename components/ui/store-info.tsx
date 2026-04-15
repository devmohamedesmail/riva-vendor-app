import { useCallback, useState } from 'react'
import { useStore } from '@/hooks/store/useStore'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native'


export default function StoreInfo() {
  const { t } = useTranslation()
  const { store, getStore } = useStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getStore();
    setRefreshing(false);
  }, []);
  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 "
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Store Banner */}
      {store.banner && (
        <View className="relative">
          <Image
            source={{ uri: store.banner }}
            className="w-full h-48"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </View>
      )}

      <View className="px-4 pb-6 pt-20">
        {/* Store Logo & Name Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg -mt-16 mb-4 overflow-hidden">
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              {store.logo && (
                <View className="mr-4 shadow-md">
                  <Image
                    source={{ uri: store.logo }}
                    className="w-20 h-20 rounded-xl border-4 border-white dark:border-gray-700"
                    resizeMode="cover"
                  />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {store.name}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {store.rating || 0} ({store.reviews?.length || 0} {t('store.reviews')})
                  </Text>
                </View>
              </View>
            </View>

            {/* Status Badges */}
            <View className="flex-row flex-wrap gap-2">
              <View className={`flex-row items-center px-3 py-1.5 rounded-full ${store.is_active
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                <Ionicons
                  name={store.is_active ? "checkmark-circle" : "close-circle"}
                  size={14}
                  color={store.is_active ? "#10b981" : "#ef4444"}
                />
                <Text className={`text-xs font-semibold ml-1 ${store.is_active ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                  {store.is_active ? t('common.active') : t('common.inactive')}
                </Text>
              </View>

              <Pressable
                onPress={() => router.push({
                  pathname: '/(store)/update',
                  params: {
                    data: JSON.stringify(store),
                  },
                })}
                className="flex-row items-center px-4 py-2 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 active:opacity-70"
              >
                <Ionicons name="create-outline" size={16} color="#fd4a12" />
                <Text className="text-sm font-semibold text-orange-600 dark:text-orange-400 ml-1.5">
                  {t('store.edit')}
                </Text>
              </Pressable>

              {store.is_verified && (
                <View className="flex-row items-center px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <Ionicons name="shield-checkmark" size={14} color="#3b82f6" />
                  <Text className="text-xs font-semibold text-blue-700 dark:text-blue-400 ml-1">
                    Verified
                  </Text>
                </View>
              )}

              {store.is_featured && (
                <View className="flex-row items-center px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <Ionicons name="star" size={14} color="#a855f7" />
                  <Text className="text-xs font-semibold text-purple-700 dark:text-purple-400 ml-1">
                    Featured
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Contact Information Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-4 p-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('store.contactInformation')}
          </Text>

          {/* Address */}
          <View className="flex-row mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-3">
              <Ionicons name="location" size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                {t('store.storeAddress')}
              </Text>
              <Text className="text-base text-gray-900 dark:text-gray-100 leading-5">
                {store.address}
              </Text>
            </View>
          </View>

          {/* Phone */}
          <View className="flex-row">
            <View className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 items-center justify-center mr-3">
              <Ionicons name="call" size={20} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                {t('store.storePhone')}
              </Text>
              <Text className="text-base text-gray-900 dark:text-gray-100 font-medium">
                {store.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Operating Hours Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-4 p-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('store.operatingHours')}
          </Text>

          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 items-center justify-center mr-3">
              <Ionicons name="time" size={20} color="#f97316" />
            </View>
            <View className="flex-1">
              <Text className="text-base text-gray-900 dark:text-gray-100 font-semibold">
                {store.start_time} - {store.end_time}
              </Text>
            </View>
          </View>

          {store.devlivery_time && (
            <View className="flex-row items-center pt-3 border-t border-gray-100 dark:border-gray-700">
              <View className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 items-center justify-center mr-3">
                <Ionicons name="bicycle" size={20} color="#a855f7" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                  {t('store.deliveryTime')}
                </Text>
                <Text className="text-base text-gray-900 dark:text-gray-100 font-semibold">
                  {store.devlivery_time} minutes
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Store Details Card */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('store.storeDetails')}
          </Text>

          {/* Store ID */}
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
            <Text className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {t('store.storeId')}
            </Text>
            <Text className="text-sm text-gray-900 dark:text-gray-100 font-semibold">
              #{store.id}
            </Text>
          </View>

          {/* Created At */}
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
            <Text className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {t('store.createdAt')}
            </Text>
            <Text className="text-sm text-gray-900 dark:text-gray-100 font-semibold">
              {new Date(store.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {/* Last Updated */}
          <View className="flex-row justify-between items-center py-3">
            <Text className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {t('store.lastUpdated')}
            </Text>
            <Text className="text-sm text-gray-900 dark:text-gray-100 font-semibold">
              {new Date(store.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
