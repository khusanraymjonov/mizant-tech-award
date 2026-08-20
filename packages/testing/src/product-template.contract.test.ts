import { describe, expect, it } from 'vitest';
import { validateProductTemplate } from '@mizant/domain';
import { syntheticIjarahSolarTemplate, syntheticSaleLeasebackTemplate } from './index.js';

describe('ABS-001..010 product-template contracts', () => {
  for (const template of [syntheticIjarahSolarTemplate, syntheticSaleLeasebackTemplate]) {
    it(`${template.key} satisfies the common governed contract`, () => {
      expect(validateProductTemplate(template)).toEqual({ valid: true, errors: [] });
      expect(template.liveScope).toBe(false);
      expect(template.register.providerMode).toBe('mock');
    });
  }

  it('contains differences in templates without a domain fork', () => {
    expect(syntheticSaleLeasebackTemplate.assetPool.assets).toHaveLength(2);
    expect(syntheticSaleLeasebackTemplate.economics.cashFlowType).toBe('rent');
    expect(syntheticSaleLeasebackTemplate.key).not.toBe(syntheticIjarahSolarTemplate.key);
  });

  it('fails if a mandatory governance gate is removed', () => {
    const invalid = { ...syntheticIjarahSolarTemplate, mandatoryGates: ['legal'] as const };
    expect(validateProductTemplate(invalid).errors).toContain('MANDATORY_GATE_MISSING:shariah');
  });
});
