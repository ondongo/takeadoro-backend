export async function webhookHandler(req: Request, res: Response) {
  /* const data = req.body; */
  let operationType;
  try {
    if (operationType === "airtelToOrange") {
      /* const result = await initiateAirtelToAirtelTransfer(data); */
      /* res.status(200).json({ success: true, message: 'Airtel to Airtel transfer initiated successfully', result }); */
    } else if (operationType === "orangeToAirtel") {
      /*   const result = await initiateOrangeToOrangeTransfer(data);
        res.status(200).json({ success: true, message: 'Orange to Orange transfer initiated successfully', result }); */
    } else {
      throw new Error("Invalid operation type specified.");
    }
  } catch (error) {
    console.error("Error processing webhook request:", error);
    /* res.status(500).json({ success: false, error: "Internal server error" }); */
  }
}
