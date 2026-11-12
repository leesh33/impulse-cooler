import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../theme';
import { formatKRW } from '../conversions';

export default function VaultCard({ totalDefended, defendedCount, coolingCount }) {
  const totalDecisions = defendedCount;
  const winRate = totalDecisions > 0 ? 100 : 100;

  return (
    <LinearGradient
      colors={[Colors.cardGradientStart, Colors.cardGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.badgeText}>🛡️ 지출 방어 저금통</Text>
        <Text style={styles.statusPill}>절약 가동 중 ❄️</Text>
      </View>

      <Text style={styles.amountText}>{formatKRW(totalDefended)}</Text>
      <Text style={styles.subtext}>지금 멈추면, 내가 승리합니다.</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text style={styles.statVal}>{defendedCount}건</Text>
          <Text style={styles.statLbl}>방어 성공</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statCol}>
          <Text style={styles.statVal}>{coolingCount}건</Text>
          <Text style={styles.statLbl}>현재 냉각 중</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statCol}>
          <Text style={[styles.statVal, { color: Colors.accentGreenLight }]}>{winRate}%</Text>
          <Text style={styles.statLbl}>방어율</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badgeText: {
    color: Colors.accentBlue,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  statusPill: {
    fontSize: 11,
    color: Colors.textSecondary,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  amountText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  subtext: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Spacing.md,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLbl: {
    color: Colors.textTertiary,
    fontSize: 11,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
