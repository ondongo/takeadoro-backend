const setupPawapay = {
    publicKey: `${process.env.PAYDUNYA_PUBLIC_KEY}`,
    privateKey: `${process.env.PAYDUNYA_PRIVATE_KEY}`,
    masterKey: `${process.env.PAYDUNYA_MASTER_KEY}`,
    token:`${process.env.PAYDUNYA_TOKEN}`,
    mode:`${process.env.PAYDUNYA_MODE}`,
    baseUrl:`${process.env.PAWAPAY_BASE_URL}`
  };
  
  export default setupPawapay;