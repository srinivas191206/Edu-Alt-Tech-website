export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface CreateOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

export async function createRazorpayOrder(amount: number): Promise<CreateOrderResponse> {
  const res = await fetch('/api/createOrder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create order' }));
    throw new Error(err.error || `Server error (${res.status})`);
  }
  return res.json();
}

export async function verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean> {
  const res = await fetch('/api/verifyPayment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact?: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal?: { ondismiss?: () => void };
}

export function openRazorpayCheckout(options: RazorpayOptions): void {
  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
