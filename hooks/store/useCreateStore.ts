import { useRouter } from 'expo-router'
import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/auth/useAuth'
import {useColorScheme} from 'nativewind'
import useFetch from '@/hooks/common/useFetch'
import BottomSheet from '@gorhom/bottom-sheet'
import { useStore } from '@/hooks/store/useStore'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Place } from '@/@types/store'
import axios from 'axios'
import { config } from '@/constants/config'
import Toast from 'react-native-toast-message'
import { Platform } from 'react-native'

interface StoreFormValues {
    place_id: string
    store_type_id: string
    name: string
    logo: string
    phone: string
    start_time: string
    end_time: string

}
export default function useCreateStore() {
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const { auth } = useAuth()
    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'
    const { data: placesData, loading: loadingPlaces, error: errorPlaces } = useFetch('/places')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const isArabic = i18n.language === 'ar'
    const { getStore } = useStore()

    // Place sheet
    const placeSheetRef = useRef<BottomSheet>(null)
    const [placeSearch, setPlaceSearch] = useState('')

    // Time picker states
    const [showStartTimePicker, setShowStartTimePicker] = useState(false)
    const [showEndTimePicker, setShowEndTimePicker] = useState(false)
    const [startTimeDate, setStartTimeDate] = useState(new Date())
    const [endTimeDate, setEndTimeDate] = useState(new Date())

    // Validation schema
    const validationSchema = Yup.object().shape({
        place_id: Yup.string().required(t('store.placeRequired')),
        store_type_id: Yup.string().required(t('store.storeTypeRequired')),
        name: Yup.string().required(t('store.nameRequired')),
        phone: Yup.string().required(t('store.phoneRequired')),
        start_time: Yup.string().required(t('store.startTimeRequired')),
        end_time: Yup.string().required(t('store.endTimeRequired')),

    })

    // Formik setup
    const formik = useFormik<StoreFormValues>({
        initialValues: {
            place_id: '',
            store_type_id: '',
            name: '',
            logo: '',
            phone: '',
            start_time: '',
            end_time: '',

        },
        validationSchema,
        onSubmit: async (values) => {
            setIsSubmitting(true)

            try {
                const formData = new FormData()
                formData.append('place_id', values.place_id)
                formData.append('store_type_id', values.store_type_id)
                formData.append('name', values.name)
                formData.append('phone', values.phone)
                formData.append('start_time', values.start_time)
                formData.append('end_time', values.end_time)


                // Add images if selected
                if (values.logo) {
                    const logoFile = {
                        uri: values.logo,
                        type: 'image/jpeg',
                        name: 'logo.jpg',
                    } as any
                    formData.append('logo', logoFile)
                }

                const { data } = await axios.post(`${config.URL}/stores/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${auth.token}`
                    }
                })

                if (data?.success) {
                    Toast.show({
                        type: 'success',
                        text1: t('store.storeCreatedSuccess'),
                        position: 'top',
                        visibilityTime: 1000,
                    })
                    formik.resetForm()
                    await getStore()
                    setTimeout(() => { router.push('/') }, 1000)

                } else {
                    1
                    Toast.show({
                        type: 'error',
                        text1: t('store.storeCreationFailed'),
                        position: 'top',
                        visibilityTime: 1000,
                    })
                }

            } catch (error: any) {
                Toast.show({
                    type: 'error',
                    text1: t('store.storeCreationFailed'),
                    position: 'bottom',
                    visibilityTime: 2000,
                })
            } finally {
                setIsSubmitting(false)
            }
        },
    })

    // Filtered places for bottom sheet search
    const allPlaces: Place[] = placesData?.data || []
    const filteredPlaces = useMemo(
        () => allPlaces.filter((p) => p.name.toLowerCase().includes(placeSearch.toLowerCase())),
        [allPlaces, placeSearch]
    )

    const selectedPlace = allPlaces.find((p) => p.id.toString() === formik.values.place_id)

    // Derive available store types from selected place
    const availableStoreTypes = selectedPlace?.storeTypes || []

    // Format store types for dropdown
    const storeTypeOptions = availableStoreTypes.map((item: any) => ({
        label: i18n.language === 'ar' ? item.storeType.name_ar : item.storeType.name_en,
        value: item.storeType.id.toString(),
    }))

    const handlePlaceSelect = (value: string) => {
        formik.setFieldValue('place_id', value)
        formik.setFieldValue('store_type_id', '')
    }

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
 loadingPlaces,
        t,
        setPlaceSearch,
        placeSheetRef,
        selectedPlace,
        formik,
        storeTypeOptions,
        isDark,
        availableStoreTypes,
        isArabic,
        setShowStartTimePicker,
        setShowEndTimePicker,
        showStartTimePicker,
        startTimeDate,
        showEndTimePicker,
        handleStartTimeChange,
        handleEndTimeChange,
        endTimeDate,
        isSubmitting,
        placeSearch,
        filteredPlaces,
        handlePlaceSelect
  }
}
