import admin from "../../../../config/firebaseConfig";

if (admin.apps.length === 0) {
  admin.initializeApp();
}


const db = admin.firestore();

export async function handleInvoicePaymentSucceeded(data: any) {
  const customData = data.custom_data;
  const currency = customData.currency;
  const paymentMethod = customData.paymentMethod;
  const uid = customData.uid;
  const amount = Number(data.invoice.total_amount);
  const invoiceToken = data.invoice.token;
  const paymentId = await addPayment(
    paymentMethod,
    amount,
    uid,
    currency,
    invoiceToken
  );

  //handleSuccessfulSubscriptionPayment(uid, customData, amount, paymentId);
}
async function addPayment(
  paymentMethod: string,
  amount: number,
  uid: string,
  currency: string,
  invoiceToken: string
) {
  var collectionRef = db.collection("payments");
  try {
    const docRef = await collectionRef.add({
      createdAt: new Date(),
      paymentMethod: paymentMethod,
      amount: amount,
      currency: currency,
      uid: uid,
      invoiceToken: invoiceToken,
    });
    const paymentId = docRef.id;

    return paymentId;
  } catch (error) {
    console.error("error registering payment", error);
    return "";
  }
}











/* async function handleSuccessfulSubscriptionPayment(
  uid: string,
  customData: any,
  amount: number,
  paymentId: string
) {
  try {
    const currency = customData.currency;
    const paymentMode = "subscription";
    var subscriptionDuration = 0;
    const subscriptionInterval = customData.subscriptionInterval;
    const subscriptionId = customData.subscriptionId;
    if (subscriptionInterval === "month") {
      subscriptionDuration = 2629800;
    } else if (subscriptionInterval === "year") {
      subscriptionDuration = 31536000;
    }
    const planType = customData.planType;
    const createdAt = new Date();
    let endedAt = new Date();
    endedAt.setMonth(createdAt.getMonth() + 1);
    let gracePeriodEnd = new Date();
    gracePeriodEnd.setMonth(createdAt.getMonth() + 2);
    Promise.all([
      addSubscriptionToUser(
        amount,
        uid,
        subscriptionId,
        planType,
        subscriptionDuration,
        subscriptionInterval,
        paymentId,
        currency,
        endedAt,
        createdAt,
        gracePeriodEnd
      ),
      updateSubscriptionOfPayment(
        subscriptionId,
        planType,
        paymentId,
        paymentMode
      ),
    ]);
  } catch (err: any) {
    console.log("SuccessfulSubscriptionPayment Error", err);
  }
}

async function addSubscriptionToUser(
  amount: number,
  uid: string,
  subscriptionId: string,
  planType: string,
  subscriptionDuration: number,
  subscriptionInterval: string,
  paymentId: string,
  currency: string,
  endedAt: Date,
  createdAt: Date,
  gracePeriodEnd: Date
) {

  var collectionRef = await db.collection(db, "userSubscriptions");
  try {
    const docRef = await db.addDoc(collectionRef, {
      createdAt: createdAt,
      expiresAt: endedAt,
      uid: uid,
      subscriptionId: subscriptionId,
      planType: planType,
      amount: amount,
      duration: subscriptionDuration,
      interval: subscriptionInterval,
      paymentId: paymentId,
      status: "active",
      currency: currency,
      gracePeriodEnd: gracePeriodEnd,
    });
    const userSubscriptionId = docRef.id;
    return userSubscriptionId;
  } catch (error) {
    console.error("Error registering userSubscription", error);
    return "";
  }
}

async function updateSubscriptionOfPayment(
  subscriptionId: string,
  planType: string,
  paymentId: string,
  paymentMode: string
) {
  const { doc, updateDoc, db } = await getFirestore();
  const docRef = doc(db, "payments", paymentId);

  try {
    await updateDoc(docRef, {
      paymentId: paymentId,
      subscriptionId: subscriptionId,
      planType: planType,
      paymentMode: paymentMode,
    });
  } catch (error) {
    console.error("Error updating subscription attribute of payment: ", error);
  }
} */
