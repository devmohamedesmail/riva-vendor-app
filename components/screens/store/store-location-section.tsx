import React from 'react'
import {View} from "react-native"
import SectionTitle from './section-title'

import Input from '@/components/ui/input'
export default function StoreLocationSection({t,formik}:any) {
  return (
    <View className="mb-6">
              <SectionTitle 
              title="Store Location" />
              <Input
                label={t('store.latitude')}
                placeholder={t('store.latitude')}
                value={formik.values.latitude}
                onChangeText={formik.handleChange('latitude')}
                keyboardType="default"
                error={formik.touched.latitude && formik.errors.latitude ? formik.errors.latitude : undefined}
              />

              {/* Address */}
              <Input
                label={t('store.longitude')}
                placeholder={t('store.longitude')}
                value={formik.values.address}
                onChangeText={formik.handleChange('longitude')}
                keyboardType="default"
                error={formik.touched.longitude && formik.errors.longitude ? formik.errors.longitude : undefined}
              />
            </View>
  )
}
