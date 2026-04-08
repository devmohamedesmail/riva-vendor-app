import AuthHeader from '@/components/screens/auth/auth-header'
import AuthLayout from '@/components/screens/auth/auth-layout'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import TabButton from '@/components/ui/tab-button'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
// import SocialLoginSection from '@/components/screens/auth/social-login-section'
import RoleSelection from '@/components/screens/auth/role-selection'
import useRegister from '@/hooks/auth/useRegister'
import ToggleAuthLink from '@/components/screens/auth/toggle-auth-link'
import RegisterForm from '@/components/screens/auth/register-form'





export default function Register() {
    const { t, router, formik, registerMethod, setRegisterMethod, isLoading } = useRegister()
    return (

        <AuthLayout>
            <AuthHeader
                title={t('auth.createAccount')}
            />

            <View className="flex-1 px-6 rounded-t-3xl -mt-6 bg-white dark:bg-card-dark pt-10 pb-10">

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
                <RegisterForm 
                formik={formik}
                registerMethod={registerMethod}
                isLoading={isLoading}
                t={t}
                />
               
               
                <ToggleAuthLink
                    title={t('auth.alreadyHaveAccount')}
                    linkTitle={t('auth.signIn')}
                    onPress={() => router.push('/auth/login')}
                />

                {/* <SocialLoginSection /> */}
            </View>
        </AuthLayout>
    )
}
