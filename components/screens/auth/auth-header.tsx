import LanguageToggle from '@/components/ui/language-toggle'
import Logo from '@/components/ui/logo'
import ThemeToggle from '@/components/ui/theme-toggle'
import { useSetting } from '@/hooks/useSetting'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, View } from 'react-native'
import Text from '@/components/ui/text';



export default function AuthHeader({ title }: { title?: string }) {
    const { t, i18n } = useTranslation()
    const { settings } = useSetting()

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(-50)).current
    const scaleAnim = useRef(new Animated.Value(0.8)).current
    const pulseAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start()

        // Continuous pulse animation for logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }, [])

    return (
        <LinearGradient
            colors={['#000000', '#0a0a0a', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="pt-5 pb-10 px-6"
        >
            {/* Decorative elements */}
            <View className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <View className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

            {/* Main Content */}
            <Animated.View
                className="pt-10"
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}
            >
                <View className="flex-row justify-between items-center w-full mb-4 px-2">
                    <LanguageToggle />
                    <ThemeToggle />
                </View>
                {/* Logo Section */}
                <View className='flex flex-row items-center justify-between'>

                    <View>
                        {/* Brand Name */}
                        <Animated.View
                            className="items-center mb-3"
                            style={{
                                transform: [{ scale: scaleAnim }]
                            }}
                        >
                            <Text
                                className="text-5xl text-white font-black tracking-tight text-center"
                                style={{
                                    textShadowColor: 'rgba(253, 74, 18, 0.3)',
                                    textShadowOffset: { width: 0, height: 4 },
                                    textShadowRadius: 12,
                                }}
                            >
                                {i18n.language === 'ar' ? settings?.name_ar : settings?.name_en}
                            </Text>

                            {/* Underline decoration */}
                            <View className="flex-row items-center mt-3 gap-2">
                                <View className="h-0.5 w-12 bg-primary/50" />
                                <View className="w-2 h-2 bg-primary rounded-full" />
                                <View className="h-0.5 w-12 bg-primary/50" />
                            </View>
                        </Animated.View>

                        {/* Title Section */}
                        {title && (
                            <Animated.View
                                className="items-center mt-4"
                                style={{
                                    opacity: fadeAnim,
                                }}
                            >
                                <View className="bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="shield-checkmark" size={20} color="#fd4a12" />
                                        <Text className="text-xl text-white/90 font-semibold tracking-wide">
                                            {title}
                                        </Text>
                                    </View>
                                </View>
                            </Animated.View>
                        )}
                    </View>
                    <View className="items-center mb-6">
                        <View
                            className="relative"
                           
                        >
                            {/* Glow effect behind logo */}
                            <View className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-110" />

                            {/* Logo container with glassmorphism */}
                            <View className=" overflow-hidden rounded-2xl shadow-2xl border border-white/20">
                                <Logo />
                            </View>

    
                        </View>
                    </View>


                </View>





                {/* Bottom decorative line */}
                <View className="mt-8 items-center">
                    <View className="flex-row items-center gap-1">
                        <View className="w-1 h-1 bg-primary/40 rounded-full" />
                        <View className="w-1 h-1 bg-primary/60 rounded-full" />
                        <View className="w-1 h-1 bg-primary rounded-full" />
                        <View className="w-1 h-1 bg-primary/60 rounded-full" />
                        <View className="w-1 h-1 bg-primary/40 rounded-full" />
                    </View>
                </View>
            </Animated.View>
        </LinearGradient>
    )
}
