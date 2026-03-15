import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, RefreshControl, Text, View } from 'react-native';

import Header from '@/components/ui/header';
import Layout from '@/components/ui/layout';
import Loading from '@/components/ui/loading';
import useOrders from '@/hooks/orders/useOrders';

const StatusBadge = ({ status }: { status: string }) => {
    const { t } = useTranslation();

    let bgColor = 'bg-gray-100 dark:bg-gray-800';
    let textColor = 'text-gray-600 dark:text-gray-400';
    let label = status;

    if (status === 'pending') {
        bgColor = 'bg-orange-100 dark:bg-orange-900/40';
        textColor = 'text-orange-600 dark:text-orange-400';
        label = t('orders.status_pending', 'Pending');
    } else if (status === 'delivered') {
        bgColor = 'bg-green-100 dark:bg-green-900/40';
        textColor = 'text-green-600 dark:text-green-400';
        label = t('orders.status_delivered', 'Delivered');
    } else if (status === 'cancelled') {
        bgColor = 'bg-red-100 dark:bg-red-900/40';
        textColor = 'text-red-600 dark:text-red-400';
        label = t('orders.status_cancelled', 'Cancelled');
    } else if (status === 'processing') {
        bgColor = 'bg-blue-100 dark:bg-blue-900/40';
        textColor = 'text-blue-600 dark:text-blue-400';
        label = t('orders.status_processing', 'Processing');
    }

    return (
        <View className={`px-3 py-1 rounded-full ${bgColor} border border-transparent dark:border-gray-700/50`}>
            <Text className={`text-xs font-semibold ${textColor} capitalize`}>{label}</Text>
        </View>
    );
};

const OrderCard = ({ order }: { order: any }) => {
    const { t } = useTranslation();

    return (
        <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-800">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                <View className="flex-row items-center">
                    <View className="bg-primary/10 p-2 rounded-full mr-3 h-10 w-10 items-center justify-center">
                        <Ionicons name="receipt" size={20} color="#fd4a12" />
                    </View>
                    <View>
                        <Text className="text-gray-900 dark:text-white font-bold text-base">
                            {t('orders.order_id', 'Order')} #{order.id}
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 font-medium">
                            {dayjs(order.createdAt).format('DD MMM YYYY, hh:mm A')}
                        </Text>
                    </View>
                </View>
                <StatusBadge status={order.status} />
            </View>

            {/* Details Grid */}
            <View className="flex-row flex-wrap mb-4">
                <View className="w-1/2 mb-3 pr-2">
                    <View className="flex-row items-center mb-1">
                        <Ionicons name="person-outline" size={14} color="#9ca3af" className="mr-1" />
                        <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                            {t('orders.customer', 'Customer')}
                        </Text>
                    </View>
                    <Text className="text-gray-800 dark:text-gray-200 text-sm font-medium" numberOfLines={1}>
                        {order.customer_name || t('orders.unknown', 'Guest')}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                        {order.phone}
                    </Text>
                </View>

                <View className="w-1/2 mb-3 pl-2 border-l border-gray-100 dark:border-gray-800">
                    <View className="flex-row items-center mb-1">
                        <Ionicons name="storefront-outline" size={14} color="#9ca3af" className="mr-1" />
                        <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                            {t('orders.store', 'Store')}
                        </Text>
                    </View>
                    <Text className="text-gray-800 dark:text-gray-200 text-sm font-medium" numberOfLines={1}>
                        {order?.store?.name || t('orders.unknown_store', 'Unknown')}
                    </Text>
                </View>

                <View className="w-full">
                    <View className="flex-row items-center mb-1">
                        <Ionicons name="location-outline" size={14} color="#9ca3af" className="mr-1" />
                        <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
                            {t('orders.delivery_address', 'Delivery To')}
                        </Text>
                    </View>
                    <Text className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                        {order.delivery_address}
                    </Text>
                    {order.area_name && (
                        <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                            {order.area_name}
                        </Text>
                    )}
                </View>
            </View>

            {/* Items List */}
            <View className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 mb-4 border border-gray-100 dark:border-gray-800">
                <Text className="text-gray-600 dark:text-gray-300 text-xs font-bold mb-3 uppercase tracking-wider">
                    {t('orders.items_ordered', 'Items')} ({order.order?.length || 0})
                </Text>

                <View className="space-y-3">
                    {order.order && order.order.length > 0 ? (
                        order.order.map((item: any, index: number) => (
                            <View key={index} className="flex-row items-center">
                                <View className="bg-white dark:bg-gray-700 rounded-lg p-0.5 mr-3 border border-gray-200 dark:border-gray-600 shadow-sm relative">
                                    <Image
                                        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                                        className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800"
                                        resizeMode="cover"
                                    />
                                    <View className="absolute -top-2 -right-2 bg-primary rounded-full w-5 h-5 items-center justify-center border-2 border-white dark:border-gray-800">
                                        <Text className="text-white text-[10px] font-bold">{item.quantity}</Text>
                                    </View>
                                </View>

                                <View className="flex-1">
                                    <Text className="text-gray-800 dark:text-white text-sm font-semibold" numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    {item.selectedAttribute && (
                                        <Text className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                                            {item.selectedAttribute.name}: {item.selectedAttribute.value}
                                        </Text>
                                    )}
                                </View>

                                <View className="items-end ml-2">
                                    <Text className="text-gray-900 dark:text-white text-sm font-bold">
                                        {item.price * item.quantity} {t('common.currency', 'EGP')}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text className="text-gray-500 dark:text-gray-400 text-sm italic">
                            {t('orders.no_items_details', 'Order details not available')}
                        </Text>
                    )}
                </View>
            </View>

            {/* Footer / Total */}
            <View className="flex-row justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800">
                <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Ionicons name={order.payment_method === 'cash' ? 'cash-outline' : 'card-outline'} size={14} color="#6b7280" className="mr-1.5" />
                    <Text className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        {order.payment_method}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-0.5">
                        {t('orders.total', 'Total Amount')}
                    </Text>
                    <Text className="text-primary font-bold text-lg leading-tight">
                        {order.total_price} {t('common.currency', 'EGP')}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default function Orders() {
    const { t } = useTranslation();
    const { orders, isLoading, refetch } = useOrders();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch?.();
        setRefreshing(false);
    };

    const ordersList = orders?.data?.orders || [];

    return (
        <Layout>
            <Header title={t('orders.title', 'Orders')} />

            <View className="flex-1 bg-gray-50 dark:bg-black">
                {isLoading && !refreshing ? (
                    <View className="flex-1 justify-center items-center">
                        <Loading showText={false} />
                    </View>
                ) : (
                    <FlatList
                        data={ordersList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <OrderCard order={item} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#fd4a12']} // Primary color for Android
                                tintColor="#fd4a12" // Primary color for iOS
                            />
                        }
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center py-10 mt-20">
                                <View className="bg-white dark:bg-gray-900 p-8 rounded-full mb-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <Ionicons name="receipt-outline" size={56} color="#d1d5db" />
                                </View>
                                <Text className="text-gray-900 dark:text-white text-xl font-bold mb-2">
                                    {t('orders.empty_title', 'No Orders Yet')}
                                </Text>
                                <Text className="text-gray-500 dark:text-gray-400 text-center px-8 text-sm leading-relaxed">
                                    {t('orders.empty_desc', "You don't have any orders at the moment. New orders will appear here once they are placed.")}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </Layout>
    );
}
