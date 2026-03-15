import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TouchableOpacity,ScrollView, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import { AuthContext } from '@/context/auth-provider'
import AuthLayout from '@/components/screens/auth/auth-layout'
import AuthHeader from '@/components/screens/auth/auth-header'
import Toast from 'react-native-toast-message'
import TabButton from '@/components/ui/tab-button'
import SocialLoginSection from '@/components/screens/auth/social-login-section'
import useLogin from '@/hooks/auth/useLogin'




export default function Login() {
  // const { t, i18n } = useTranslation()
  // const router = useRouter()
  // const [isLoading, setIsLoading] = useState(false)
  // const [rememberMe, setRememberMe] = useState(false)
  // const { login } = useContext(AuthContext)
  // const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')


  // const validationSchema = Yup.object({
  //   email: Yup.string().when('loginMethod', {
  //     is: 'email',
  //     then: (schema) =>
  //       schema
  //         .email(t('auth.email_invalid'))
  //         .required(t('auth.email_required')),
  //         otherwise: (schema) => schema.notRequired().nullable(),
  //   }),

  //   phone: Yup.string().when('loginMethod', {
  //     is: 'phone',
  //     then: (schema) =>
  //       schema
  //         .matches(/^[0-9]{10,15}$/, t('auth.phone_invalid'))
  //         .required(t('auth.phone_required')),
  //     otherwise: (schema) => schema.notRequired().nullable(),
  //   }),
  //   password: Yup.string()
  //     .required(t('auth.password_required'))
  //     .min(6, t('auth.password_min')),
  // })


  // const formik = useFormik({
  //   initialValues: {
  //     email: '',
  //     phone: '',
  //     password: '',
  //   },
  //   validationSchema,

  //   onSubmit: async (values) => {
  //     setIsLoading(true)
  //     try {
  //       const identifier = loginMethod === 'email' ? values.email : values.phone;
  //       const result = await login(identifier, values.password, loginMethod)
  //       Toast.show({
  //         text1: t('auth.login_success'),
  //         text2: t('auth.welcomeBack'),
  //         type: 'success',
  //       })


  //       const role = result.data.user.role.role;
  //       if (role === 'store_owner') {
  //         router.replace('/(store)')
  //       } else if (role === 'driver') {
  //         //   router.replace('/driver/dashboard')
  //       } else {
  //         router.replace('/')
  //       }
  //       setIsLoading(false)
  //     } catch (error: any) {
  //       setIsLoading(false)
  //       Toast.show({
  //         text1: t('auth.login_failed'),
  //         text2: t('auth.checkCredentials'),
  //         type: 'error',
  //       })
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   },
  // })

  
  // useEffect(() => {
  //   formik.validateForm();
  // }, [loginMethod]);
const {t,i18n,router,formik,isLoading,rememberMe,setRememberMe,loginMethod,setLoginMethod} = useLogin();
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
          {/* Conditional Input based on Tab */}
          {loginMethod === 'email' ? (
            <Input
              label={t('auth.email')}
              placeholder={t('auth.enterEmail')}
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              type="email"
              keyboardType="email-address"
              error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
            />
          ) : (
            <Input
              label={t('auth.phone')}
              placeholder={t('auth.enterPhone')}
              value={formik.values.phone}
              onChangeText={formik.handleChange('phone')}
              type="phone"
              keyboardType="phone-pad"
              error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
            />
          )}

          {/* Password Input */}
          <Input
            label={t('auth.password')}
            placeholder={t('auth.enterPassword')}
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            type="password"
            error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
          />

          {/* Remember Me & Forgot Password */}
          <View className={`flex-row justify-between items-center mt-4 ${i18n.language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <Pressable
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center"
            >
              <View className={`w-5 h-5 border-2 border-gray-300 rounded mr-2 items-center justify-center ${rememberMe ? ' border-primary' : ''}`}>
                {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <Text className="text-black dark:text-white">
                {t('auth.rememberMe')}
              </Text>
            </Pressable>

            <Link href="/auth/forget-password" >
              <Text className="text-primary dark:text-white font-medium">
                {t('auth.forgotPassword')}
              </Text>
            </Link>
          </View>

          {/* Login Button */}
          <View className="mt-8">
            <Button
              variant="primary"
              size='lg'
              title={isLoading ? t('auth.signingIn') : t('auth.signIn')}
              onPress={() => formik.handleSubmit()}
              disabled={isLoading || !formik.isValid || !formik.dirty}
            />
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-gray-600 dark:text-white">
              {t('auth.dontHaveAccount')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text className="text-primary dark:text-white font-semibold ml-1">
                {t('auth.signUp')}
              </Text>
            </TouchableOpacity>
          </View>

          <SocialLoginSection />
        </View>
      </View>
    </AuthLayout>
  )
}
