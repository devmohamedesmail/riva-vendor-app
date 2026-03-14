import React from 'react'
import { View } from 'react-native'
import SectionTitle from './section-title'
import { Ionicons } from '@expo/vector-icons'
import CustomImagePicker from '@/components/ui/image-picker'
export default function StoreImagesSection({ t , formik}: any) {
    return (
        <View className="mb-6">


            <SectionTitle
                title={t('store.storeImages')}
                icon={<Ionicons name="images-outline" size={24} color="#fd4a12" />}
            />

            {/* Logo Image */}
            <CustomImagePicker
                label={t('store.storeLogo') || 'Store Logo'}
                placeholder={t('store.selectLogo') || 'Tap to select logo'}
                value={formik.values.logo}
                onImageSelect={(uri) => formik.setFieldValue('logo', uri)}
                aspect={[1, 1]}
                allowsEditing={true}
            />

            {/* Banner Image */}
            <CustomImagePicker
                label={t('store.storeBanner') || 'Store Banner'}
                placeholder={t('store.selectBanner') || 'Tap to select banner'}
                value={formik.values.banner}
                onImageSelect={(uri) => formik.setFieldValue('banner', uri)}
                aspect={[16, 9]}
                allowsEditing={true}
            />
        </View>
    )
}
