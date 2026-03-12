import BottomPaper from "@/components/ui/bottom-paper";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import CustomImagePicker from "@/components/ui/image-picker";
import Input from "@/components/ui/input";
import Layout from "@/components/ui/layout";
import Select from "@/components/ui/select";
import TextArea from "@/components/ui/textarea";
import CategoryController from "@/controllers/categories/contoller";
import ProductController from "@/controllers/products/controller";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import { useStore } from "@/hooks/useStore";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useColorScheme } from "nativewind";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

export default function AddProduct() {
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
      console.log("error add product", error);
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


      if (!values.is_simple && selectedAttributeId && attributeValues.length > 0) {
        formData.append("attributes[]", selectedAttributeId);
        attributeValues.forEach((av, index) => {
          formData.append(`values[${index}][attribute_id]`, av.attribute_id);
          formData.append(`values[${index}][value]`, av.value);
          formData.append(`values[${index}][price]`, av.price);
        });
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

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Layout>
            <Header title={t("products.add_product")} />

            <ScrollView className="px-4 py-4">
              <View className="pb-24">
                {/* Product Name */}
                <View className="mb-4">
                  <Input
                    label={t("products.product_name")}
                    placeholder={t("products.enter_product_name")}
                    value={formik.values.name}
                    onChangeText={formik.handleChange("name")}
                    error={
                      formik.touched.name && formik.errors.name
                        ? formik.errors.name
                        : ""
                    }
                  />
                </View>

                {/* Description */}
                <View className="mb-4">
                  <TextArea
                    label={t("products.product_description")}
                    placeholder={t("products.enter_product_description")}
                    value={formik.values.description}
                    onChangeText={formik.handleChange("description")}
                    error={
                      formik.touched.description && formik.errors.description
                        ? formik.errors.description
                        : ""
                    }
                  />
                </View>

                {/* ── Category Picker ──────────────────────────────────── */}
                <View className="mb-4">
                  <Text
                    className="text-sm font-semibold mb-2"
                    style={{ color: isDark ? "#ccc" : "#374151" }}
                  >
                    {t("products.category")}
                  </Text>

                  <TouchableOpacity
                    onPress={openCategorySheet}
                    className={`flex-row items-center justify-between px-4 py-3 rounded-xl border ${hasError("category_id")
                      ? "border-red-400"
                      : isDark
                        ? "border-gray-700"
                        : "border-gray-200"
                      }`}
                    style={{
                      backgroundColor: isDark ? "#1a1a1a" : "#fff",
                    }}
                  >
                    <View className="flex-row items-center gap-2 flex-1">
                      {selectedCategory?.image ? (
                        <Image
                          source={{ uri: selectedCategory.image }}
                          className="w-8 h-8 rounded-lg"
                        />
                      ) : (
                        <View
                          className="w-8 h-8 rounded-lg items-center justify-center"
                          style={{ backgroundColor: isDark ? "#333" : "#fff4f0" }}
                        >
                          <Ionicons name="grid-outline" size={16} color="#fd4a12" />
                        </View>
                      )}
                      <Text
                        className="text-sm flex-1"
                        style={{
                          color: selectedCategory
                            ? isDark ? "#fff" : "#111"
                            : isDark ? "#666" : "#aaa",
                        }}
                      >
                        {selectedCategory
                          ? selectedCategory.name
                          : t("products.select_category")}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={isDark ? "#666" : "#aaa"}
                    />
                  </TouchableOpacity>

                  {hasError("category_id") && (
                    <Text className="text-red-500 text-xs mt-1">
                      {formik.errors.category_id}
                    </Text>
                  )}
                </View>

                {/* Product Image */}
                <View className="mb-6">
                  <CustomImagePicker
                    label={t("products.product_image")}
                    value={formik.values.image}
                    onImageSelect={(uri: string) =>
                      formik.setFieldValue("image", uri)
                    }
                    placeholder={t("products.tap_to_select_image")}
                  />
                </View>

                {/* Simple / Variable toggle */}
                <View
                  className="mb-6 p-4 rounded-xl border"
                  style={{
                    backgroundColor: isDark ? "#1a1a1a" : "#fff",
                    borderColor: isDark ? "#2a2a2a" : "#e5e7eb",
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 pr-4">
                      <Text
                        className="text-base font-semibold mb-1"
                        style={{ color: isDark ? "#fff" : "#111827" }}
                      >
                        {t("products.simple_product")}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ color: isDark ? "#888" : "#6b7280" }}
                      >
                        {formik.values.is_simple
                          ? t("products.simple_product_description")
                          : t("products.variable_product_description")}
                      </Text>
                    </View>
                    <Switch
                      value={formik.values.is_simple}
                      onValueChange={(value) => {
                        formik.setFieldValue("is_simple", value);
                        if (!value) {
                          setSelectedAttributeId("");
                          setAttributeValues([]);
                          formik.setFieldValue("has_attributes", false);
                        }
                      }}
                      trackColor={{ false: "#3b82f6", true: "#10b981" }}
                      thumbColor="#ffffff"
                      ios_backgroundColor="#d1d5db"
                    />
                  </View>
                </View>

                {/* Price / Attributes */}
                {formik.values.is_simple ? (
                  <View className="mb-4">
                    <Input
                      label={t("products.price")}
                      placeholder={t("products.enter_price")}
                      value={formik.values.price}
                      onChangeText={formik.handleChange("price")}
                      keyboardType="numeric"
                      error={
                        formik.touched.price && formik.errors.price
                          ? formik.errors.price
                          : ""
                      }
                    />

                    <Input
                      label={t("products.sale_price")}
                      placeholder={t("products.enter_sale_price")}
                      value={formik.values.sale_price}
                      onChangeText={formik.handleChange("sale_price")}
                      keyboardType="numeric"
                      error={
                        formik.touched.sale_price && formik.errors.sale_price
                          ? formik.errors.sale_price
                          : ""
                      }
                    />
                  </View>
                ) : (
                  <>
                    <View className="mb-4">
                      <Select
                        label={t("products.attribute")}
                        placeholder={t("products.select_attribute")}
                        options={(attributesData?.attributes || []).map(
                          (attr: any) => ({
                            label: attr.name,
                            value: attr.id.toString(),
                          })
                        )}
                        value={selectedAttributeId}
                        onSelect={(value: string) => {
                          setSelectedAttributeId(value);
                          setAttributeValues([]);
                          formik.setFieldValue("has_attributes", true);
                        }}
                      />
                    </View>

                    {selectedAttributeId && (
                      <View className="mb-4">
                        <Text
                          className="text-sm font-medium mb-2"
                          style={{ color: isDark ? "#ccc" : "#374151" }}
                        >
                          {t("products.attribute_values")}
                        </Text>

                        {attributeValues.map((attrValue, index) => (
                          <View
                            key={index}
                            className="mb-3 p-3 rounded-lg border"
                            style={{
                              backgroundColor: isDark ? "#1a1a1a" : "#fff",
                              borderColor: isDark ? "#2a2a2a" : "#e5e7eb",
                            }}
                          >
                            <View className="flex-row justify-between items-center mb-2">
                              <Text
                                className="text-xs"
                                style={{ color: isDark ? "#888" : "#6b7280" }}
                              >
                                {t("products.value_item")} {index + 1}
                              </Text>
                              <Button
                                title={t("products.remove")}
                                onPress={() =>
                                  setAttributeValues((v) =>
                                    v.filter((_, i) => i !== index)
                                  )
                                }
                                className="bg-red-500 py-1 px-3"
                              />
                            </View>
                            <View className="mb-2">
                              <Input
                                label={t("products.value")}
                                placeholder={t("products.enter_value")}
                                value={attrValue.value}
                                onChangeText={(text) => {
                                  const newValues = [...attributeValues];
                                  newValues[index].value = text;
                                  setAttributeValues(newValues);
                                }}
                              />
                            </View>
                            <Input
                              label={t("products.extra_price")}
                              placeholder={t("products.enter_extra_price")}
                              value={attrValue.price}
                              onChangeText={(text) => {
                                const newValues = [...attributeValues];
                                newValues[index].price = text;
                                setAttributeValues(newValues);
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                        ))}

                        <View
                          className="mb-3 p-3 rounded-lg"
                          style={{ backgroundColor: isDark ? "#111" : "#f9fafb" }}
                        >
                          <View className="mb-2">
                            <Input
                              label={t("products.value")}
                              placeholder={t("products.enter_value")}
                              value={formik.values.attribute_value}
                              onChangeText={formik.handleChange("attribute_value")}
                            />
                          </View>
                          <View className="mb-3">
                            <Input
                              label={t("products.price")}
                              placeholder={t("products.price")}
                              value={formik.values.attribute_price}
                              onChangeText={formik.handleChange("attribute_price")}
                              keyboardType="numeric"
                            />
                          </View>
                          <Button
                            title={t("products.add_value")}
                            onPress={() => {
                              if (
                                formik.values.attribute_value &&
                                formik.values.attribute_price
                              ) {
                                setAttributeValues([
                                  ...attributeValues,
                                  {
                                    attribute_id: selectedAttributeId,
                                    value: formik.values.attribute_value,
                                    price: formik.values.attribute_price,
                                  },
                                ]);
                                formik.setFieldValue("attribute_value", "");
                                formik.setFieldValue("attribute_price", "");
                              } else {
                                Toast.show({
                                  type: "error",
                                  text1: t("products.fill_all_fields"),
                                });
                              }
                            }}
                            className="bg-blue-500"
                          />
                        </View>
                      </View>
                    )}
                  </>
                )}

                {/* Submit */}

                <Button
                  size="lg"
                  title={
                    createMutation.isPending
                      ? t("products.saving")
                      : t("products.save")
                  }
                  onPress={formik.handleSubmit}
                  disabled={createMutation.isPending}
                />
              </View>
            </ScrollView>
          </Layout>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* ── Category Bottom Sheet ─────────────────────────────────────────── */}
      <BottomPaper ref={categorySheetRef} snapPoints={["60%"]}>
        <View className="flex-1 px-4 pt-2">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-3">
            <Text
              className="text-lg font-bold"
              style={{ color: isDark ? "#fff" : "#111" }}
            >
              {t("products.select_category")}
            </Text>
            <TouchableOpacity
              onPress={() => categorySheetRef.current?.close()}
            >
              <AntDesign name="close" size={22} color={isDark ? "#ccc" : "#555"} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            className="flex-row items-center rounded-xl px-3 py-2 mb-3"
            style={{ backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }}
          >
            <Ionicons
              name="search"
              size={18}
              color="#fd4a12"
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={categorySearch}
              onChangeText={setCategorySearch}
              placeholder="Search..."
              placeholderTextColor={isDark ? "#666" : "#aaa"}
              className="flex-1 text-sm"
              style={{ color: isDark ? "#fff" : "#111" }}
            />
            {categorySearch.length > 0 && (
              <TouchableOpacity onPress={() => setCategorySearch("")}>
                <AntDesign name="close" size={16} color="#aaa" />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          {isLoadingCategories ? (
            <ActivityIndicator color="#fd4a12" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filteredCategories}
              keyExtractor={(item) => item.id.toString()}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 16 }}
              ListEmptyComponent={
                <Text
                  className="text-center text-sm mt-6"
                  style={{ color: isDark ? "#666" : "#aaa" }}
                >
                  No categories found. Assign categories to your store first.
                </Text>
              }
              renderItem={({ item }) => {
                const isSelected = selectedCategory?.id === item.id;
                return (
                  <TouchableOpacity
                    onPress={() => handleSelectCategory(item)}
                    className="flex-row items-center p-3 rounded-xl mb-2 border"
                    style={{
                      backgroundColor: isSelected
                        ? isDark
                          ? "#2a1a15"
                          : "#fff4f0"
                        : isDark
                          ? "#111"
                          : "#fff",
                      borderColor: isSelected
                        ? "#fd4a12"
                        : isDark
                          ? "#222"
                          : "#eee",
                      borderWidth: 1.5,
                    }}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        className="w-12 h-12 rounded-xl mr-3"
                        style={{ resizeMode: "cover" }}
                      />
                    ) : (
                      <View
                        className="w-12 h-12 rounded-xl mr-3 items-center justify-center"
                        style={{ backgroundColor: isDark ? "#333" : "#f0f0f0" }}
                      >
                        <Ionicons name="grid-outline" size={20} color="#fd4a12" />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: isDark ? "#fff" : "#111" }}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      {item.description ? (
                        <Text
                          className="text-xs mt-0.5"
                          style={{ color: isDark ? "#888" : "#aaa" }}
                          numberOfLines={1}
                        >
                          {item.description}
                        </Text>
                      ) : null}
                    </View>
                    {isSelected && (
                      <View className="w-6 h-6 rounded-full items-center justify-center bg-primary">
                        <AntDesign name="check" size={13} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </BottomPaper>
    </>
  );
}
