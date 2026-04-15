import { config } from '@/constants/config';
import { useAuth } from '@/hooks/auth/useAuth';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

export default function useCreateVehicle() {
    const { auth } = useAuth();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const router = useRouter();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const validationSchema = Yup.object().shape({
        plateNumber: Yup.string().required(t('validation.required')),
        type: Yup.string().required(t('validation.required')),
        model: Yup.string().required(t('validation.required')),
        capacity: Yup.number().required(t('validation.required')).positive(),
        color: Yup.string().required(t('validation.required')),
        license: Yup.string().required(t('validation.required')),
        insurance: Yup.string().required(t('validation.required')),
        insurance_date: Yup.date().required(t('validation.required')),
        image: Yup.string().required(t('validation.required')),
    });

    const formik = useFormik({
        initialValues: {
            plateNumber: '',
            type: '',
            model: '',
            capacity: '',
            color: '',
            license: '',
            insurance: '',
            insurance_date: new Date(),
            image: ''
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const token = auth?.token;

                const formData = new FormData();
                formData.append('plateNumber', values.plateNumber);
                formData.append('type', values.type);
                formData.append('model', values.model);
                formData.append('capacity', values.capacity.toString());
                formData.append('color', values.color);
                formData.append('license', values.license);
                formData.append('insurance', values.insurance);
                formData.append('insurance_date', values.insurance_date.toISOString());

                if (values.image) {
                    // Extract file extension and MIME type
                    const uriParts = values.image.split('.');
                    const fileExtension = uriParts[uriParts.length - 1];
                    const mimeType = fileExtension.toLowerCase() === 'jpg' ? 'jpeg' : fileExtension.toLowerCase();
                    
                    const imageFile = {
                        uri: values.image,
                        type: `image/${mimeType}`,
                        name: `vehicle_image.${fileExtension}`,
                    } as any;
                    
                    formData.append('image', imageFile);
                }

                const response = await axios.post(`${config.URL}/vehicles`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    Toast.show({
                        type: 'success',
                        text1: t('common.success') || 'Success',
                        text2: t('vehicle.createdSuccessfully') || 'Vehicle created successfully',
                    });
                    resetForm();
                    router.back();
                } else {
                    throw new Error('Failed to create vehicle');
                }
            } catch (error: any) {
                console.error(error?.response?.data);

                // Show raw error so we can debug exactly what the 400 Bad Request is
                const errorData = error?.response?.data;
                const errorMsg = errorData ? JSON.stringify(errorData) : error.message;

                Toast.show({
                    type: 'error',
                    text1: t('common.error') || 'Error',
                    text2: errorMsg.substring(0, 100), // Show part in toast
                });

                // Show full in alert
                import('react-native').then(({ Alert }) => {
                    Alert.alert('Validation Error', errorMsg);
                });
            }
        }
    });

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            formik.setFieldValue('insurance_date', selectedDate);
        }
    };

    return {
        formik,
        t,
        isArabic,
        showDatePicker,
        setShowDatePicker,
        handleDateChange
    };
}
