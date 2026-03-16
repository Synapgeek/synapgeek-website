import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 320;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const WEBHOOK_URL = process.env.WAITLIST_WEBHOOK_URL;

// In-memory rate limiting (resets on cold start, good enough for serverless)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { email, platform, website } = body;

    // Honeypot: if the hidden "website" field is filled, it's a bot
    if (website) {
      // Silently accept to not tip off the bot
      return NextResponse.json({ success: true });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Missing email field" },
        { status: 400 },
      );
    }

    if (email.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: "Email exceeds maximum length" },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const validPlatforms = ["ios", "android", "both"];
    const safePlatform = validPlatforms.includes(platform) ? platform : "both";

    if (!WEBHOOK_URL) {
      console.error("WAITLIST_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, platform: safePlatform }),
    });

    if (!webhookResponse.ok) {
      console.error("Webhook error:", webhookResponse.status);
      return NextResponse.json(
        { error: "Failed to register email" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
