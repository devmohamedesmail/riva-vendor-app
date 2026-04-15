import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth/useAuth';
import { useStore } from '@/hooks/store/useStore';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useColorScheme } from "nativewind";
import useFetch from '@/hooks/common/useFetch';
import { Category } from '@/@types/category';
import CategoryController from '@/controllers/categories/contoller';
import ProductController from '@/controllers/products/controller';
import Toast from 'react-native-toast-message';
import * as Yup from "yup";

export default function useAddProduct() {
    const { t } = useTranslation();
    const { auth } = useAuth();
    const { store } = useStore();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";
    const queryClient = useQueryClient();

    const { data: attributesData } = useFetch("/attributes");
    const [attributeValues, setAttributeValues] = useState<Array<{ attribute_id: string; value: string; price: string }>>([]);
    const [selectedAttributeId, setSelectedAttributeId] = useState<string>("");

    // ── Category sheet state ────────────────────────────────────────────────────
    const categorySheetRef = useRef<BottomSheet>(null);
    const [categorySearch, setCategorySearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // ── Fetch store's assigned categories ──────────────────────────────────────
    const { data: assignedCategories = [], isLoading: isLoadingCategories } =
        useQuery<Category[]>({
            queryKey: ["store-categories", store?.id],
            queryFn: () =>
                CategoryController.fetchAssignedCategories(store.id, auth.token),
            enabled: !!store?.id && !!auth?.token,
        });

    const filteredCategories = useMemo(
        () =>
            assignedCategories.filter((c) =>
                c.name.toLowerCase().includes(categorySearch.toLowerCase())
            ),
        [assignedCategories, categorySearch]
    );

    // ─── Create mutation ────────────────────────────────────────────────────────
    const createMutation = useMutation({
        mutationFn: (formData: FormData) =>
            ProductController.createProduct({ formData, token: auth.token }),
        onSuccess: () => {
            Toast.show({ type: "success", text1: t("products.product_added_successfully") });
            queryClient.invalidateQueries({ queryKey: ["products", store.id] });
            formik.resetForm();
            formik.setFieldValue("image", "");
            setSelectedCategory(null);
            setSelectedAttributeId("");
            setAttributeValues([]);
        },
        onError: (error) => {
            Toast.show({ type: "error", text1: t("products.failed_to_save_product") });
        },
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            price: "",
            sale_price: "",
            category_id: "",
            image: "",
            attribute_value: "",
            attribute_price: "",
            has_attributes: false,
            is_simple: true,
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
            category_id: Yup.string().required(t("products.category_required")),
        }),
        onSubmit: async (values) => {
            if (!store?.id) return;

            const formData = new FormData();
            formData.append("store_id", store.id.toString());
            formData.append("name", values.name);
            if (values.description) {
                formData.append("description", values.description);
            }
            if (values.is_simple) {
                formData.append("price", values.price || "0");
                if (values.sale_price) formData.append("sale_price", values.sale_price);
            }
            formData.append("category_id", values.category_id);
            formData.append(
                "product_type",
                values.is_simple ? "simple" : "variable"
            );

            if (selectedAttributeId && attributeValues.length > 0) {
                formData.append("attributes[]", selectedAttributeId);
                attributeValues.forEach((av, index) => {
                    formData.append(`values[${index}][attribute_id]`, av.attribute_id);
                    formData.append(`values[${index}][value]`, av.value);
                    formData.append(`values[${index}][price]`, av.price);
                });
            }

            if (values.image) {
                const uriParts = values.image.split(".");
                const fileType = uriParts[uriParts.length - 1];
                formData.append("image", {
                    uri: values.image,
                    name: `product.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }
            createMutation.mutate(formData);
        },
    });

    useEffect(() => {
        formik.setFieldValue("has_attributes", attributeValues.length > 0);
    }, [attributeValues]);

    // ─── Pick category ──────────────────────────────────────────────────────────
    const openCategorySheet = () => {
        setCategorySearch("");
        categorySheetRef.current?.expand();
    };

    const handleSelectCategory = (category: Category) => {
        setSelectedCategory(category);
        formik.setFieldValue("category_id", category.id.toString());
        categorySheetRef.current?.close();
    };

    const hasError = (field: string) =>
        !!(formik.touched[field as keyof typeof formik.touched] &&
            formik.errors[field as keyof typeof formik.errors]);


    return {
        t,
        isDark,
        formik,
        createMutation,
        openCategorySheet,
        handleSelectCategory,
        hasError,
        isLoadingCategories,
        assignedCategories,
        filteredCategories,
        categorySheetRef,
        categorySearch,
        setCategorySearch,
        selectedCategory,
        setSelectedCategory,
        attributeValues,
        setAttributeValues,
        selectedAttributeId,
        setSelectedAttributeId,
        attributesData
    }
}
