import { env } from "cloudflare:workers";

const NOTIFY_NUMBERS = ["+17064349522", "+17068326873"];

type TwilioEnv = {
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
};

export async function sendLeadTexts(message: string) {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = env as TwilioEnv;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    return;
  }

  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  const results = await Promise.all(
    NOTIFY_NUMBERS.map(async (to) => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ To: to, From: TWILIO_FROM_NUMBER, Body: message }),
        });

        if (response.ok) return true;

        let code: string | undefined;
        let detail: string | undefined;
        try {
          const payload = (await response.json()) as { code?: number; message?: string };
          code = payload.code?.toString();
          detail = payload.message;
        } catch {
          detail = "Twilio returned an unreadable error response";
        }

        console.error("Twilio lead notification failed", {
          code,
          detail,
          status: response.status,
        });
        return false;
      } catch (error) {
        console.error("Twilio lead notification request failed", {
          detail: error instanceof Error ? error.message : "Unknown network error",
        });
        return false;
      }
    })
  );

  if (!results.some(Boolean)) {
    console.error("Twilio lead notification failed for every recipient");
  }
}
