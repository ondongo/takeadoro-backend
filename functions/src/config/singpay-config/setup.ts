const setupSingPay = {
    publicKey: `${process.env.PAYDUNYA_PUBLIC_KEY}`,
    privateKey: `${process.env.PAYDUNYA_PRIVATE_KEY}`,
    masterKey: `${process.env.PAYDUNYA_MASTER_KEY}`,
    token:`${process.env.PAYDUNYA_TOKEN}`,
    mode:`${process.env.PAYDUNYA_MODE}`
  };
  
  export default setupSingPay;