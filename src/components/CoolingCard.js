import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius } from '../theme';
import { formatKRW, calculateConversions } from '../conversions';

export default function CoolingCard({ item, onDefend, onPurchase }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  function getTimeRemaining() {
    const target = item.createdAt + item.durationHours * 60 * 60 * 1000;
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const total = item.durationHours * 60 * 60 * 1000;
    const progress = Math.min(100, Math.max(0, ((total - diff) / total) * 100));

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return { diff, hours, mins, secs, progress, isReady: diff <= 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, [item]);

  const conv = calculateConversions(item.price);

  const handleDefendPress = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
    onDefend(item.id);
  };

  const handlePurchasePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
    onPurchase(item.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: Spacing.md }}>
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.meta}>보류 기간: {item.durationHours}시간</Text>
        </View>
        <Text style={styles.price}>{formatKRW(item.price)}</Text>
      </View>

      {/* Value Conversion Chips */}
      <View style={styles.chipsRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>⚡ 완충 {conv.tesla}회</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>👶 기저귀 {conv.diaper}팩</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>🍗 치킨 {conv.chicken}마리</Text>
        </View>
      </View>

      {/* Timer & Temperature Progress */}
      <View style={styles.timerSection}>
        <View style={styles.timerRow}>
          <Text style={styles.timerLabel}>마음 온도</Text>
          <Text style={[styles.timerValue, timeLeft.isReady && styles.timerReady]}>
            {timeLeft.isReady
              ? '❄️ 쿨다운 완료 (-6°C)'
              : `⏳ ${timeLeft.hours}시간 ${timeLeft.mins}분 ${timeLeft.secs}초`}
          </Text>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${timeLeft.progress}%` }]} />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.defendBtn}
          activeOpacity={0.8}
          onPress={handleDefendPress}
        >
          <Text style={styles.defendBtnText}>🛡️ 지름 방어 성공! (안 삼)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyBtn}
          activeOpacity={0.7}
          onPress={handlePurchasePress}
        >
          <Text style={styles.buyBtnText}>🛒 아직 사고 싶어</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  meta: {
    color: Colors.textTertiary,
    fontSize: 12,
    marginTop: 2,
  },
  price: {
    color: Colors.accentBlue,
    fontSize: 18,
    fontWeight: '800',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  timerSection: {
    marginBottom: Spacing.md,
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  timerLabel: {
    color: Colors.textTertiary,
    fontSize: 12,
  },
  timerValue: {
    color: Colors.accentOrange,
    fontSize: 13,
    fontWeight: '700',
  },
  timerReady: {
    color: Colors.accentGreenLight,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.pill,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accentIce,
    borderRadius: BorderRadius.pill,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  defendBtn: {
    flex: 1.2,
    height: 44,
    backgroundColor: Colors.accentGreenBg,
    borderWidth: 1,
    borderColor: Colors.accentGreenBorder,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defendBtnText: {
    color: Colors.accentGreenLight,
    fontSize: 13,
    fontWeight: '700',
  },
  buyBtn: {
    flex: 0.8,
    height: 44,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  buyBtnText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});
