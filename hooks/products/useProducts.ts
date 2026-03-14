import React,{useCallback} from 'react'
import { useTranslation } from 'react-i18next';
import { useAuth } from '../useAuth';
import { useStore } from '../useStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import useFetch from '../useFetch';
import { useMemo, useState } from 'react';
import ProductController from '@/controllers/products/controller';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

export default function useProducts() {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const router = useRouter();
  const { store } = useStore();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>("all");

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ["products", store.id],
    queryFn: () => ProductController.fetchProductsByStore(store.id, auth.token),
    enabled: !!store?.id && !!auth?.token,
  });



  const onRefresh = useCallback(() => { refetch() }, [refetch]);

  // Fetch categories for dropdown
  const { data: categoriesData } = useFetch(
    store?.id ? `/categories/store/${store?.id}` : ""
  );

  const categoriesList = useMemo(() => {
    return Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];
  }, [categoriesData]);

  const categoryTabs = useMemo(() => {
    return [
      { id: "all", name: t("products.all", "All"), count: products?.length || 0 },
      ...categoriesList.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        count: products?.filter((p: any) => p.category?.id === cat.id || p.category_id === cat.id).length || 0
      }))
    ];
  }, [categoriesList, products, t]);

  const filteredProducts = useMemo(() => {
    return (products || []).filter((product: any) => {
      const matchesSearch = product.name?.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory || product.category?.id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchText, selectedCategory]);  // 🔹 Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: number) =>
      ProductController.deleteProduct({
        productId,
        token: auth.token,
      }),

    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: t("products.product_deleted_successfully"),
      });
      queryClient.invalidateQueries({
        queryKey: ["products", store.id],
      });
    },

    onError: () => {
      Toast.show({
        type: "error",
        text1: t("products.failed_to_delete_product"),
      });
    },
  });

  const handleDelete = (productId: number) => {
    Alert.alert(
      t("products.delete_product"),
      t("products.delete_product_confirmation"),
      [
        { text: t("products.cancel"), style: "cancel" },
        {
          text: t("products.delete"),
          style: "destructive",
          onPress: () => deleteMutation.mutate(productId),
        },
      ]
    );
  };

  return {
     t,
     router,
     products,
     searchText,
     setSearchText,
     isLoading,
     categoryTabs,
     selectedCategory,
     setSelectedCategory,
     filteredProducts,
     onRefresh,
     categoriesData,
     handleDelete
  }
}
