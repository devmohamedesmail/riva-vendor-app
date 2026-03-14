import BottomPaper from '@/components/ui/bottom-paper'
import Button from '@/components/ui/button'
import Header from '@/components/ui/header'
import CustomImagePicker from '@/components/ui/image-picker'
import Input from '@/components/ui/input'
import Layout from '@/components/ui/layout'
import Loading from '@/components/ui/loading'
import Select from '@/components/ui/select'
import TimePickerButton from '@/components/ui/time-picker-button'
import { config } from '@/constants/config'
import { AuthContext } from '@/context/auth-provider'
import useFetch from '@/hooks/useFetch'
import { useStore } from '@/hooks/useStore'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios'
import { useRouter } from 'expo-router'
import { useFormik } from 'formik'
import { useColorScheme } from 'nativewind'
import React, { useContext, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'
import * as Yup from 'yup'



interface StoreType {
    id: number
    name_en: string
    name_ar: string
    description: string | null
}

interface Place {
    id: number
    name: string
    address: string
    latitude: string
    longitude: string
    createdAt: string
    updatedAt: string
    storeTypes: StoreType[]
}

interface StoreFormValues {
    place_id: string
    store_type_id: string
    name: string
    logo: string
    phone: string
    start_time: string
    end_time: string

}

export default function Create() {
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const { auth } = useContext(AuthContext)
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

    if (loadingPlaces) {
        return <Loading />
    }

    return (
        <>
            <Layout>
                <Header title={t('store.createStore')} />
                <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                    {/* Subtitle */}
                    <Text className={`text-black dark:text-white text-center mb-6 `} >
                        {t('store.createStoreSubtitle')}
                    </Text>

                    {/* Form Card */}
                    <View className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-6">
                        {/* Section 1: Location & Type */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="location-outline" size={24} color="#fd4a12" />
                                <Text className="text-lg font-semibold text-gray-800 dark:text-white ml-2">
                                    {t('store.locationAndType')}
                                </Text>
                            </View>
                            <View className="h-1 w-20 bg-primary rounded mb-4" />

                            {/* Place Picker — opens BottomSheet */}
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                {t('store.selectPlace') || 'Select Place'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => { setPlaceSearch(''); placeSheetRef.current?.expand() }}
                                className={`flex-row items-center justify-between px-4 py-3 rounded-xl border ${formik.touched.place_id && formik.errors.place_id
                                    ? 'border-red-400'
                                    : 'border-gray-200 dark:border-gray-700'
                                    } bg-white dark:bg-gray-800`}
                            >
                                <View className="flex-row items-center gap-2 flex-1">
                                    <View className="w-8 h-8 rounded-lg items-center justify-center bg-orange-50 dark:bg-gray-700">
                                        <Ionicons name="location-outline" size={16} color="#fd4a12" />
                                    </View>
                                    <Text
                                        className="text-sm flex-1"
                                        style={{ color: selectedPlace ? (isDark ? '#fff' : '#111') : (isDark ? '#666' : '#aaa') }}
                                        numberOfLines={1}
                                    >
                                        {selectedPlace ? selectedPlace.name : (t('store.choosePlacePlaceholder') || 'Choose a place')}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-down" size={18} color={isDark ? '#666' : '#aaa'} />
                            </TouchableOpacity>
                            {formik.touched.place_id && formik.errors.place_id && (
                                <Text className="text-red-500 text-xs mt-1">{formik.errors.place_id}</Text>
                            )}

                            {/* Store Type Selection - Only show when place is selected */}
                            {formik.values.place_id && (
                                <Select
                                    label={t('store.selectStoreType') || 'Select Store Type'}
                                    placeholder={t('store.chooseStoreTypePlaceholder') || 'Choose a store type'}
                                    value={formik.values.store_type_id}
                                    onSelect={(value: string) => formik.setFieldValue('store_type_id', value)}
                                    options={storeTypeOptions}
                                    disabled={availableStoreTypes.length === 0}
                                    error={formik.touched.store_type_id && formik.errors.store_type_id ? formik.errors.store_type_id : undefined}
                                />
                            )}

                            {/* Show message if no store types available */}
                            {formik.values.place_id && availableStoreTypes.length === 0 && (
                                <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                                    <Text className="text-yellow-800 text-center" style={{ fontFamily: 'Cairo_400Regular' }}>
                                        {t('store.noStoreTypesAvailable') || 'No store types available for this place'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Show form fields only when store type is selected */}
                        {formik.values.store_type_id && (
                            <>
                                {/* Section 2: Store Information */}
                                <View className="mb-6">
                                    <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                                        <Ionicons name="storefront-outline" size={24} color="#fd4a12" />
                                        <Text className="text-lg font-semibold text-gray-800 ml-2" >
                                            {t('store.storeInformation') || 'Store Information'}
                                        </Text>
                                    </View>
                                    <View className="h-1 w-20 bg-primary rounded mb-4" />

                                    {/* Store Name */}
                                    <Input
                                        label={t('store.storeName') || 'Store Name *'}
                                        placeholder={t('store.enterStoreName') || 'Enter store name'}
                                        value={formik.values.name}
                                        onChangeText={formik.handleChange('name')}
                                        keyboardType="default"
                                        error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
                                    />

                                    {/* Address */}


                                    {/* Phone */}
                                    <Input
                                        label={t('store.storePhone') || 'Phone *'}
                                        placeholder={t('store.enterPhone') || 'Enter phone number'}
                                        value={formik.values.phone}
                                        onChangeText={formik.handleChange('phone')}
                                        keyboardType="phone-pad"
                                        error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
                                    />
                                </View>

                                {/* Section 3: Store Images */}
                                <View className="mb-6">
                                    <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                                        <Ionicons name="images-outline" size={24} color="#fd4a12" />
                                        <Text className="text-lg font-semibold text-gray-800 ml-2">
                                            {t('store.storeImages')}
                                        </Text>
                                    </View>
                                    <View className="h-1 w-20 bg-primary rounded mb-4" />

                                    {/* Logo Image */}
                                    <CustomImagePicker
                                        label={t('store.storeLogo') || 'Store Logo'}
                                        placeholder={t('store.selectLogo') || 'Tap to select logo'}
                                        value={formik.values.logo}
                                        onImageSelect={(uri) => formik.setFieldValue('logo', uri)}
                                        aspect={[1, 1]}
                                        allowsEditing={true}
                                    />

                                    {/* Banner Image */}

                                </View>

                                {/* Section 4: Operating Hours */}
                                <View className="mb-6">
                                    <View className={`flex-row items-center mb-4 ${isArabic ? 'flex-row-reverse' : 'text-left'}`}>
                                        <Ionicons name="time-outline" size={24} color="#fd4a12" />
                                        <Text className="text-lg font-semibold text-gray-800 ml-2" >
                                            {t('store.operatingHours')}
                                        </Text>
                                    </View>
                                    <View className="h-1 w-20 bg-primary rounded mb-4" />

                                    {/* Start Time */}


                                    <TimePickerButton
                                        label={t('store.startTime')}
                                        value={formik.values.start_time}
                                        onPress={() => setShowStartTimePicker(true)}
                                        error={formik.touched.start_time && formik.errors.start_time ? formik.errors.start_time : undefined}
                                    />

                                    {/* End Time */}


                                    <TimePickerButton
                                        label={t('store.endTime')}
                                        value={formik.values.end_time}
                                        onPress={() => setShowEndTimePicker(true)}
                                        error={formik.touched.end_time && formik.errors.end_time ? formik.errors.end_time : undefined}
                                    />

                                    {/* Time Pickers */}
                                    {showStartTimePicker && (
                                        <DateTimePicker
                                            value={startTimeDate}
                                            mode="time"
                                            is24Hour={false}
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={handleStartTimeChange}
                                        />
                                    )}

                                    {showEndTimePicker && (
                                        <DateTimePicker
                                            value={endTimeDate}
                                            mode="time"
                                            is24Hour={false}
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={handleEndTimeChange}
                                        />
                                    )}
                                </View>



                                {/* Submit Button */}
                                <View className="mt-4">
                                    <Button
                                        size='lg'
                                        disabled={isSubmitting}
                                        title={t('common.create')}
                                        onPress={formik.handleSubmit}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </Layout>

            {/* ── Place Picker BottomSheet ───────────────────────────────── */}
            <BottomPaper ref={placeSheetRef} snapPoints={['60%']}>
                <View className="flex-1 px-4 pt-2">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white">
                            {t('store.selectPlace') || 'Select Place'}
                        </Text>
                        <TouchableOpacity onPress={() => placeSheetRef.current?.close()}>
                            <AntDesign name="close" size={22} color={isDark ? '#ccc' : '#555'} />
                        </TouchableOpacity>
                    </View>

                    {/* Search */}
                    <View className="flex-row items-center rounded-xl px-3 py-2 mb-3 bg-gray-100 dark:bg-gray-800">
                        <Ionicons name="search" size={18} color="#fd4a12" style={{ marginRight: 8 }} />
                        <TextInput
                            value={placeSearch}
                            onChangeText={setPlaceSearch}
                            placeholder="Search places..."
                            placeholderTextColor={isDark ? '#666' : '#aaa'}
                            className="flex-1 text-sm text-gray-900 dark:text-white"
                        />
                        {placeSearch.length > 0 && (
                            <TouchableOpacity onPress={() => setPlaceSearch('')}>
                                <AntDesign name="close" size={16} color="#aaa" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Places list */}
                    <FlatList
                        data={filteredPlaces}
                        keyExtractor={(item) => item.id.toString()}
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        ListEmptyComponent={
                            <Text className="text-center text-sm text-gray-400 mt-6">
                                No places found
                            </Text>
                        }
                        renderItem={({ item }) => {
                            const isSelected = formik.values.place_id === item.id.toString()
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        handlePlaceSelect(item.id.toString())
                                        placeSheetRef.current?.close()
                                    }}
                                    className="flex-row items-center p-3 rounded-xl mb-2 border"
                                    style={{
                                        backgroundColor: isSelected
                                            ? isDark ? '#2a1a15' : '#fff4f0'
                                            : isDark ? '#111' : '#fff',
                                        borderColor: isSelected ? '#fd4a12' : isDark ? '#222' : '#eee',
                                        borderWidth: 1.5,
                                    }}
                                >
                                    <View
                                        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                                        style={{ backgroundColor: isSelected ? '#fd4a12' : isDark ? '#333' : '#f0f0f0' }}
                                    >
                                        <Ionicons
                                            name="location-outline"
                                            size={18}
                                            color={isSelected ? '#fff' : '#fd4a12'}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text
                                            className="text-sm font-semibold"
                                            style={{ color: isDark ? '#fff' : '#111' }}
                                            numberOfLines={1}
                                        >
                                            {item.name}
                                        </Text>
                                        {item.address ? (
                                            <Text
                                                className="text-xs mt-0.5"
                                                style={{ color: isDark ? '#888' : '#aaa' }}
                                                numberOfLines={1}
                                            >
                                                {item.address}
                                            </Text>
                                        ) : null}
                                    </View>
                                    {isSelected && (
                                        <View className="w-6 h-6 rounded-full items-center justify-center bg-primary">
                                            <AntDesign name="check" size={13} color="#fff" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </BottomPaper>
        </>
    )
}