import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import colors from '@/constants/colors'
import { useColorScheme } from 'nativewind'


export default function Layout() {
    const { t , i18n} = useTranslation()
    const { colorScheme } = useColorScheme()
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.light.tabIconSelected,
            tabBarInactiveTintColor: colors.light.tabIconDefault,
            tabBarStyle: {
                backgroundColor: colorScheme === "dark" ? '#000' : '#fff',
                borderTopWidth: 1,
                borderTopColor: colorScheme === "dark" ? '#000' : '#e5e7eb',
            },
            tabBarLabelStyle: {
                    fontFamily: i18n.language === 'ar' ? 'Cairo_400Regular' : 'Poppins_400Regular',
                    fontSize: 9,
            },
        }}>

            <Tabs.Screen
                name="index"
                options={{
                    tabBarLabel: t('common.home'),
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />


             <Tabs.Screen
                name="orders/index"
                options={{
                    tabBarLabel: t('orders.orders'),
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'receipt' : 'receipt-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />


             <Tabs.Screen
                name="dialy-orders/index"
                options={{
                    tabBarLabel: t('orders.dialy-orders'),
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'receipt' : 'receipt-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />












        </Tabs>
    )
}
