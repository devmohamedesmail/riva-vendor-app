import React from 'react'
import { View } from 'react-native'
import Input from '@/components/ui/input'
import RoleSelection from '@/components/screens/auth/role-selection'
import Button from '@/components/ui/button'

export default function RegisterForm({ formik, registerMethod, isLoading, t }: { formik: any, registerMethod: string, isLoading: boolean, t: any }) {
    return (
        <View className='space-y-4'>
            {/* Name Input */}
            <Input
                label={t('auth.name')}
                placeholder={t('auth.enterName')}
                type="text"
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
                error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
            />

            {/* Conditional Input based on Tab */}
            {registerMethod === 'email' ? (
                <Input
                    label={t('auth.email')}
                    placeholder={t('auth.enterEmail')}
                    type="email"
                    keyboardType="email-address"
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                    error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                />
            ) : (
                <Input
                    label={t('auth.phone')}
                    placeholder={t('auth.enterPhone')}
                    type="phone"
                    keyboardType="phone-pad"
                    value={formik.values.phone}
                    onChangeText={formik.handleChange('phone')}
                    error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
                />
            )}

            {/* Password Input */}
            <Input
                label={t('auth.password')}
                placeholder={t('auth.enterPassword')}
                type="password"
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
            />

            {/* Role Selection */}
            {/* <RoleOptions formik={formik} /> */}
            <RoleSelection
                formik={formik}
            // value={formik.values.role_id}
            // onChange={(val) => formik.setFieldValue('role_id', val)}
            // error={formik.touched.role_id && formik.errors.role_id ? String(formik.errors.role_id) : undefined}
            />


            <View className='mt-10'>
                <Button
                    variant="primary"
                    size='lg'
                    title={isLoading ? t('auth.wait') : t('auth.next')}
                    onPress={() => formik.handleSubmit()}
                    disabled={isLoading || !formik.isValid || !formik.dirty}
                />
            </View>

        </View>
    )
}
