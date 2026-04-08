import React from 'react'
import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import AuthLayout from '@/components/screens/auth/auth-layout'
import AuthHeader from '@/components/screens/auth/auth-header'
import TabButton from '@/components/ui/tab-button'
import useLogin from '@/hooks/auth/useLogin'
import LoginForm from '@/components/screens/auth/login-form'
import ToggleAuthLink from '@/components/screens/auth/toggle-auth-link'




export default function Login() {
  const { t,
    i18n,
    router,
    formik,
    isLoading,
    rememberMe,
    setRememberMe,
    loginMethod,
    setLoginMethod } = useLogin();
  return (
    <AuthLayout>
      <AuthHeader title={t('auth.signIn')} />
      <View className="flex-1 px-6 rounded-t-3xl -mt-6 bg-white dark:bg-card-dark pt-10">

        {/* Tabs for Email/Phone */}
        <View className="flex-row mb-6 border-b border-gray-200">

          <TabButton
            label={t('auth.email')}
            onPress={() => setLoginMethod('email')}
            active={loginMethod === 'email'}
          />


          <TabButton
            label={t('auth.phone')}
            onPress={() => setLoginMethod('phone')}
            active={loginMethod === 'phone'}
          />
        </View>

        <View className="space-y-4">
          <LoginForm
            loginMethod={loginMethod}
            formik={formik}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            t={t}
            i18n={i18n}
            isLoading={isLoading}
          />

          <ToggleAuthLink
            title={t('auth.dontHaveAccount')}
            linkTitle={t('auth.signUp')}
            onPress={() => router.push('/auth/register')}


          />


        </View>
      </View>
    </AuthLayout>
  )
}
