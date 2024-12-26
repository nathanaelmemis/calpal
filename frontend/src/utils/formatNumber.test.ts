import { describe, expect, test } from '@jest/globals';
import { formatNumber } from './formatNumber';

describe('formatNumber module', () => {
    test('reduce decimal to nearest hundreths', () => {
        expect(formatNumber(1.234234)).toBe(1.24);
    });
});

