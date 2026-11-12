import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '../theme';
import VaultCard from '../components/VaultCard';
import CoolingCard from '../components/CoolingCard';
import AddItemModal from '../components/AddItemModal';
import { loadAppData, saveAppData } from '../storage';
import { formatKRW } from '../conversions';

export default function HomeScreen() {
  const [data, setData] = useState({ items: [], history: [] });
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadAppData().then(setData);
  }, []);

  const totalDefended = data.history
    .filter((h) => h.status === 'defended')
    .reduce((sum, h) => sum + h.price, 0);

  const defendedCount = data.history.filter((h) => h.status === 'defended').length;
  const coolingItems = data.items.filter((i) => i.status === 'cooling');

  const updateStateAndSave = (next) => {
    setData(next);
    saveAppData(next);
  };

  const handleAddItem = (newItem) => {
    const item = {
      id: 'item-' + Date.now(),
      name: newItem.name,
      price: newItem.price,
      durationHours: newItem.durationHours,
      createdAt: Date.now(),
      status: 'cooling',
    };

    updateStateAndSave({
      ...data,
      items: [item, ...data.items],
    });
  };

  const handleDefend = (id) => {
    const target = data.items.find((i) => i.id === id);
    if (!target) return;

    const nextItems = data.items.filter((i) => i.id !== id);
    const newHistory = {
      id: 'hist-' + Date.now(),
      name: target.name,
      price: target.price,
      status: 'defended',
      decidedAt: Date.now(),
    };

    updateStateAndSave({
      items: nextItems,
      history: [newHistory, ...data.history],
    });
  };

  const handlePurchase = (id) => {
    const target = data.items.find((i) => i.id === id);
    if (!target) return;

    const nextItems = data.items.filter((i) => i.id !== id);
    const newHistory = {
      id: 'hist-' + Date.now(),
      name: target.name,
      price: target.price,
      status: 'purchased',
      decidedAt: Date.now(),
    };

    updateStateAndSave({
      items: nextItems,
      history: [newHistory, ...data.history],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appName}>지름 쿨다운 ❄️</Text>
          <Text style={styles.appSub}>충동구매를 막고 지갑을 지킵니다</Text>
        </View>
        <TouchableOpacity
          style={styles.addIconBtn}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addIconText}>+ 냉각</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vault Banner */}
        <VaultCard
          totalDefended={totalDefended}
          defendedCount={defendedCount}
          coolingCount={coolingItems.length}
        />

        {/* Action Call to Add */}
        <TouchableOpacity
          style={styles.addBannerBtn}
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addBannerIcon}>🧊</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.addBannerTitle}>새로운 지름 보류하기</Text>
            <Text style={styles.addBannerSub}>결제 전 48시간 쿨다운 타이머 시작</Text>
          </View>
          <Text style={styles.addBannerArrow}>→</Text>
        </TouchableOpacity>

        {/* Active Cooling Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 냉각 중인 지름</Text>
          <Text style={styles.sectionCount}>{coolingItems.length}건</Text>
        </View>

        {coolingItems.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>❄️</Text>
            <Text style={styles.emptyTitle}>현재 냉각 중인 물건이 없어요</Text>
            <Text style={styles.emptySub}>
              사고 싶은 물건이 생기면 결제 전에 먼저 냉각기에 넣어보세요!
            </Text>
          </View>
        ) : (
          coolingItems.map((item) => (
            <CoolingCard
              key={item.id}
              item={item}
              onDefend={handleDefend}
              onPurchase={handlePurchase}
            />
          ))
        )}

        {/* Defended History */}
        {data.history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>🏆 지출 방어 명예의 전당</Text>
            {data.history.slice(0, 10).map((h) => {
              const isDefended = h.status === 'defended';
              return (
                <View key={h.id} style={styles.historyRow}>
                  <View style={{ flex: 1, marginRight: Spacing.sm }}>
                    <Text style={styles.historyName} numberOfLines={1}>
                      {isDefended ? '🛡️ ' : '🛒 '}
                      {h.name}
                    </Text>
                    <Text style={styles.historyStatus}>
                      {isDefended ? '지출 방어 성공 (살렸다!)' : '합리적 소비 결정'}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.historyAmount,
                      isDefended && { color: Colors.accentGreenLight },
                    ]}
                  >
                    {isDefended ? '+' : ''}
                    {formatKRW(h.price)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Add Modal */}
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  appName: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  appSub: {
    color: Colors.textTertiary,
    fontSize: 12,
    marginTop: 2,
  },
  addIconBtn: {
    backgroundColor: Colors.accentBlueDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.pill,
  },
  addIconText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  addBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  addBannerIcon: {
    fontSize: 26,
  },
  addBannerTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  addBannerSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  addBannerArrow: {
    color: Colors.accentBlue,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionCount: {
    color: Colors.textTertiary,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  emptySub: {
    color: Colors.textTertiary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  historySection: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  historyName: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  historyStatus: {
    color: Colors.textTertiary,
    fontSize: 11,
    marginTop: 2,
  },
  historyAmount: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
});
