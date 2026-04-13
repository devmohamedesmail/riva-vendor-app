import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { config } from '@/constants/config';
import { useAuth } from '@/hooks/useAuth';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import AccountActionButton from './account-action-button';
import Text from '@/components/ui/text';


export default function AccountActionSection() {
    const { t } = useTranslation()
    const { colorScheme } = useColorScheme()
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false)
    const { auth, logout } = useAuth()
    const router = useRouter()






    const handleConfirmLogout = async () => {
        setIsLogoutModalVisible(false)
        await logout()
        router.replace('/auth/login')
    }




    const formik = useFormik({
        initialValues: {
            password: '',
        },
        validationSchema: Yup.object({
            password: Yup.string().required(t('account.password_required')),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${config.URL}/auth/delete-account`, values, {
                    headers: {
                        'Authorization': `Bearer ${auth?.token}`,
                    }
                })
                Toast.show({
                    type: 'success',
                    text1: t('account.delete_account_success'),
                })
                await logout()
                router.replace('/auth/login')
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: t('account.delete_account_error'),
                })
            }
        },
    })




    return (
        <>

            <View className='mt-4'>

                <AccountActionButton
                    title={t('account.logout')}
                    icon={<AntDesign name="logout" size={24} color='white' />}
                    onPress={() => setIsLogoutModalVisible(true)}

                />


                <AccountActionButton
                    title={t('account.delete_account')}
                    icon={<Feather name="trash" size={24} color='white' />}
                    onPress={() => setIsDeleteModalVisible(true)}

                />

            </View>


            {/* Delete Modal */}
            <Modal
                isVisible={isDeleteModalVisible}
                onBackdropPress={() => setIsDeleteModalVisible(false)}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.7}
            >
                <View className='bg-white dark:bg-gray-800 rounded-3xl p-6 mx-4 shadow-2xl'>
                    {/* Icon Header */}
                    <View className='items-center mb-6'>
                        <View className='bg-red-100 dark:bg-red-900/30 rounded-full p-5 mb-4'>
                            <Feather name="alert-triangle" size={48} color="#EF4444" />
                        </View>
                        <Text
                            className='text-center text-2xl mb-2'>
                            {t('account.delete_account')}
                        </Text>
                        <Text
                            className='text-center text-gray-600 dark:text-gray-400 text-base px-4'
                        >
                            {t('account.delete_warning') || 'This action cannot be undone. Please enter your password to confirm.'}
                        </Text>
                    </View>

                    {/* Password Input */}
                    <View className='mb-6'>
                        <Input
                            label={t('auth.password')}
                            placeholder={t('auth.password')}
                            type='password'
                            value={formik.values.password}
                            onChangeText={formik.handleChange('password')}
                            error={formik.errors.password}
                        />
                    </View>

                    {/* Action Buttons */}
                    <View className='flex flex-col gap-3'>
                        <Button
                            title={t('account.delete')}
                            onPress={() => formik.handleSubmit()}
                            className='bg-red-600 dark:bg-red-500 py-4 rounded-xl shadow-lg'
                        />
                        <Button
                            title={t('auth.cancel')}
                            onPress={() => setIsDeleteModalVisible(false)}
                            className='bg-gray-200 dark:bg-gray-700 py-4 rounded-xl'
                        />
                    </View>
                </View>
            </Modal>


            {/* Logout Modal */}
            <Modal
                isVisible={isLogoutModalVisible}
                onBackdropPress={() => setIsLogoutModalVisible(false)}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.7}
            >
                <View className='bg-white dark:bg-gray-800 rounded-3xl p-6 mx-4 shadow-2xl'>
                    {/* Icon Header */}
                    <View className='items-center mb-6'>
                        <View className='bg-orange-100 dark:bg-orange-900/30 rounded-full p-5 mb-4'>
                            <AntDesign name="logout" size={48} color="#F97316" />
                        </View>
                        <Text
                            className='text-center text-2xl mb-2'
                        >
                            {t('account.logout')}
                        </Text>
                        <Text
                            className='text-center text-gray-600 dark:text-gray-400 text-base px-4'
                            style={{ fontFamily: 'Cairo_400Regular' }}
                        >
                            {t('account.logout_confirmation') || 'Are you sure you want to logout from your account?'}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className='flex flex-col gap-3'>
                        <Button
                            title={t('account.logout')}
                            onPress={() => handleConfirmLogout()}
                            className='bg-orange-600 dark:bg-orange-500 py-4 rounded-xl shadow-lg'
                        />
                        <Button
                            title={t('auth.cancel')}
                            onPress={() => setIsLogoutModalVisible(false)}
                            className='bg-gray-200 dark:bg-gray-700 py-4 rounded-xl'
                        />
                    </View>
                </View>
            </Modal>

        </>
    )
}
