export const solarOpportunity = {
  reference: 'MZT-SYN-001',
  title: 'Samarkand Solar Equipment Ijarah',
  location: 'Samarkand, Uzbekistan',
  sector: 'Food processing',
  target: 250_000,
  committed: 170_000,
  unitPrice: 100,
  totalUnits: 2_500,
  termMonths: 48,
  status: 'Synthetic showcase',
  summary:
    'A controlled illustration of solar equipment acquired by a project vehicle and leased to a productive SME under an Ijarah structure.',
} as const;

export const pipelineOpportunities = [
  {
    reference: 'MZT-SYN-002',
    title: 'Cold-chain efficiency equipment',
    location: 'Tashkent, Uzbekistan',
    sector: 'Logistics',
    target: 180_000,
    termMonths: 36,
    status: 'Diligence in progress',
  },
  {
    reference: 'MZT-SYN-003',
    title: 'Water-efficient textile machinery',
    location: 'Fergana, Uzbekistan',
    sector: 'Light manufacturing',
    target: 320_000,
    termMonths: 48,
    status: 'Evidence collection',
  },
] as const;

export const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
