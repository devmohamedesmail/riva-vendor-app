import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Select from '@/components/ui/select'
import useOrderGroupStatus from '@/hooks/orders/useOrderGroupStatus'
export default function OrderAction({ order }: any) {
    const { t } = useTranslation()
    const { updateorderGroupStatus } = useOrderGroupStatus()
    const handleOrderGroupStatus = (orderId: number, status: string) => {
        updateorderGroupStatus.mutate({
            orderId,
            status,
        });
    }
    // console.log(order?.order_group_id)
    return (

        <View className="mt-3">
            <Select
                label={t('orders.changeStatus')}
                placeholder={t('orders.selectStatus')}
                value={order.status}
                onSelect={(status: string) =>
                    handleOrderGroupStatus(order?.order_group_id, status)
                }
                disabled={updateorderGroupStatus.isPending}
                options={[
                    { label: t('orders.pending'), value: 'pending' },
                    { label: t('orders.accepted'), value: 'accepted' },
                    { label: t('orders.preparing'), value: 'preparing' },
                    { label: t('orders.onTheWay'), value: 'on_the_way' },
                    { label: t('orders.delivered'), value: 'delivered' },
                    { label: t('orders.cancelled'), value: 'cancelled' },
                ]}
            />
        </View>
    )
}
