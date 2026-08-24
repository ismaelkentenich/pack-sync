import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import {
  PackageSearch,
  SearchX,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Routes } from "@app/config/routes";
import { Input } from "@components/primitives/Input";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { PackageCard } from "@features/packages/components/PackageCard";
import { UpdateStatusModal } from "@features/packages/components/UpdateStatusModal";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { translatePackageStatus } from "@features/packages/utils/packageTranslations";
import { usePackagesNavigation } from "@hooks/usePackagesNavigation";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";
import { styles } from "./styles";
import type { Package } from "@features/packages/domain/package.types";
import type { ListRenderItemInfo } from "@shopify/flash-list";

type StatusFilterOption = {
  value: string;
  label: string;
};

export default function PackagesListScreen() {
  const { t } = useTranslation();

  const navigation =
    usePackagesNavigation<typeof Routes.PackagesList>();

  const userId = useAuthStore((state) => state.user?.id);

  const packages = usePackageStore(
    (state) => state.packages,
  );

  const searchTerm = usePackageStore(
    (state) => state.searchTerm,
  );

  const statusFilter = usePackageStore(
    (state) => state.statusFilter,
  );

  const setSearchTerm = usePackageStore(
    (state) => state.setSearchTerm,
  );

  const setStatusFilter = usePackageStore(
    (state) => state.setStatusFilter,
  );

  const loadPackages = usePackageStore(
    (state) => state.loadPackages,
  );

  const updateStatusModalRef =
    useRef<BottomSheetModal>(null);

  const [refreshing, setRefreshing] = useState(false);

  const [selectedPackage, setSelectedPackage] =
    useState<Package | null>(null);

  const filteredData = useMemo(() => {
    const normalizedSearchTerm = searchTerm
      .trim()
      .toLowerCase();

    return packages.filter((pkg) => {
      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        pkg.code
          .toLowerCase()
          .includes(normalizedSearchTerm);

      const matchesStatus =
        statusFilter === "" ||
        statusFilter === "all" ||
        pkg.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [packages, searchTerm, statusFilter]);

  const isAllStatus =
    statusFilter === "" || statusFilter === "all";
  const hasSearch = searchTerm.trim().length > 0;
  const hasStatusFilter = !isAllStatus;
  const hasFilters = hasSearch || hasStatusFilter;

  const statusOptions = useMemo<StatusFilterOption[]>(
    () => [
      {
        value: "",
        label: t("packages.list.all"),
      },

      ...Object.values(PackageStatus).map((status) => ({
        value: status,
        label: translatePackageStatus(status, t),
      })),
    ],
    [t],
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    loadPackages(userId);
  }, [loadPackages, userId]);

  const handleRefresh = useCallback(async () => {
    if (!userId) {
      return;
    }

    setRefreshing(true);

    try {
      await loadPackages(userId);
    } finally {
      setRefreshing(false);
    }
  }, [loadPackages, userId]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("");
  }, [setSearchTerm, setStatusFilter]);

  const handleOpenDetails = useCallback(
    (pkg: Package) => {
      navigation.navigate(Routes.PackageDetails, {
        pkg,
      });
    },
    [navigation],
  );

  const handleOpenUpdateModal = useCallback(
    (pkg: Package) => {
      setSelectedPackage(pkg);

      requestAnimationFrame(() => {
        updateStatusModalRef.current?.present();
      });
    },
    [],
  );

  const handleCloseUpdateModal = useCallback(() => {
    updateStatusModalRef.current?.close();
  }, []);

  const renderFilterChip = useCallback(
    (option: StatusFilterOption) => {
      const isActive =
        option.value === ""
          ? isAllStatus
          : statusFilter === option.value;

      return (
        <TouchableOpacity
          key={option.value || "all"}
          testID={`packagesListFilter-${
            option.value || "all"
          }`}
          accessibilityRole="button"
          accessibilityState={{
            selected: isActive,
          }}
          activeOpacity={0.72}
          onPress={() => setStatusFilter(option.value)}
          style={[
            styles.filterChip,
            isActive && styles.filterChipActive,
          ]}
        >
          <Text
            testID={`packagesListFilterText-${
              option.value || "all"
            }`}
            style={[
              styles.filterChipText,
              isActive && styles.filterChipTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [isAllStatus, setStatusFilter, statusFilter],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Package>) => (
      <View
        testID={`packagesListItem-${item.id ?? item.code}`}
        style={styles.cardWrapper}
      >
        <PackageCard
          item={item}
          showButtons={false}
          onPress={() => handleOpenDetails(item)}
          onPressUpdate={() => handleOpenUpdateModal(item)}
        />
      </View>
    ),
    [handleOpenDetails, handleOpenUpdateModal],
  );

  const keyExtractor = useCallback(
    (item: Package) => String(item.id ?? item.code),
    [],
  );

  const listHeader = useMemo(
    () => (
      <View
        testID="packagesListHeader"
        style={styles.listHeader}
      >
        <View
          testID="packagesListIntroduction"
          style={styles.introduction}
        >
          <Text
            testID="packagesListDescription"
            style={styles.description}
          >
            {t("packages.list.description")}
          </Text>
        </View>

        <View
          testID="packagesListControls"
          style={styles.controls}
        >
          <View style={styles.searchWrapper}>
            <Input
              testID="packagesListSearchInput"
              placeholder={t(
                "packages.list.searchPlaceholder",
              )}
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
          </View>

          <View
            testID="packagesListFiltersSection"
            style={styles.filtersSection}
          >
            <View style={styles.filtersHeader}>
              <Text
                testID="packagesListFiltersLabel"
                style={styles.filtersLabel}
              >
                {t("packages.list.filterByStatus")}
              </Text>

              {hasFilters ? (
                <TouchableOpacity
                  testID="packagesListClearFiltersButton"
                  accessibilityRole="button"
                  activeOpacity={0.7}
                  onPress={handleClearFilters}
                  style={styles.clearFiltersButton}
                >
                  <Text
                    testID="packagesListClearFiltersText"
                    style={styles.clearFiltersText}
                  >
                    {t("packages.list.clearFilters")}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView
              testID="packagesListFiltersScroll"
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContent}
            >
              {statusOptions.map(renderFilterChip)}
            </ScrollView>
          </View>
        </View>

        <View
          testID="packagesListResultsSummary"
          style={styles.resultsSummary}
        >
          <Text
            testID="packagesListResultsTitle"
            style={styles.resultsTitle}
          >
            {t("packages.list.results")}
          </Text>

          <Text
            testID="packagesListResultsCount"
            style={styles.resultsCount}
          >
            {t("packages.list.packageCount", {
              count: filteredData.length,
            })}
          </Text>
        </View>
      </View>
    ),
    [
      filteredData.length,
      handleClearFilters,
      hasFilters,
      renderFilterChip,
      searchTerm,
      setSearchTerm,
      statusOptions,
      t,
    ],
  );

  const emptyState = useMemo(() => {
    if (packages.length === 0) {
      return (
        <View
          testID="packagesListEmptyState"
          style={styles.emptyState}
        >
          <View
            testID="packagesListEmptyIconContainer"
            style={styles.emptyIconContainer}
          >
            <PackageSearch
              testID="packagesListEmptyIcon"
              size={moderateScale(Theme.sizing.icon.lg)}
              color={Theme.colors.primary[600]}
            />
          </View>

          <Text
            testID="packagesListEmptyTitle"
            style={styles.emptyTitle}
          >
            {t("packages.list.emptyTitle")}
          </Text>

          <Text
            testID="packagesListEmptyDescription"
            style={styles.emptyDescription}
          >
            {t("packages.list.emptyDescription")}
          </Text>
        </View>
      );
    }

    return (
      <View
        testID="packagesListNoResultsState"
        style={styles.emptyState}
      >
        <View
          testID="packagesListNoResultsIconContainer"
          style={styles.emptyIconContainer}
        >
          <SearchX
            testID="packagesListNoResultsIcon"
            size={moderateScale(Theme.sizing.icon.lg)}
            color={Theme.colors.primary[600]}
          />
        </View>

        <Text
          testID="packagesListNoResultsTitle"
          style={styles.emptyTitle}
        >
          {t("packages.list.noResultsTitle")}
        </Text>

        <Text
          testID="packagesListNoResultsDescription"
          style={styles.emptyDescription}
        >
          {t("packages.list.noResultsDescription")}
        </Text>

        {hasFilters ? (
          <TouchableOpacity
            testID="packagesListNoResultsClearButton"
            accessibilityRole="button"
            activeOpacity={0.72}
            onPress={handleClearFilters}
            style={styles.emptyClearButton}
          >
            <Text
              testID="packagesListNoResultsClearText"
              style={styles.emptyClearButtonText}
            >
              {t("packages.list.clearFilters")}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }, [handleClearFilters, hasFilters, packages.length, t]);

  return (
    <ScreenContainer
      testID="packagesListScreen"
      headerTitle={t("packages.list.headline")}
      showBackButton={false}
      headerVariant="neutral"
      backgroundColorVariant="neutral100"
      safeAreaEdges={["bottom"]}
    >
      <FlashList
        testID="packagesListFlashList"
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={emptyState}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Theme.colors.primary[500]]}
            tintColor={Theme.colors.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {selectedPackage && userId ? (
        <UpdateStatusModal
          ref={updateStatusModalRef}
          handleCloseModal={handleCloseUpdateModal}
          packageData={selectedPackage}
          userId={userId}
        />
      ) : null}
    </ScreenContainer>
  );
}
