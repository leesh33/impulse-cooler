import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@impulse_cooler_data_v1';

export const initialData = {
  items: [
    {
      id: 'sample-tesla-shade',
      name: '테슬라 모델 Y 전동 선쉐이드',
      price: 280000,
      durationHours: 48,
      createdAt: Date.now() - 1000 * 60 * 60 * 18, // 18시간 전 등록 (30시간 남음)
      status: 'cooling',
    },
  ],
  history: [
    {
      id: 'hist-sample-1',
      name: '불필요한 충동구매 게이밍 헤드셋',
      price: 119000,
      status: 'defended',
      decidedAt: Date.now() - 1000 * 60 * 60 * 48,
    },
  ],
};

export async function loadAppData() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load storage data', e);
    return initialData;
  }
}

export async function saveAppData(data) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save storage data', e);
  }
}
