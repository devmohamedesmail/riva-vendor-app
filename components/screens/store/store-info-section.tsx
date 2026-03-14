import React from 'react'
import { View, Text } from 'react-native'
import Input from '@/components/ui/input'
import SectionTitle from './section-title'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'



export default function StoreInfoSection({ formik }: any) {
    const { t } = useTranslation();
    return (
        <View className="mb-6">

            <SectionTitle
                title={t('store.storeInformation')}
                icon={<Ionicons name="storefront-outline" size={24} color="#fd4a12" />}
            />

            {/* Store Name */}
            <Input
                label={t('store.storeName') || 'Store Name *'}
                placeholder={t('store.enterStoreName') || 'Enter store name'}
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
                keyboardType="default"
                error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
            />

            {/* Address */}
            <Input
                label={t('store.storeAddress') || 'Address *'}
                placeholder={t('store.enterAddress') || 'Enter address'}
                value={formik.values.address}
                onChangeText={formik.handleChange('address')}
                keyboardType="default"
                error={formik.touched.address && formik.errors.address ? formik.errors.address : undefined}
            />

            {/* Phone */}
            <Input
                label={t('store.storePhone') || 'Phone *'}
                placeholder={t('store.enterPhone') || 'Enter phone number'}
                value={formik.values.phone}
                onChangeText={formik.handleChange('phone')}
                keyboardType="phone-pad"
                error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
            />
        </View>
    )
}
