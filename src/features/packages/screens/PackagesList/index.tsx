import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import {
  CloudUpload,
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
import { Button } from "@components/primitives/Button";
import { Input } from "@components/primitives/Input";
import { ScreenContainer } from "@components/primitives/ScreenContainer";
import { Routes } from "@config/routes";
import { useAuthStore } from "@features/auth/store/useAuthStore";
import { PackageCard } from "@features/packages/components/PackageCard";
import { UpdateStatusModal } from "@features/packages/components/UpdateStatusModal";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { usePackageOperations } from "@features/packages/hooks/usePackageOperations";
import {
  selectFilteredPackages,
  selectIsSyncingPending,
  selectPackages,
  selectPendingCount,
} from "@features/packages/store/package.selectors";
import { usePackageStore } from "@features/packages/store/usePackageStore";
import { translatePackageStatus } from "@features/packages/utils/packageTranslations";
import { usePackagesNavigation } from "@hooks/usePackagesNavigation";
import { moderateScale } from "@theme/responsiveScale";
import Theme from "@theme/theme";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import type { Package } from "@features/packages/domain/package.types";
import type { ListRenderItemInfo } from "@shopify/flash-list";

type StatusFilterOption = {
  value: string;
  label: string;
};

export default function PackagesListScreen() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  const navigation = usePackagesNavigation();

  const userId = useAuthStore((state) => state.user?.id);

  const { loadPackages, syncPendingPackages } =
    usePackageOperations();

  const packages = usePackageStore(selectPackages);

  const pendingCount = usePackageStore(selectPendingCount);

  const isSyncingPending = usePackageStore(
    selectIsSyncingPending,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const updateStatusModalRef =
    useRef<BottomSheetModal>(null);

  const [refreshing, setRefreshing] = useState(false);

  const [selectedPackage, setSelectedPackage] =
    useState<Package | null>(null);

  const filteredData = useMemo(
    () =>
      selectFilteredPackages(
        packages,
        searchTerm,
        statusFilter,
      ),
    [packages, searchTerm, statusFilter],
  );

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

  const handleSyncPending = useCallback(async () => {
    if (!userId || isSyncingPending) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await syncPendingPackages(userId);
    } catch (error) {
      console.error(
        "[PackagesList] syncPending error",
        error,
      );
    }
  }, [isSyncingPending, syncPendingPackages, userId]);

  const handleRefresh = useCallback(async () => {
    if (!userId) {
      return;
    }

    setRefreshing(true);

    try {
      if (pendingCount > 0) {
        await syncPendingPackages(userId);
      }
      loadPackages(userId);
    } finally {
      setRefreshing(false);
    }
  }, [
    loadPackages,
    pendingCount,
    syncPendingPackages,
    userId,
  ]);

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
            {
              backgroundColor: theme.colors.surface.default,
              borderColor: theme.colors.border.subtle,
            },
            isActive && [
              styles.filterChipActive,
              {
                backgroundColor:
                  theme.colors.action.brand.background,
                borderColor:
                  theme.colors.action.brand.background,
              },
            ],
          ]}
        >
          <Text
            testID={`packagesListFilterText-${
              option.value || "all"
            }`}
            style={[
              styles.filterChipText,
              { color: theme.colors.text.secondary },
              isActive && [
                styles.filterChipTextActive,
                {
                  color:
                    theme.colors.action.brand.foreground,
                },
              ],
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [isAllStatus, setStatusFilter, statusFilter, theme],
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
            style={[
              styles.description,
              { color: theme.colors.text.secondary },
            ]}
          >
            {t("packages.list.description")}
          </Text>
        </View>

        {pendingCount > 0 ? (
          <View
            testID="packagesListSyncBanner"
            style={[
              styles.syncBanner,
              {
                backgroundColor:
                  theme.colors.surface.accentSubtle,
                borderColor: theme.colors.border.brand,
              },
            ]}
          >
            <View style={styles.syncBannerHeader}>
              <View
                style={[
                  styles.syncBannerIconContainer,
                  {
                    backgroundColor:
                      theme.colors.surface.accent,
                  },
                ]}
              >
                <CloudUpload
                  size={moderateScale(22)}
                  color={
                    theme.colors.action.brand.foreground
                  }
                />
              </View>

              <View style={styles.syncBannerTextContainer}>
                <Text
                  testID="packagesListSyncBannerTitle"
                  style={[
                    styles.syncBannerTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {t("packages.list.syncBannerTitle", {
                    count: pendingCount,
                  })}
                </Text>

                <Text
                  testID="packagesListSyncBannerDescription"
                  style={[
                    styles.syncBannerDescription,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {t("packages.list.syncBannerDescription")}
                </Text>
              </View>
            </View>

            <Button
              testID="packagesListSyncButton"
              title={
                isSyncingPending
                  ? t("packages.list.syncing")
                  : t("packages.list.syncButton")
              }
              variant="brand"
              size="sm"
              loading={isSyncingPending}
              disabled={isSyncingPending}
              onPress={handleSyncPending}
            />
          </View>
        ) : null}

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
              label={t("packages.list.searchPlaceholder")}
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
                style={[
                  styles.filtersLabel,
                  { color: theme.colors.text.secondary },
                ]}
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
                    style={[
                      styles.clearFiltersText,
                      { color: theme.colors.text.brand },
                    ]}
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
            style={[
              styles.resultsTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {t("packages.list.results")}
          </Text>

          <Text
            testID="packagesListResultsCount"
            style={[
              styles.resultsCount,
              { color: theme.colors.text.tertiary },
            ]}
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
      handleSyncPending,
      hasFilters,
      isSyncingPending,
      pendingCount,
      renderFilterChip,
      searchTerm,
      setSearchTerm,
      statusOptions,
      t,
      theme,
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
            style={[
              styles.emptyIconContainer,
              {
                backgroundColor:
                  theme.colors.surface.subtle,
              },
            ]}
          >
            <PackageSearch
              testID="packagesListEmptyIcon"
              size={moderateScale(Theme.sizing.icon.lg)}
              color={theme.colors.icon.brand}
            />
          </View>

          <Text
            testID="packagesListEmptyTitle"
            style={[
              styles.emptyTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {t("packages.list.emptyTitle")}
          </Text>

          <Text
            testID="packagesListEmptyDescription"
            style={[
              styles.emptyDescription,
              { color: theme.colors.text.secondary },
            ]}
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
          style={[
            styles.emptyIconContainer,
            {
              backgroundColor: theme.colors.surface.subtle,
            },
          ]}
        >
          <SearchX
            testID="packagesListNoResultsIcon"
            size={moderateScale(Theme.sizing.icon.lg)}
            color={theme.colors.icon.brand}
          />
        </View>

        <Text
          testID="packagesListNoResultsTitle"
          style={[
            styles.emptyTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          {t("packages.list.noResultsTitle")}
        </Text>

        <Text
          testID="packagesListNoResultsDescription"
          style={[
            styles.emptyDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {t("packages.list.noResultsDescription")}
        </Text>

        {hasFilters ? (
          <TouchableOpacity
            testID="packagesListNoResultsClearButton"
            accessibilityRole="button"
            activeOpacity={0.72}
            onPress={handleClearFilters}
            style={[
              styles.emptyClearButton,
              {
                backgroundColor:
                  theme.colors.surface.subtle,
              },
            ]}
          >
            <Text
              testID="packagesListNoResultsClearText"
              style={[
                styles.emptyClearButtonText,
                { color: theme.colors.text.brand },
              ]}
            >
              {t("packages.list.clearFilters")}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }, [
    handleClearFilters,
    hasFilters,
    packages.length,
    t,
    theme,
  ]);

  return (
    <ScreenContainer
      testID="packagesListScreen"
      headerTitle={t("packages.list.headline")}
      showBackButton={false}
      headerVariant="neutral"
      backgroundColorVariant="neutral100"
      withSafeArea={false}
    >
      <FlashList
        testID="packagesListFlashList"
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={emptyState}
        contentContainerStyle={styles.listContent}
        style={styles.container}
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
