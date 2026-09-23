import { IPaymentProvider } from './types';
import { MockPaymentProvider } from './mock';
import { RazorpayPaymentProvider } from './razorpay';

export * from './types';

let cachedProvider: IPaymentProvider | null = null;

export function getPaymentProvider(): IPaymentProvider {
  if (cachedProvider) return cachedProvider;

  const providerName = (process.env.PAYMENT_PROVIDER || 'MOCK').toUpperCase();

  if (providerName === 'RAZORPAY') {
    cachedProvider = new RazorpayPaymentProvider();
  } else {
    cachedProvider = new MockPaymentProvider();
  }

  return cachedProvider;
}
