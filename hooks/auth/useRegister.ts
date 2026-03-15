import { useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'expo-router'
import { AuthContext } from '@/context/auth-provider'
import Toast from 'react-native-toast-message'
import {Alert} from 'react-native'

interface RegisterFormValues {
    name: string
    email: string
    phone: string
    password: string
    role_id: number | string
}
export default function useRegister() {
    const { t, i18n } = useTranslation()
        const [isLoading, setIsLoading] = useState(false)
        const { register } = useContext(AuthContext)
        const router = useRouter()
        const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email')
    
    
        const validationSchema = Yup.object({
            name: Yup.string()
                .min(2, t('auth.name_required'))
                .required(t('auth.name_required')),
    
            email: Yup.string().when('registerMethod', {
                is: 'email',
                then: (schema) =>
                    schema
                        .email(t('auth.email_invalid'))
                        .required(t('auth.email_required')),
                otherwise: (schema) => schema.notRequired().nullable(),
            }),
    
            phone: Yup.string().when('registerMethod', {
                is: 'phone',
                then: (schema) =>
                    schema
                        .matches(/^[0-9]{10,15}$/, t('auth.phone_invalid'))
                        .required(t('auth.phone_required')),
                otherwise: (schema) => schema.notRequired().nullable(),
            }),
    
            password: Yup.string()
                .min(6, t('auth.password_min'))
                .required(t('auth.password_required')),
    
            role_id: Yup.number()
                .oneOf([3, 5], t('auth.role_required'))
                .required(t('auth.role_required')),
        })
    
    
        const formik = useFormik<RegisterFormValues>({
            initialValues: {
                name: '',
                email: '',
                phone: '',
                password: '',
                role_id: 3,
            },
            validationSchema,
            onSubmit: async (values) => {
                setIsLoading(true)
    
                try {
                    // Determine identifier based on active tab
                    const identifier = registerMethod === 'email' ? values.email : values.phone;
    
                    const result = await register(values.name, identifier, values.password, values.role_id,registerMethod)
                    if (result.success) {
    
                        Toast.show({
                            type: 'success',
                            text1: t('auth.registration_success'),
                            position: 'top',
                            visibilityTime: 3000,
                        });
    
                        if (values.role_id === 3) {
                            router.push('/(store)/create')
                        } else if (values.role_id === 5) {
                            // router.push('/(driver)/driver/create')
                        }
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: t('auth.registration_failed'),
                            position: 'top',
                            visibilityTime: 3000,
                        });
    
                    }
    
    
                } catch (error) {
                    Alert.alert('Error', 'Network error. Please try again.')
                } finally {
                    setIsLoading(false)
                }
            }
        })
    
        // Update formik validation when method changes
        useEffect(() => {
            formik.validateForm();
        }, [registerMethod]);
    
    
  return {t,router,formik,registerMethod,setRegisterMethod,isLoading}
}
