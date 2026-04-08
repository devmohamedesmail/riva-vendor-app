import { useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'expo-router'
import { AuthContext } from '@/context/auth-provider'
import Toast from 'react-native-toast-message'
import { Alert } from 'react-native'




export default function useLogin() {
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const { login } = useContext(AuthContext)
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')


    const validationSchema = Yup.object({
        email: Yup.string().when('loginMethod', {
            is: 'email',
            then: (schema) =>
                schema
                    .email(t('auth.email_invalid'))
                    .required(t('auth.email_required')),
            otherwise: (schema) => schema.notRequired().nullable(),
        }),

        phone: Yup.string().when('loginMethod', {
            is: 'phone',
            then: (schema) =>
                schema
                    .matches(/^[0-9]{10,15}$/, t('auth.phone_invalid'))
                    .required(t('auth.phone_required')),
            otherwise: (schema) => schema.notRequired().nullable(),
        }),
        password: Yup.string()
            .required(t('auth.password_required'))
            .min(6, t('auth.password_min')),
    })


    const formik = useFormik({
        initialValues: {
            email: '',
            phone: '',
            password: '',
        },
        validationSchema,

        onSubmit: async (values) => {
            setIsLoading(true)
            try {
                const identifier = loginMethod === 'email' ? values.email : values.phone;
                const result = await login(identifier, values.password, loginMethod)
                Toast.show({
                    text1: t('auth.login_success'),
                    text2: t('auth.welcomeBack'),
                    type: 'success',
                    position: 'top',
                    topOffset: 50,
                    visibilityTime: 1000,
                    onHide: () => {
                        const role = result.data.user.role.role;

                        switch (role) {
                            case 'admin':
                                router.replace('/(admin)')
                                break;
                            case 'store_owner':
                                router.replace('/(store)')
                                break;

                            case 'delivery':
                                router.replace('/(delivery)')
                                break;
                            default:
                                router.replace('/')
                                break;
                        }
                    }
                })





                // const role = result.data.user.role.role;

                // switch (role) {
                //     case 'admin':
                //         router.replace('/(admin)')
                //         break;
                //     case 'store_owner':
                //         router.replace('/(store)')
                //         break;

                //     case 'delivery':
                //         router.replace('/(delivery)')
                //         break;
                //     default:
                //         router.replace('/')
                //         break;
                // }


                setIsLoading(false)
            } catch (error: any) {
                setIsLoading(false)
                Toast.show({
                    text1: t('auth.login_failed'),
                    text2: t('auth.checkCredentials'),
                    type: 'error',
                })
            } finally {
                setIsLoading(false)
            }
        },
    })

    // Update formik validation when method changes
    useEffect(() => {
        formik.validateForm();
    }, [loginMethod]);

    return {
        t,
        i18n,
        router,
        formik,
        isLoading,
        rememberMe,
        setRememberMe,
        loginMethod,
        setLoginMethod
    }
}
