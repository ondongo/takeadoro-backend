const actionsPaydunya = {
  cancel_url: `${process.env.WEB_URL}/success`,
  return_url: `${process.env.WEB_URL}/transfert`,
  callback_url: `https://your-cloud-function-domain/api/paymentGateways/paydunya/callback`,
};

export default actionsPaydunya;
