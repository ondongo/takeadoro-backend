function getCorrespondent(country: string): string {
    const correspondents: { [key: string]: string } = {
      CONGO: "MTN_MOMO_COG",
      SENEGAL: "MTN_MOMO_SEN",
      GABON: "MTN_MOMO_GAB",
    };
    return correspondents[country] || "UNKNOWN";
  }
  
  function getRecipientPhone(country: string): string {
    const recipientPhones: { [key: string]: string } = {
      CONGO: "242055555555",
      SENEGAL: "221770000000",
      GABON: "241060606060",
    };
    return recipientPhones[country] || "";
  }
  
  [

    {
        "country": "GAB",
        "correspondents": [
            {
                "correspondent": "AIRTEL_GAB",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            }
        ]
    },



    {
        "country": "COG",
        "correspondents": [
            {
                "correspondent": "AIRTEL_COG",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "MTN_MOMO_COG",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            }
        ]
    },

    

    {
        "country": "SEN",
        "correspondents": [
            {
                "correspondent": "EXPRESSO_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "FREE_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "WAVE_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "AFITECH_ORANGE_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "ORANGE_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "ORANGE_QR_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "AFITECH_ORANGE_OTP_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "AFITECH_WAVE_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "AFITECH_FREE_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "AFITECH_ORANGE_QR_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            },
            {
                "correspondent": "ORANGE_V2_SEN",
                "operationTypes": [
                    {
                        "operationType": "DEPOSIT",
                        "status": "OPERATIONAL"
                    },
                    {
                        "operationType": "PAYOUT",
                        "status": "OPERATIONAL"
                    }
                ]
            }
        ]
    },
   
]