import Header from '@/components/ui/header'
import Layout from '@/components/ui/layout'
import { View, Text, ScrollView } from 'react-native'
import Button from '@/components/ui/button'
import KeyboardLayout from '@/components/ui/keyboard-layout'
import useUpdateStore from '@/hooks/store/useUpdateStore'
import StoreInfoSection from '@/components/screens/store/store-info-section'
import StoreLocationSection from '@/components/screens/store/store-location-section'
import StoreImagesSection from '@/components/screens/store/store-images-section'
import StoreOpeningSection from '@/components/screens/store/store-opening-section'




export default function Update() {

  const {
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

  } = useUpdateStore();
  if (!storeData) {
    return (
      <Layout>
        <Header title={t("store.update_store")} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">{t('store.noStoreData')}</Text>
        </View>
      </Layout>
    )
  }

  return (
    <KeyboardLayout>
      <Layout>
        <Header title={t("store.update_store")} />

        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          {/* Subtitle */}
          <Text className="text-gray-600 text-center mb-6">
            {t('store.updateStoreSubtitle', { defaultValue: 'Update your store information' })}
          </Text>

          {/* Form Card */}
          <View className="bg-white dark:bg-card-dark rounded-2xl shadow-sm p-6 mb-6">
            
            <StoreInfoSection
              formik={formik} />

            <StoreLocationSection
              t={t}
              formik={formik}
            />

            <StoreImagesSection
              t={t}
              formik={formik}
            />

            <StoreOpeningSection
              t={t}
              formik={formik}
              setShowStartTimePicker={setShowStartTimePicker}
              setShowEndTimePicker={setShowEndTimePicker}
              showStartTimePicker={showStartTimePicker}
              startTimeDate={startTimeDate}
              handleStartTimeChange={handleStartTimeChange}
              showEndTimePicker={showEndTimePicker}
              endTimeDate={endTimeDate}
              handleEndTimeChange={handleEndTimeChange}

            />

            {/* Submit Button */}
            <View className="mt-4">
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                size="lg"
                title={t('common.update')}
                onPress={formik.handleSubmit}
              />
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardLayout>


  )
}
