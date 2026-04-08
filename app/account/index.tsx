// import * as Updates from 'expo-updates';
import Header from '@/components/ui/header'
import Layout from '@/components/ui/layout'
import React from 'react'
import { View, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import AccountActionSection from '@/components/screens/account/account-action-section'
import ProfileInfoSection from '@/components/screens/account/profile-info-section'
import AccountOptionsSection from '@/components/screens/account/account-options-section'
import AccountAppVersion from '@/components/screens/account/account-app-version'

export default function Account() {
    const { t } = useTranslation()


    return (
        <Layout>
            <Header title={t('account.account')} />
            <ScrollView className="flex-1">
                <ProfileInfoSection />
                <View className='px-5'>
                    <AccountOptionsSection />
                    <AccountActionSection />
                </View>
                <AccountAppVersion />
            </ScrollView>
        </Layout>
    )
}
