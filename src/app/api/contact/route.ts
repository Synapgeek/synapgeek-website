import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/** Escape HTML special characters to prevent injection. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip CR/LF to prevent email header injection. */
function stripNewlines(str: string): string {
  return str.replace(/[\r\n]/g, "");
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sujets acceptés. Le client envoie une `value` ; le serveur ne fait JAMAIS
 * confiance à son libellé et compose lui-même l'objet de l'email à partir de
 * cette table. Toute valeur hors liste est rejetée en 400.
 *
 * Les `value` doivent rester synchronisées avec `common.contactForm.topics`
 * dans `src/content/fr.ts` ET `src/content/en.ts` — un sujet ajouté d'un seul
 * côté passe le build et échoue à l'envoi.
 */
const CONTACT_TOPICS: Record<string, string> = {
  support: "Support technique",
  purchases: "Achats & abonnements",
  account: "Compte & données personnelles",
  feedback: "Suggestion / retour",
  press: "Presse & partenariats",
  other: "Autre",
};

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, recaptchaToken } = body;
    // Un onglet ouvert avant le déploiement du champ « sujet » envoie encore le
    // formulaire sans `topic` : on le range en « other » plutôt que de perdre le
    // message. Une valeur présente mais hors liste reste refusée plus bas.
    const topic: string = body.topic ?? "other";

    // Validate required fields
    if (!name || !email || !message || !recaptchaToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Le sujet ne sert à composer l'objet de l'email qu'après cette vérification :
    // il finit dans un en-tête, il ne peut donc pas venir tel quel du client.
    // Object.hasOwn (et non `in` ou un accès direct) : un `topic` comme
    // "constructor" ou "toString" viserait sinon une propriété héritée de
    // Object.prototype et non une entrée de la table.
    if (typeof topic !== "string" || !Object.hasOwn(CONTACT_TOPICS, topic)) {
      return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
    }
    const topicLabel = CONTACT_TOPICS[topic];

    // Validate input lengths
    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json(
        { error: "Input exceeds maximum length" },
        { status: 400 },
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      },
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 },
      );
    }

    // Sanitize inputs for email headers
    const safeName = stripNewlines(name);
    const safeEmail = stripNewlines(email);

    // Send email
    await transporter.sendMail({
      from: `"Synapgeek Website" <${process.env.SMTP_USER}>`,
      replyTo: safeEmail,
      to: process.env.CONTACT_EMAIL,
      subject: `[Contact][${topicLabel}] ${safeName}`,
      text: `Sujet: ${topicLabel}\nNom: ${safeName}\nEmail: ${safeEmail}\n\nMessage:\n${message}`,
      html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>Sujet:</strong> ${escapeHtml(topicLabel)}</p>
        <p><strong>Nom:</strong> ${escapeHtml(safeName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
