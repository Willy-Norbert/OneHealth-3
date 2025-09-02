// Development-only fake provider to simulate a checkout flow

exports.createCheckoutSession = async ({ amount, currency, reference }) => {
  const providerSessionId = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const checkoutUrl = `https://example.dev.fake/checkout?ref=${encodeURIComponent(reference)}&psid=${providerSessionId}`;
  return {
    providerSessionId,
    checkoutUrl,
    status: 'REQUIRES_ACTION',
    metadata: { note: 'DEV_FAKE checkout created' },
  };
};

exports.verifyPayment = async ({ providerSessionId }) => {
  // Always succeed in dev mode
  return { status: 'SUCCEEDED', providerSessionId };
};
