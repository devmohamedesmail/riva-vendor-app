import Header from '@/components/ui/header'
import Layout from '@/components/ui/layout'
import React from 'react'
import { View } from 'react-native'
import Text from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

export default function AdminIndex() {
    const { t } = useTranslation();
    return (
        <Layout>
            <Header backButton={false} title={t('common.home')} />
            <View>
                <Text>AdminIndex</Text>
            </View>
        </Layout>
    )
}
