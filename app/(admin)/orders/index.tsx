import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, View } from 'react-native';
import Header from '@/components/ui/header';
import Layout from '@/components/ui/layout';
import Loading from '@/components/ui/loading';
import useOrders from '@/hooks/orders/useOrders';
import NoOrders from '@/components/screens/orders/no-orders';
import OrderCard from '@/components/ui/order/order-card';


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
                    <Loading />
                ) : (
                    <FlatList
                        data={ordersList}
                        keyExtractor={(item) => item.order_group_id}
                        renderItem={({ item }) => <OrderCard order={item} />} 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#fd4a12']}
                                tintColor="#fd4a12"
                            />
                        }
                        ListEmptyComponent={

                            <NoOrders />
                        }
                    />
                )}
            </View>
        </Layout>
    );
}
