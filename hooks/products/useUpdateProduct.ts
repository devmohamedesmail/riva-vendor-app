import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormik } from 'formik';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';



import ProductController from '@/controllers/products/controller';
import { useAuth } from '@/hooks/auth/useAuth';
import { useStore } from '@/hooks/store/useStore';
import useFetch from '@/hooks/common/useFetch';
import { Category } from '@/@types/category';



export default function useUpdateProduct() {
    const params = useLocalSearchParams();

    // Re-derive product whenever the params change (fixes "always shows last product" bug)
    const product = useMemo(
        () => (params.data ? JSON.parse(params.data as string) : null),
        [params.data]
    );

    const { t } = useTranslation();
    const { auth } = useAuth();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    // Initialize attribute state from product
    const [attributeValues, setAttributeValues] = useState<Array<{ attribute_id: string; value: string; price: string }>>(() => {
        if (product?.attributes && product.attributes.length > 0) {
            const firstAttr = product.attributes[0];
            return firstAttr.values?.map((v: any) => ({
                attribute_id: firstAttr.id.toString(),
                value: v.value,
                price: v.price?.toString() || "0"
            })) || [];
        }
        return [];
    });

    const [selectedAttributeId, setSelectedAttributeId] = useState<string>(() => {
        return product?.attributes?.[0]?.id?.toString() || "";
    });

    // ── Re-sync formik + local state when product changes ──────────────────────
    useEffect(() => {
        if (!product) return;
        formik.resetForm({
            values: {
                name: product.name || "",
                description: product.description || "",
                price: product.price?.toString() || "",
                sale_price: product.sale_price?.toString() || "",
                category_id: product.category_id?.toString() || "",
                image: product.image || "",
                attribute_value: "",
                attribute_price: "",
                is_simple: product.product_type ? product.product_type === "simple" : (!product.attributes || product.attributes.length === 0),
            },
        });
        if (product.attributes && product.attributes.length > 0) {
            const firstAttr = product.attributes[0];
            setSelectedAttributeId(firstAttr.id.toString());
            setAttributeValues(
                firstAttr.values?.map((v: any) => ({
                    attribute_id: firstAttr.id.toString(),
                    value: v.value,
                    price: v.price?.toString() || "0",
                })) || []
            );
        } else {
            setSelectedAttributeId("");
            setAttributeValues([]);
        }
    }, [product?.id]); // keyed on product.id — fires only when a different product is opened

    const router = useRouter();

    const { store } = useStore()
    const { data: attributesData } = useFetch('/attributes');





    const { data: categoriesData } = useFetch(
        store?.id ? `/categories/store/${store.id}` : ""
    );

    const categoryOptions =
        categoriesData?.data?.map((cat: Category) => ({
            label: cat.name,
            value: cat.id.toString(),
        })) || [];

    const queryClient = useQueryClient();

    // 🔹 Update mutation
    const updateMutation = useMutation({
        mutationFn: ({
            productID,
            formData,
        }: {
            productID: number;
            formData: FormData;
        }) =>
            ProductController.updateProduct({
                productID,
                formData,
                token: auth.token,
            }),

        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: t("products.product_updated_successfully"),
            })
            queryClient.invalidateQueries({
                queryKey: ["products", store?.id],
            });
            router.back();
        },

        onError: (error) => {
            Toast.show({
                type: "error",
                text1: t("products.failed_to_update_product"),
            })
        },
    });

    const formik = useFormik({
        initialValues: {
            name: product?.name || "",
            description: product?.description || "",
            price: product?.price?.toString() || "",
            sale_price: product?.sale_price?.toString() || "",
            category_id: product?.category_id?.toString() || "",
            image: product?.image || "",
            attribute_value: "",
            attribute_price: "",
            is_simple: product?.product_type ? product.product_type === "simple" : (!product?.attributes || product?.attributes?.length === 0),
        },
        validationSchema: Yup.object({
            name: Yup.string().required(t("products.name_required")),
            price: Yup.number()
                .transform((value, originalValue) =>
                    originalValue === "" ? undefined : value
                )
                .when("is_simple", ([isSimple], schema) =>
                    isSimple
                        ? schema
                            .required(t("products.price_required"))
                            .positive(t("products.price_positive"))
                        : schema.optional()
                ),
            sale_price: Yup.number()
                .nullable()
                .transform((value, originalValue) =>
                    originalValue === "" ? undefined : value
                )
                .positive(
                    t("products.price_positive", {
                        defaultValue: "Price must be positive",
                    })
                ),
            category_id: Yup.string().required(t("products.category_required")),
        }),
        onSubmit: async (values) => {
            try {
                if (!store?.id) return;

                // Create FormData for image upload
                const formData = new FormData();
                formData.append("store_id", store.id.toString());
                formData.append("name", values.name);
                if (values.description) {
                    formData.append("description", values.description);
                }

                if (values.is_simple) {
                    formData.append("price", values.price || "0");
                    if (values.sale_price) {
                        formData.append("sale_price", values.sale_price);
                    }
                }

                formData.append(
                    "product_type",
                    values.is_simple ? "simple" : "variable"
                );
                formData.append("category_id", values.category_id);

                // Add attributes and values
                if (!values.is_simple && selectedAttributeId && attributeValues.length > 0) {
                    // Send as array notation for FormData
                    formData.append("attributes[]", selectedAttributeId);

                    // Send each value as separate entries
                    attributeValues.forEach((av, index) => {
                        formData.append(`values[${index}][attribute_id]`, av.attribute_id);
                        formData.append(`values[${index}][value]`, av.value);
                        formData.append(`values[${index}][price]`, av.price);
                    });
                }

                // Add image file if exists
                if (values.image) {
                    const uriParts = values.image.split(".");
                    const fileType = uriParts[uriParts.length - 1];

                    formData.append("image", {
                        uri: values.image,
                        name: `product.${fileType}`,
                        type: `image/${fileType}`,
                    } as any);
                }
                updateMutation.mutate({
                    productID: product.id,
                    formData,
                });



            } catch (error) {
                Toast.show({
                    type: "error",
                    text1: t("products.failed_to_save_product"),
                });

            }
        },
    });
    return {
        formik,
        attributeValues,
        setAttributeValues,
        selectedAttributeId,
        setSelectedAttributeId,
        categoryOptions,
        attributesData,
        isDark,
        t,
        product,
        updateMutation
    }
}
