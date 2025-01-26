const actionsPaydunya = {
  cancel_url: `${process.env.PAYDUNYA_WEBSITE_URL}/success`,
  return_url: `${process.env.PAYDUNYA_WEBSITE_URL}/transfert`,
  callback_url: `${process.env.PAYDUNYA_WEBSITE_URL}/api/paydunya/callback`,
};

export default actionsPaydunya;
