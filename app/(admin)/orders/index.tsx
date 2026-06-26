import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, TouchableOpacity, View } from 'react-native';
import Header from '@/components/ui/header';
import Layout from '@/components/ui/layout';
import Loading from '@/components/ui/loading';
import useOrders from '@/hooks/orders/useOrders';
import NoOrders from '@/components/screens/orders/no-orders';
import OrderCard from '@/components/ui/order/order-card';
import Search from '@/components/ui/search';
import AntDesign from '@expo/vector-icons/AntDesign';


export default function Orders() {
    const { t } = useTranslation();
    // const { orders, isLoading, refetch } = useOrders();
    const {
        orders,
        isLoading,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useOrders();
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');


    const onRefresh = async () => {
        setRefreshing(true);
        await refetch?.();
        setRefreshing(false);
    };

    // const ordersList = orders?.data?.orders || [];




    const filteredOrders = useMemo(() => {
        if (!search.trim()) return orders;

        const searchText = search.toLowerCase();

        return orders.filter((item: any) => {
            return (
                item.order_group_id
                    ?.toString()
                    ?.toLowerCase()
                    ?.includes(searchText) ||

                item.customer_name
                    ?.toLowerCase()
                    ?.includes(searchText) ||

                item.phone
                    ?.toString()
                    ?.includes(search)
            );
        });
    }, [orders, search]);


    if (isLoading && !refreshing) {
        return (
            <Layout>
                <Header title={t('orders.dailyOrders')} />
                <Loading />
            </Layout>
        );
    }





    return (
        <Layout>
            <Header title={t('orders.title', 'Orders')} />

            <View className="flex-1 bg-gray-50 dark:bg-black">

                <Search
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t('orders.search_placeholder')} />

                <FlatList
                    // data={ordersList}
                    data={filteredOrders}
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







                {
                    hasNextPage && (
                        <Pressable
                            onPress={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-orange-500"
                        >
                            {isFetchingNextPage ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                // <Plus color="#fff" size={28} />
                                <AntDesign name="plus" size={24} color="black" />
                            )}
                        </Pressable>
                    )
                }
            </View>
        </Layout>
    );
}
