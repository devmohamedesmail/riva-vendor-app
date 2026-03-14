import React from 'react'
import { Platform, View } from 'react-native'
import SectionTitle from './section-title'
import { Ionicons } from '@expo/vector-icons'
import TimePickerButton from '@/components/ui/time-picker-button'
import DateTimePicker from '@react-native-community/datetimepicker'

export default function StoreOpeningSection(
    { 
        t,
        formik,
        setShowStartTimePicker,
        setShowEndTimePicker,
        showStartTimePicker,
        startTimeDate,
        handleStartTimeChange,
        showEndTimePicker,
        endTimeDate,
        handleEndTimeChange
    }: any) {
    return (
        <View className="mb-6">


            <SectionTitle
                title={t('store.operatingHours')}
                icon={<Ionicons name="time-outline" size={24} color="#fd4a12" />}

            />




            {/* Start Time */}
            <TimePickerButton
                label={t('store.startTime')}
                value={formik.values.start_time || t('store.selectStartTime')}
                onPress={() => setShowStartTimePicker(true)}
                error={formik.touched.start_time && formik.errors.start_time ? formik.errors.start_time : undefined}
            />


            {/* End Time */}

            <TimePickerButton
                label={t('store.endTime')}
                value={formik.values.end_time || t('store.selectEndTime')}
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
    )
}
