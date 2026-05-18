import Header from '@/components/ui/header'
import Layout from '@/components/ui/layout'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, RefreshControl, TextInput, View } from 'react-native'
import NoOrders from '@/components/screens/orders/no-orders'
import OrderCard from '@/components/ui/order/order-card'
import useDialyOrder from '@/hooks/orders/useDialyOrder'
import Loading from '@/components/ui/loading'
import Search from '@/components/ui/search'


export default function DailyOrders() {
    const { t } = useTranslation();
    const { data, isLoading, error, refetch } = useDialyOrder()
    const [refreshing, setRefreshing] = React.useState(false);
    const [search, setSearch] = useState('');
    const orders = data?.data || [];

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, [refetch]);

    const filteredOrders = useMemo(() => {
        const orders = data?.data || [];

        if (!search.trim()) return orders;

        return orders.filter((item: any) => {
            const searchText = search.toLowerCase();

            return (
                item.order_group_id?.toLowerCase()?.includes(searchText) ||
                item.customer_name?.toLowerCase()?.includes(searchText) ||
                item.phone?.includes(search)
            );
        });
    }, [data, search]);


    if (isLoading) {
        return (
            <Layout>
                <Header title={t('orders.dailyOrders')} />
                <Loading />
            </Layout>
        );
    }


    return (
        <Layout>
            <Header title={t('orders.dailyOrders')} />

             {orders.length > 0 && (
            <Search
                value={search}
                onChangeText={setSearch}
                placeholder={t('orders.search_placeholder')}
            />
        )}

            <FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                // data={data?.data || []}
                data={filteredOrders}
                keyExtractor={(item) => item.order_group_id}
                renderItem={({ item }) => <OrderCard order={item} />}
                ListEmptyComponent={<NoOrders />}
                contentContainerStyle={{ paddingVertical: 16 }}
                showsVerticalScrollIndicator={false}
            />
        </Layout>
    )
}
