import Button from '@/components/ui/button'
import Header from '@/components/ui/header'
import Input from '@/components/ui/input'
import Layout from '@/components/ui/layout'
import Loading from '@/components/ui/loading'
import { config } from '@/constants/config'
import { updateProfile } from '@/controllers/profile'
import { useAuth } from '@/hooks/useAuth'
import Ionicons from '@expo/vector-icons/Ionicons'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import * as Yup from 'yup'

// Profile data interface based on API response
interface ProfileData {
    id: number
    name: string
    email: string
    phone: string
    avatar: string | null
    email_verified: boolean
    phone_verified: boolean
    is_active: boolean
    auth_method: string
    provider_id: string
    provider_name: string
    role_id: number
    role: {
        id: number
        role: string
        title_en: string
        title_ar: string
    }
    store: {
        id: number
        name: string
        logo: string | null
        banner: string | null
        address: string
        phone: string
        is_active: boolean
        is_verified: boolean
        is_featured: boolean
        rating: number
        start_time: string
        end_time: string
    } | null
}

export default function EditProfile() {
    const { auth } = useAuth()
    const { t } = useTranslation()

    const [avatar, setAvatar] = useState<string | null>(null)
    const [avatarFile, setAvatarFile] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [fetchingProfile, setFetchingProfile] = useState(true)
    const [profileData, setProfileData] = useState<ProfileData | null>(null)

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required(t('auth.name_required'))
            .min(2, t('auth.name_min_length') || 'Name must be at least 2 characters'),
        email: Yup.string()
            .required(t('auth.email_required'))
            .email(t('auth.email_invalid')),
        phone: Yup.string()
            .required(t('auth.phone_required'))
            .min(10, t('auth.phone_min_length') || 'Phone must be at least 10 digits'),
    })

    // Formik setup
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true)

            try {
                const result = await updateProfile(
                    auth?.token || '',
                    values,
                    avatarFile
                )

                if (result.success) {
                    Toast.show({
                        type: 'success',
                        text1: t('common.success'),
                        text2: t('profile.updateSuccess'),
                    })

                    // Refetch profile data to get updated information
                    await getProfile()

                }
            } catch (error: any) {
                console.error('Update error:', error)
                Toast.show({
                    type: 'error',
                    text1: t('common.error'),
                    text2: error.response?.data?.message || t('profile.updateFailed'),
                })
            } finally {
                setLoading(false)
            }
        },
    })



    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (status !== 'granted') {
                Toast.show({
                    type: 'error',
                    text1: t('common.error'),
                    text2: t('profile.permissionDenied'),
                })
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            })

            if (!result.canceled && result.assets[0]) {
                setAvatar(result.assets[0].uri)
                setAvatarFile(result.assets[0])
            }
        } catch (error) {
            console.error('Error picking image:', error)
        }
    }



    const getProfile = async () => {
        try {
            setFetchingProfile(true)
            const response = await axios.get(`${config.URL}/auth/get-profile`, {
                headers: {
                    Authorization: `Bearer ${auth?.token}`,
                },
            })

            const data: ProfileData = response.data.data
            setProfileData(data)

            // Populate form with profile data
            formik.setValues({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
            })

            // Set avatar if exists
            if (data.avatar) {
                setAvatar(data.avatar)
            }

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: t('common.error'),
                text2: error.response?.data?.message || t('profile.fetchFailed') || 'Failed to fetch profile',
            })
        } finally {
            setFetchingProfile(false)
        }
    }

    useEffect(() => {
        if (auth?.token) {
            getProfile()
        }
    }, [auth?.token])
    return (
        <Layout>
            <Header title={t('account.edit_profile')} />

            {fetchingProfile ? (
                <Loading />
            ) : (
                <ScrollView className="flex-1 px-5 py-6">
                    {/* Avatar Section */}
                    <View className="items-center mb-8">
                        <TouchableOpacity
                            onPress={pickImage}
                            activeOpacity={0.8}
                            className="relative"
                        >
                            <View className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 items-center justify-center overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                                {avatar ? (
                                    <Image
                                        source={{ uri: avatar }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Ionicons name="person" size={60} color="#9CA3AF" />
                                )}
                            </View>

                            {/* Edit Icon Badge */}
                            <View className="absolute bottom-0 right-0 bg-primary w-10 h-10 rounded-full items-center justify-center border-4 border-white dark:border-gray-900">
                                <Ionicons name="camera" size={20} color="white" />
                            </View>
                        </TouchableOpacity>

                        <Text className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                            {t('profile.tapToChangeAvatar')}
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View className="space-y-4">
                        {/* Name Input */}
                        <View>
                            <Input
                                label={t('auth.name')}
                                placeholder={t('auth.enterName')}
                                value={formik.values.name}
                                onChangeText={formik.handleChange('name')}
                                error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
                            />
                        </View>

                        {/* Email Input */}
                        <View className="mt-4">
                            <Input
                                label={t('auth.email')}
                                placeholder={t('auth.enterEmail')}
                                value={formik.values.email}
                                onChangeText={formik.handleChange('email')}
                                keyboardType="email-address"
                                error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                            />
                        </View>

                        {/* Phone Input */}
                        <View className="mt-4">
                            <Input
                                label={t('auth.phone')}
                                placeholder={t('auth.enterPhone')}
                                value={formik.values.phone}
                                onChangeText={formik.handleChange('phone')}
                                keyboardType="phone-pad"
                                error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
                            />
                        </View>
                    </View>

                    {/* Update Button */}
                    <View className="mt-8 mb-6">
                        <Button
                            title={loading ? t('common.updating') : t('common.update')}
                            onPress={formik.handleSubmit}
                            loading={loading}
                            size='lg'
                            disabled={loading || !formik.isValid}
                        />
                    </View>
                </ScrollView>
            )}
        </Layout >
    )
}