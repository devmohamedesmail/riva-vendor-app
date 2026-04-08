import React from 'react'
import { View, Text, Pressable } from 'react-native'
import Input from '@/components/ui/input'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import Button from '@/components/ui/button'

export default function LoginForm({loginMethod,formik,rememberMe,setRememberMe,t,i18n,isLoading}:any) {
  return (
    <View>
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
          </View>
  )
}
