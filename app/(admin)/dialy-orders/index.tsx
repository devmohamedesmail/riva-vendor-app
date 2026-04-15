import Header from '@/components/ui/header'
import Layout from '@/components/ui/layout'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList , RefreshControl } from 'react-native'
import NoOrders from '@/components/screens/orders/no-orders'
import OrderCard from '@/components/ui/order/order-card'
import useDialyOrder from '@/hooks/orders/useDialyOrder'
import Loading from '@/components/ui/loading'
import Text from '@/components/ui/text'

export default function DailyOrders() {
    const { t } = useTranslation();
    const {data , isLoading , error , refetch} = useDialyOrder()
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async() => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    }, []);





    return (
        <Layout>
            <Header title={t('orders.dailyOrders')} />
            {isLoading ? (
                <Loading />
            ) : (
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    data={data?.data || []}
                    keyExtractor={(item) => item.order_group_id}
                    renderItem={({ item }) => <OrderCard order={item} />} 
                    ListEmptyComponent={<NoOrders />}
                    contentContainerStyle={{ paddingVertical: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </Layout>
    )
}
