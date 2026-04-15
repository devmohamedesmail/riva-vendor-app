import React from 'react'
import { Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${diffInDays}d`;
};

export default function NotificationItem({ item }: any) {
  const getIconColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('order')) return '#10b981';
    if (lowerTitle.includes('system')) return '#3b82f6';
    return '#6b7280';
  };

  const getIconName = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('order')) return 'receipt';
    if (lowerTitle.includes('system')) return 'information-circle';
    return 'notifications';
  };
  return (
    <View
      className={`mb-3 p-4 rounded-xl border ${item.is_read ? 'bg-white border-gray-200' : 'bg-primary-50 border-primary-200'
        }`}
    >
      <View className="flex-row items-start">
        {/* Icon */}
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${getIconColor(item.title)}20` }}
        >
          <Ionicons
            name={getIconName(item.title) as any}
            size={20}
            color={getIconColor(item.title)}
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-base font-semibold text-gray-900">
              {item.title}
            </Text>
            {!item.is_read && (
              <View className="w-2 h-2 rounded-full bg-primary" />
            )}
          </View>

          <Text className="text-sm text-gray-600 mb-2">
            {item.message}
          </Text>

          <Text className="text-xs text-gray-400">{getTimeAgo(item.createdAt)}</Text>
        </View>
      </View>
    </View>
  )
}
