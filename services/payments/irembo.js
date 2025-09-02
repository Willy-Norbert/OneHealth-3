// Placeholder Irembo integration. Replace with real API calls later.

exports.createCheckoutSession = async ({ amount, currency, reference }) => {
  const providerSessionId = `irembo_${Date.now()}`;
  const checkoutUrl = `https://irembo-pay.example/checkout?ref=${encodeURIComponent(reference)}`;
  return {
    providerSessionId,
    checkoutUrl,
    status: 'REQUIRES_ACTION',
    metadata: { note: 'Irembo placeholder session' },
  };
};

exports.verifyPayment = async ({ providerSessionId }) => {
  // Simulate processing
  return { status: 'PROCESSING', providerSessionId };
};
