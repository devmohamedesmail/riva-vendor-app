import Header from '@/components/ui/header'
import Layout from '@/components/ui/layout'
import React from 'react'
import { RefreshControl, ScrollView, View, Pressable } from 'react-native'
import Text from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import useOrders from '@/hooks/orders/useOrders';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useDialyOrder from '@/hooks/orders/useDialyOrder';

export default function AdminIndex() {
    const { t } = useTranslation();
    const { orders, isLoading, refetch,pagination } = useOrders()
    const { data: dialyOrders, isLoading: isLoadingDialy, error, refetch: refetchDialy } = useDialyOrder()
    const [refreshing, setRefreshing] = React.useState(false);
    const router = useRouter();

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refetch();
        await refetchDialy();
        setRefreshing(false);
    }, []);

    type OptionType = {
        title: string
        icon: React.ComponentProps<typeof Ionicons>['name']
        count?: number
        color: string
        onPress: () => void
    }

    const options: OptionType[] = [
        {
            title: t('orders.all-orders'),
            icon: 'receipt',
            count: pagination?.total_orders ?? 0,
            color: 'bg-green-700',
            onPress: () => router.push('/(admin)/orders')
        },
        {
            title: t('orders.dialy-orders'),
            icon: 'receipt',
            count: dialyOrders?.pagination?.total_orders,
            color: 'bg-green-700',
            onPress: () => router.push('/(admin)/dialy-orders')
        }
    ]

    return (
        <Layout>
            <Header backButton={false} title={t('common.home')} />
            <ScrollView className='flex-1 ' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View className='flex flex-row gap-2 px-3 my-5'>


                    {
                        options.map((option, index) => (
                            <Pressable 
                            onPress={option.onPress}
                            key={index} className={`items-center justify-center ${option.color} rounded-xl py-5 w-[49%]`}>
                                <Ionicons name={option.icon} size={24} color="#fff" />
                                <Text className='text-white'>{option.title}</Text>
                                <Text className='text-white'>{option.count}</Text>
                            </Pressable>
                        ))
                    }
                </View>
            </ScrollView>

        </Layout>
    )
}
