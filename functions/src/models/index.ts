interface Transactions {
    id : string;
    paymentMethod:string;
    amount:number;
    currency:string;
}

interface User {
    uid: string;
    email?: string; 
    phoneNumber : string;
  }
  
  interface LineItem {
    name: string;
    quantity: number;
    unit_price: number;
  }
  
  interface InvoiceRequestBody {
    user: User;
    lineItems: LineItem[];
  }

  interface InvoiceResponse {
    success?: boolean;
    data?: any;
    error?: boolean;
    message?: string;
  }

export interface InvoiceResponseStruct {
    success: boolean;
    message: string;
    response?: any;
  }