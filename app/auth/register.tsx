import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import AuthLayout from '@/components/screens/auth/auth-layout'
import AuthHeader from '@/components/screens/auth/auth-header'
import TabButton from '@/components/ui/tab-button'
import SocialLoginSection from '@/components/screens/auth/social-login-section'
import useRegister from '@/hooks/auth/useRegister'





export default function Register() {
    const {t,router,formik,registerMethod,setRegisterMethod,isLoading} = useRegister()
    return (

        <AuthLayout>
            <AuthHeader title={t('auth.createAccount')}  />

            <View className="flex-1 px-6 rounded-t-3xl -mt-6 bg-white dark:bg-card-dark pt-10">

                {/* Tabs for Email/Phone */}
                <View className="flex-row mb-6 ">
                   
                    <TabButton
                        label={t('auth.email')}
                        onPress={() => setRegisterMethod('email')}
                        active={registerMethod === 'email'}
                    />
                    <TabButton
                        label={t('auth.phone')}
                        onPress={() => setRegisterMethod('phone')}
                        active={registerMethod === 'phone'}
                    />
                    
                </View>

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


                <View className='mt-10'>
                    <Button
                        variant="primary"
                        size='lg'
                        title={isLoading ? t('auth.wait') : t('auth.next')}
                        onPress={() => formik.handleSubmit()}
                        disabled={isLoading || !formik.isValid || !formik.dirty}
                    />
                </View>


                {/* Terms and Sign In Link */}
                <View className="mt-4">
                    <View className="flex-row justify-center items-center">
                        <Text className="text-gray-600 ">{t('auth.alreadyHaveAccount')} </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/login')}>
                            <Text className="text-primary ">{t('auth.signIn')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <SocialLoginSection />
            </View>
        </AuthLayout>
    )
}
