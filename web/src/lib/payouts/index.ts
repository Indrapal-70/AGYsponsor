export interface PayoutAccountValidation {
  valid: boolean;
  normalizedIdentifier?: string;
  error?: string;
}

export interface PayoutDisbursementResult {
  success: boolean;
  providerPayoutId?: string;
  status: 'PENDING' | 'QUEUED' | 'PROCESSED' | 'FAILED';
  fee?: number;
  failureReason?: string;
}

export interface IPayoutProvider {
  name: string;
  validateAccount(accountType: 'UPI' | 'BANK_TRANSFER', identifier: string): PayoutAccountValidation;
  disbursePayout(params: {
    requestId: string;
    amountInr: number;
    accountType: 'UPI' | 'BANK_TRANSFER';
    identifier: string;
    holderName: string;
  }): Promise<PayoutDisbursementResult>;
}

export class MockPayoutProvider implements IPayoutProvider {
  name = 'MOCK';

  validateAccount(accountType: 'UPI' | 'BANK_TRANSFER', identifier: string): PayoutAccountValidation {
    const trimmed = identifier.trim();
    if (accountType === 'UPI') {
      // Regex for UPI VPA: e.g. username@bank, 9876543210@paytm, etc.
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(trimmed)) {
        return { valid: false, error: 'Invalid UPI ID format (e.g. username@okhdfcbank)' };
      }
      return { valid: true, normalizedIdentifier: trimmed.toLowerCase() };
    }

    if (accountType === 'BANK_TRANSFER') {
      // Format: IFSC:ACCOUNT_NUMBER
      const parts = trimmed.split(':');
      if (parts.length !== 2) {
        return { valid: false, error: 'Invalid format. Use IFSC:ACCOUNT_NUMBER (e.g. HDFC0001234:50100234567890)' };
      }
      const [ifsc, acc] = parts;
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(ifsc.toUpperCase())) {
        return { valid: false, error: 'Invalid 11-character Indian IFSC code' };
      }
      if (acc.length < 8 || acc.length > 20 || !/^\d+$/.test(acc)) {
        return { valid: false, error: 'Account number must be 8-20 digits' };
      }
      return { valid: true, normalizedIdentifier: `${ifsc.toUpperCase()}:${acc}` };
    }

    return { valid: false, error: 'Unsupported account type' };
  }

  async disbursePayout(params: {
    requestId: string;
    amountInr: number;
    accountType: 'UPI' | 'BANK_TRANSFER';
    identifier: string;
    holderName: string;
  }): Promise<PayoutDisbursementResult> {
    return {
      success: true,
      providerPayoutId: `pout_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: 'PROCESSED',
      fee: 0.00
    };
  }
}

export function getPayoutProvider(): IPayoutProvider {
  return new MockPayoutProvider();
}
