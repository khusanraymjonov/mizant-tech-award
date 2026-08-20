export interface SafetyFlags {
  dataMode: 'SYNTHETIC_ONLY';
  realPayments: false;
  liveKyc: false;
  productionChain: false;
}

export function assertDemoSafety(environment: Record<string, string | undefined>): SafetyFlags {
  if (environment.APP_DATA_MODE !== 'SYNTHETIC_ONLY') throw new Error('SYNTHETIC_ONLY_REQUIRED');
  for (const flag of ['ENABLE_REAL_PAYMENTS', 'ENABLE_LIVE_KYC', 'ENABLE_PRODUCTION_CHAIN']) {
    if (environment[flag] !== 'false') throw new Error(`${flag}_MUST_BE_FALSE`);
  }
  return {
    dataMode: 'SYNTHETIC_ONLY',
    realPayments: false,
    liveKyc: false,
    productionChain: false,
  };
}
