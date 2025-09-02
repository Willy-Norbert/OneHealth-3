// Placeholder MTN MoMo integration. Replace with real API calls later.

exports.createCheckoutSession = async ({ amount, currency, reference }) => {
  const providerSessionId = `mtn_${Date.now()}`;
  const checkoutUrl = `https://mtnmomo.example/authorize?ref=${encodeURIComponent(reference)}`;
  return {
    providerSessionId,
    checkoutUrl,
    status: 'REQUIRES_ACTION',
    metadata: { note: 'MTN placeholder session' },
  };
};

exports.verifyPayment = async ({ providerSessionId }) => {
  // Simulate processing
  return { status: 'PROCESSING', providerSessionId };
};
