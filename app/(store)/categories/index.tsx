import AssignedCategoryCard from "@/components/screens/categories/assigned-category-card";
import CategoryEmptyState from "@/components/screens/categories/empty-state";
import BottomPaper from "@/components/ui/bottom-paper";
import FloatButton from "@/components/ui/float-button";
import Header from "@/components/ui/header";
import Layout from "@/components/ui/layout";
import Loading from "@/components/ui/loading";
import CategoryController from "@/controllers/categories/contoller";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/hooks/useStore";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useColorScheme } from "nativewind";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type Category = {
  id: number;
  name: string;
  description?: string;
  image?: string;
};

export default function Categories() {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { store } = useStore();
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // ── 1. Fetch store's currently assigned categories ──────────────────────────
  const {
    data: assignedCategories = [],
    isLoading: isLoadingAssigned,
    refetch: refetchAssigned,
  } = useQuery<Category[]>({
    queryKey: ["store-categories", store?.id],
    queryFn: () => CategoryController.fetchAssignedCategories(store.id, auth.token),
    enabled: !!store?.id && !!auth?.token,
  });

  // ── 2. Fetch all categories for this store type ─────────────────────────────
  const { data: allCategories = [], isLoading: isLoadingAll } = useQuery<Category[]>({
    queryKey: ["categories-by-type", store?.store_type_id],
    queryFn: () => CategoryController.fetchCategoriesByStoreType(store.store_type_id, auth.token),
    enabled: !!store?.store_type_id && !!auth?.token,
  });

  // ── 3. Assign mutation ──────────────────────────────────────────────────────
  const assignMutation = useMutation({
    mutationFn: (ids: number[]) =>
      CategoryController.assignCategoriesToStore(store.id, ids, auth.token),
    onSuccess: () => {
      Toast.show({ type: "success", text1: t("categories.categories_saved") });
      queryClient.invalidateQueries({ queryKey: ["store-categories", store?.id] });
      bottomSheetRef.current?.close();
    },
    onError: () => {
      Toast.show({ type: "error", text1: t("categories.failed_to_save_categories") });
    },
  });

  // ── Filtered categories ────────────────────────────────────────────────────
  const filteredCategories = useMemo(
    () => allCategories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [allCategories, search]
  );

  // ── Sheet helpers ──────────────────────────────────────────────────────────
  const openSheet = () => {
    setSearch("");
    setSelectedIds(assignedCategories.map((c) => c.id));
    bottomSheetRef.current?.expand();
  };

  const toggleSelect = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetchAssigned();
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <Layout>
        <Header title={t("categories.categories")} />

        {/* Count badge */}
        <View className="flex-row items-center px-4 py-2">
          <View className="flex-row items-baseline gap-1.5 px-4 py-2 rounded-xl bg-orange-50 dark:bg-gray-900 shadow-sm">
            <Text className="text-2xl font-bold text-primary">
              {assignedCategories.length}
            </Text>
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {t("categories.categories")}
            </Text>
          </View>
        </View>

        {/* Assigned categories grid */}
        {isLoadingAssigned ? (
          <Loading />
        ) : (
          <FlatList
            data={assignedCategories}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
            renderItem={({ item }) => <AssignedCategoryCard category={item} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#fd4a12"]}
              />
            }
            ListEmptyComponent={<CategoryEmptyState onPress={openSheet} />}
          />
        )}

        <FloatButton onPress={openSheet} />
      </Layout>

      {/* ── Bottom Sheet: pick categories ──────────────────────────────────── */}
      <BottomPaper ref={bottomSheetRef} snapPoints={["70%"]}>
        <View className="flex-1 px-4 pt-2">

          {/* Header */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {t("categories.assign_categories")}
            </Text>
            <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
              <AntDesign name="close" size={22} color={isDark ? "#ccc" : "#555"} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="flex-row items-center rounded-xl px-3 py-2.5 mb-2 bg-gray-100 dark:bg-gray-800">
            <Ionicons name="search" size={18} color="#fd4a12" style={{ marginRight: 8 }} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t("categories.search_categories")}
              placeholderTextColor={isDark ? "#666" : "#aaa"}
              className="flex-1 text-sm text-gray-900 dark:text-white"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <AntDesign name="close" size={16} color="#aaa" />
              </TouchableOpacity>
            )}
          </View>

          {/* Selection count */}
          {selectedIds.length > 0 && (
            <Text className="text-xs font-semibold text-primary mb-1.5 ml-1">
              {selectedIds.length} {t("categories.selected")}
            </Text>
          )}

          {/* List */}
          {isLoadingAll ? (
            <ActivityIndicator color="#fd4a12" style={{ marginTop: 20 }} />
          ) : (
            <BottomSheetFlatList
              data={filteredCategories}
              keyExtractor={(item: Category) => item.id.toString()}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text className="text-center text-sm text-gray-400 mt-6">
                  {t("categories.no_categories_found")}
                </Text>
              }
              renderItem={({ item }: { item: Category }) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <TouchableOpacity
                    onPress={() => toggleSelect(item.id)}
                    className="flex-row items-center p-2.5 rounded-xl mb-2 gap-2.5 border"
                    style={{
                      backgroundColor: isSelected
                        ? isDark ? "#2a1a15" : "#fff4f0"
                        : isDark ? "#111" : "#fff",
                      borderColor: isSelected ? "#fd4a12" : isDark ? "#222" : "#eee",
                      borderWidth: 1.5,
                    }}
                  >
                    {/* Thumbnail */}
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        className="w-12 h-12 rounded-xl"
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center"
                        style={{ backgroundColor: isDark ? "#333" : "#f0f0f0" }}
                      >
                        <Ionicons name="grid-outline" size={20} color="#fd4a12" />
                      </View>
                    )}

                    {/* Info */}
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

                    {/* Checkbox */}
                    <View
                      className="w-6 h-6 rounded-md border-2 items-center justify-center"
                      style={{
                        backgroundColor: isSelected ? "#fd4a12" : "transparent",
                        borderColor: isSelected ? "#fd4a12" : isDark ? "#444" : "#ccc",
                      }}
                    >
                      {isSelected && <AntDesign name="check" size={14} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {/* Save */}
          <TouchableOpacity
            onPress={() => assignMutation.mutate(selectedIds)}
            disabled={assignMutation.isPending}
            className="bg-primary rounded-xl py-3.5 items-center mt-2 mb-20 "
            style={assignMutation.isPending ? { opacity: 0.7 } : undefined}
          >
            {assignMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">
                {t("categories.save")} ({selectedIds.length})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </BottomPaper>
    </>
  );
}
