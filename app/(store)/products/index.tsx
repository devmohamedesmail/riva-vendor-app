import CategoryFilterBtn from "@/components/screens/products/category-filter-btn";
import NoProducts from "@/components/screens/products/no-products";
import ProductCard from "@/components/screens/products/product-card";
import ProductsSearch from "@/components/screens/products/products-search";
import Button from "@/components/ui/button";
import FloatButton from "@/components/ui/float-button";
import Header from "@/components/ui/header";
import Layout from "@/components/ui/layout";
import Skeleton from "@/components/ui/skeleton";
import useProducts from "@/hooks/products/useProducts";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";



export default function Products() {
  const { t,
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
    handleDelete } = useProducts();
  return (
    <Layout>
      <Header title={t("products.products")} />

      {/* Top Header Section with Search and Add User */}
      <View className="px-5 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-black dark:text-white">
            {t("products.products_count")} - {products?.length}
          </Text>

          <Button
            size="sm"
            icon={<Ionicons name="add" size={18} color="white" />}
            title={t("products.add_product")}
            onPress={() => router.push("/products/add")}
          />
        </View>

        {/* Search Input */}
        <ProductsSearch
          searchText={searchText}
          setSearchText={setSearchText}
          t={t}
        />
      </View>

      {/* Category Tabs */}
      {!isLoading && categoryTabs.length > 1 && (
        <View className="mb-2 mt-2">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            data={categoryTabs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item.id;
              return (
                <CategoryFilterBtn 
                    setSelectedCategory={setSelectedCategory} 
                    item={item} 
                    isSelected={isSelected} 
                />
              );
            }}
          />
        </View>
      )}

      {isLoading ? (
        <View className="mt-10 flex gap-4 px-3">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} height={100} />
          ))}
        </View>
      ) : null}

      {!isLoading && filteredProducts?.length === 0 ? <NoProducts /> : null}

      <View className="mb-10 pb-44">
        <FlatList

          key={"2-columns"}
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          refreshing={isLoading}
          onRefresh={onRefresh}
          renderItem={({ item: product }) => (
            <ProductCard
              product={product}
              categoriesData={categoriesData}
              handleDelete={handleDelete}
            />
          )}
        />
      </View>

      <FloatButton onPress={() => router.push("/products/add")} />
    </Layout>
  );
}
