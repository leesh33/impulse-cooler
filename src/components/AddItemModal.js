import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Colors, Spacing, BorderRadius } from '../theme';
import { calculateConversions } from '../conversions';

export default function AddItemModal({ visible, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [durationHours, setDurationHours] = useState(48);

  const numPrice = Number(price) || 0;
  const conv = calculateConversions(numPrice);

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (numPrice <= 0) return;

    onAdd({
      name: name.trim(),
      price: numPrice,
      durationHours,
    });

    setName('');
    setPrice('');
    setDurationHours(48);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContent}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🧊 새로운 지름 냉각하기</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>사고 싶은 물건</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 테슬라 전동 선쉐이드, 애플워치"
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>가격 (원)</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 280000"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <Text style={styles.label}>냉각 보류 시간</Text>
            <View style={styles.pillsRow}>
              {[24, 48, 72].map((hours) => (
                <TouchableOpacity
                  key={hours}
                  style={[styles.pill, durationHours === hours && styles.pillActive]}
                  onPress={() => setDurationHours(hours)}
                >
                  <Text
                    style={[styles.pillText, durationHours === hours && styles.pillTextActive]}
                  >
                    {hours}시간
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Live conversion preview */}
            {numPrice > 0 && (
              <View style={styles.previewBox}>
                <Text style={styles.previewTitle}>⚡ 이 돈이면 다른 걸 얼마나?</Text>
                <View style={styles.chipsGrid}>
                  <Text style={styles.calcText}>⚡ 테슬라 완충 {conv.tesla}회</Text>
                  <Text style={styles.calcText}>👶 기저귀 {conv.diaper}팩</Text>
                  <Text style={styles.calcText}>☕ 커피 {conv.coffee}잔</Text>
                  <Text style={styles.calcText}>🍗 치킨 {conv.chicken}마리</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.submitBtn}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>🧊 {durationHours}시간 냉각 시작하기</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    color: Colors.textTertiary,
    fontSize: 20,
    fontWeight: '600',
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    height: 48,
    paddingHorizontal: Spacing.lg,
    color: Colors.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.sm,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  pill: {
    flex: 1,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  pillActive: {
    backgroundColor: Colors.accentBlueDark,
    borderColor: Colors.accentBlue,
  },
  pillText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#ffffff',
  },
  previewBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginBottom: Spacing.lg,
  },
  previewTitle: {
    color: Colors.accentBlue,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  calcText: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  submitBtn: {
    height: 52,
    backgroundColor: Colors.accentBlueDark,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
