import { StoreFormValues } from './../../@types/store';

import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../useAuth'
import { useStore } from '../useStore'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Toast from 'react-native-toast-message'
import axios from 'axios';
import { config } from '@/constants/config';
import { Platform } from 'react-native';

export default function useUpdateStore() {
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const { auth } = useAuth();
    const { data } = useLocalSearchParams()
    const storeData = data ? JSON.parse(data as string) : null
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const isArabic = i18n.language === 'ar'
    const { getStore } = useStore()

    // Initialize time dates from store data
    const parseTime = (timeString: string) => {
        if (!timeString) return new Date()
        const [hours, minutes] = timeString.split(':')
        const date = new Date()
        date.setHours(parseInt(hours, 10))
        date.setMinutes(parseInt(minutes, 10))
        return date
    }

    // Time picker states
    const [showStartTimePicker, setShowStartTimePicker] = useState(false)
    const [showEndTimePicker, setShowEndTimePicker] = useState(false)
    const [startTimeDate, setStartTimeDate] = useState(
        storeData?.start_time ? parseTime(storeData.start_time) : new Date()
    )
    const [endTimeDate, setEndTimeDate] = useState(
        storeData?.end_time ? parseTime(storeData.end_time) : new Date()
    )

    // Validation schema
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('store.nameRequired')),
        address: Yup.string().required(t('store.addressRequired') || 'Address is required'),
        phone: Yup.string().required(t('store.phoneRequired')),
        start_time: Yup.string().required(t('store.startTimeRequired') || 'Start time is required'),
        end_time: Yup.string().required(t('store.endTimeRequired') || 'End time is required'),
    })


    // Formik setup
    const formik = useFormik<StoreFormValues>({
        initialValues: {
            name: storeData?.name || '',
            logo: storeData?.logo || '',
            banner: storeData?.banner || '',
            address: storeData?.address || '',
            phone: storeData?.phone || '',
            start_time: storeData?.start_time || '',
            end_time: storeData?.end_time || '',
            latitude: storeData?.latitude || '',
            longitude: storeData?.longitude || '',

        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true)

            try {
                const formData = new FormData()

                // Append required fields (ensure they're not empty)
                if (!values.name || !values.address || !values.phone) {
                    Toast.show({
                        type: 'error',
                        text1: t('store.fillAllRequiredFields') || 'Please fill all required fields',
                        position: 'bottom',
                        visibilityTime: 2000,
                    })

                    setIsSubmitting(false)
                    return
                }

                formData.append('name', values.name)
                formData.append('address', values.address)
                formData.append('phone', values.phone)

                if (values.latitude) {
                    formData.append('latitude', values.latitude)
                }
                if (values.longitude) {
                    formData.append('longitude', values.longitude)
                }
                // Only append times if they exist
                if (values.start_time) {
                    formData.append('start_time', values.start_time)
                }
                if (values.end_time) {
                    formData.append('end_time', values.end_time)
                }

                // Add images if selected
                if (values.logo && values.logo !== storeData?.logo) {
                    const logoFile = {
                        uri: values.logo,
                        type: 'image/jpeg',
                        name: 'logo.jpg',
                    } as any
                    formData.append('logo', logoFile)
                }

                if (values.banner && values.banner !== storeData?.banner) {
                    const bannerFile = {
                        uri: values.banner,
                        type: 'image/jpeg',
                        name: 'banner.jpg',
                    } as any
                    formData.append('banner', bannerFile)
                }



                const { data } = await axios.put(
                    `${config.URL}/stores/update/${storeData?.id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${auth.token}`
                        }
                    }
                )

                if (data?.success) {
                    Toast.show({
                        type: 'success',
                        text1: t('store.storeUpdatedSuccess'),
                        position: 'top',
                        visibilityTime: 2000,
                    })
                    await getStore()
                    setTimeout(() => {
                        router.back()
                    }, 1000);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: t('store.storeUpdateFailed'),
                        position: 'top',
                        visibilityTime: 2000,
                    })
                }

            } catch (error: any) {
                Toast.show({
                    type: 'error',
                    text1: error.response?.data?.message || t('store.storeUpdateFailed'),
                    position: 'bottom',
                    visibilityTime: 3000,
                })
            } finally {
                setIsSubmitting(false)
            }
        },
    })

    // Time picker handlers
    const handleStartTimeChange = (event: any, selectedDate?: Date) => {
        setShowStartTimePicker(Platform.OS === 'ios')
        if (selectedDate) {
            setStartTimeDate(selectedDate)
            const hours = selectedDate.getHours().toString().padStart(2, '0')
            const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
            formik.setFieldValue('start_time', `${hours}:${minutes}`)
        }
    }

    const handleEndTimeChange = (event: any, selectedDate?: Date) => {
        setShowEndTimePicker(Platform.OS === 'ios')
        if (selectedDate) {
            setEndTimeDate(selectedDate)
            const hours = selectedDate.getHours().toString().padStart(2, '0')
            const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
            formik.setFieldValue('end_time', `${hours}:${minutes}`)
        }
    }

    return {
        storeData,
        t,
        isArabic,
        formik,
        setShowStartTimePicker,
        setShowEndTimePicker,
        showStartTimePicker,
        showEndTimePicker,
        startTimeDate,
        handleStartTimeChange,
        endTimeDate,
        handleEndTimeChange,
        isSubmitting

    }
}
