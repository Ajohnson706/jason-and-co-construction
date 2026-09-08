import { env } from "cloudflare:workers";

type TwilioEnv = {
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
};

export async function GET() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = env as TwilioEnv;

  const configured = {
    hasAccountSid: Boolean(TWILIO_ACCOUNT_SID),
    hasAuthToken: Boolean(TWILIO_AUTH_TOKEN),
    hasFromNumber: Boolean(TWILIO_FROM_NUMBER),
    fromNumberValue: TWILIO_FROM_NUMBER ?? null,
  };

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    return Response.json({ configured, attempted: false });
  }

  try {
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: "+17068326873",
        From: TWILIO_FROM_NUMBER,
        Body: "Diagnostic test from /api/debug-twilio.",
      }),
    });
    const text = await response.text();

    return Response.json({
      configured,
      attempted: true,
      twilioStatus: response.status,
      twilioResponse: text,
    });
  } catch (error) {
    return Response.json({
      configured,
      attempted: true,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
