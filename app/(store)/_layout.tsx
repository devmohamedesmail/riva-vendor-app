import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import colors from '@/constants/colors'
import { useColorScheme } from 'nativewind'

export default function Layout() {
  const { t } = useTranslation()
  const { colorScheme } = useColorScheme()
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor:
      colorScheme === 'dark'
        ? colors.light.tabIconSelected 
        : colors.light.tabIconSelected,

    tabBarInactiveTintColor:
      colorScheme === 'dark'
        ? '#9ca3af' // inactive color in dark mode
        : colors.light.tabIconDefault,
      
      tabBarStyle: {
        backgroundColor: colorScheme === "dark" ? '#000' : '#fff',
        borderTopWidth: 1,
        borderTopColor: colorScheme === "dark" ? '#000' : '#e5e7eb',
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
        name="categories/index"
        options={{
          tabBarLabel: t('categories.categories'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="products/index"
        options={{
          tabBarLabel: t('products.products'),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'cube' : 'cube-outline'}
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

      {/* Hidden screens */}
      <Tabs.Screen name="create/index" options={{ href: null }} />
      <Tabs.Screen name="update/index" options={{ href: null }} />
      <Tabs.Screen name="categories/update" options={{ href: null }} />
      <Tabs.Screen name="categories/show" options={{ href: null }} />
      <Tabs.Screen name="categories/add" options={{ href: null }} />
      <Tabs.Screen name="products/add" options={{ href: null }} />
      <Tabs.Screen name="products/update" options={{ href: null }} />

    </Tabs>
  )
}
