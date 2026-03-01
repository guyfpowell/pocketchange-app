import { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import {
  DonationHistoryRow,
  DonationHistoryRowSkeleton,
} from '@/components/donor/DonationHistoryRow';
import { useDonationHistory } from '@/hooks/useDonation';
import type { DonationHistoryItem } from '@/types';
import { colors, font, fontSize, spacing, tracking } from '@/theme';

const SKELETON_COUNT = 5;

export default function HistoryScreen() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useDonationHistory();

  const donations: DonationHistoryItem[] =
    data?.pages.flatMap((p) => p.donations) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function renderSeparator() {
    return <View style={styles.separator} />;
  }

  function renderFooter() {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerSpinner}>
        <Spinner color={colors.teal} />
      </View>
    );
  }

  function renderEmpty() {
    if (isLoading) return null;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No donations yet</Text>
        <Text style={styles.emptySub}>
          Scan a recipient QR code or enter their short code to get started.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.heading}>HISTORY</Text>
      </View>

      {/* Skeleton while first page loads */}
      {isLoading ? (
        <Card padding={0} style={styles.card}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <View
              key={i}
              style={i < SKELETON_COUNT - 1 ? styles.separator : undefined}
            >
              <DonationHistoryRowSkeleton />
            </View>
          ))}
        </Card>
      ) : (
        <FlatList
          data={donations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DonationHistoryRow item={item} />}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          contentContainerStyle={[
            styles.list,
            donations.length === 0 && styles.listEmpty,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.teal}
            />
          }
          style={styles.flatList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  heading: {
    fontFamily: font.bold,
    fontSize: fontSize.lg,
    color: colors.teal,
    letterSpacing: tracking.heading,
  },
  flatList: {
    flex: 1,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  listEmpty: {
    flexGrow: 1,
  },
  card: {
    marginHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 8 + spacing.sm,
  },
  footerSpinner: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    paddingTop: spacing.xxl,
  },
  emptyTitle: {
    fontFamily: font.bold,
    fontSize: fontSize.md,
    color: colors.teal,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: font.regular,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
