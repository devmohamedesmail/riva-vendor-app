import React from 'react'
import { View } from 'react-native'
import OrderHeader from '@/components/ui/order/order-header'
import OrderCustomerInfo from '@/components/ui/order/order-customer-info'
import OrderStoreInfo from '@/components/ui/order/order-store-info'
import OrderDeliveryInfo from '@/components/ui/order/order-delivery-info'
import OrderPaymentInfo from '@/components/ui/order/order-payment-info'
import useOrderStatusUpdate from '@/hooks/orders/useOrderStatusUpdate'
import OrderAction from '@/components/ui/order/order-action'
import OrderDetailsInfo from '@/components/ui/order/order-details-info'



export default function OrderCard({ order }: { order: any }) {
    const { updateStatusMutation } = useOrderStatusUpdate();

    const handleStatusChange = (orderId: number, status: string) => {
        updateStatusMutation.mutate({
            orderId,
            status,
        });
    };



    return (
        <View className="bg-white dark:bg-gray-900 rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-800 border-b-2 border-b-primary">
            <OrderHeader order={order} />
            <View className="flex-row justify-between flex-wrap mb-4">
                <OrderCustomerInfo order={order} />
                <OrderDeliveryInfo order={order} />
            </View>

            {/* Stores & Items List */}
            {order.orders?.map((subOrder: any, index: number) => (
                <View key={subOrder.id || index} className="mb-4">
                    <OrderStoreInfo order={subOrder} />
                    <OrderDetailsInfo  subOrder={subOrder} />
                </View>
            ))}
            <OrderPaymentInfo order={order} />
            <OrderAction order={order} />
        </View>
    )
}
