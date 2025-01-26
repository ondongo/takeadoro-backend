import { handleInvoicePaymentSucceeded } from "./handlers/invoicePaymentSucceeded";

export async function POST(req: Request) {
  try {
    const dataString = await req.text();

    const data = parseEncodedQueryString(dataString).data;

    console.log("data callback", data);
    const uid = data.custom_data.uid;
    //const user = await adminAuth.getUser(uid); 
   // console.log(data)
    if (data.status === "completed") {
      handleInvoicePaymentSucceeded(data);
    }

    return new Response("Notification successfully received.", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Error processing the notification.", {
      status: 500,
    });
  }
}

function parseEncodedQueryString(queryString: string): any {
  let decodedString = decodeURIComponent(queryString);
  decodedString = decodedString.replace(/\+/g, " ");
  const data: { [key: string]: any } = {};
  decodedString.split("&").forEach((part) => {
    const [key, value] = part.split("=");

    let target: { [key: string]: any } = data;
    let keys: string[] = key.match(/([^\[\]]+)/g) || [];

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        target[k] = value;
      } else {
        if (!target[k]) target[k] = {};
        target = target[k];
      }
    });
  });

  return data;
}
