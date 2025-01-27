const actionsPaydunya = {
  cancel_url: `${process.env.PAYDUNYA_WEBSITE_URL}/success`,
  return_url: `${process.env.PAYDUNYA_WEBSITE_URL}/transfert`,
  callback_url: `https://your-cloud-function-domain/paydunyaWebhook`,
};

export default actionsPaydunya;
