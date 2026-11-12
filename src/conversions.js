// 맞춤형 생활 체감 가치 환산 로직
export const ConversionRates = {
  teslaCharging: 12000, // 테슬라 완충 1회 (약 12,000원)
  babyDiaperPack: 25000, // 기저귀 1팩 (약 25,000원)
  americano: 4500,       // 아메리카노 1잔 (4,500원)
  friedChicken: 22000,   // 치킨 1마리 (22,000원)
};

export function calculateConversions(price) {
  const p = Number(price) || 0;
  return {
    tesla: (p / ConversionRates.teslaCharging).toFixed(1),
    diaper: (p / ConversionRates.babyDiaperPack).toFixed(1),
    coffee: Math.floor(p / ConversionRates.americano),
    chicken: (p / ConversionRates.friedChicken).toFixed(1),
  };
}

export function formatKRW(amount) {
  return (Number(amount) || 0).toLocaleString('ko-KR') + '원';
}
