import type { Dictionary } from "./types";

const en: Dictionary = {
  common: {
    siteName: "Synapgeek",
    tagline: "Indie mobile game studio",
    nav: {
      home: "Home",
      privacy: "Privacy",
      terms: "Terms",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Synapgeek. All rights reserved.`,
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      legalNotice: "Legal Notice",
      contact: "Contact",
    },
    languageSwitch: "Français",
    languageSwitchLocale: "fr",
  },
  landing: {
    hero: {
      badge: "Now on iOS · Android coming soon",
      title: "Train your brain, one puzzle at a time",
      subtitle:
        "Cerebrum brings Sudoku, Crosswords, Word Search, and Cross Math into one beautifully crafted app designed to challenge your mind every single day.",
      cta: "Download Cerebrum",
      ctaSecondary: "Learn more",
      store: {
        availableNow: "Available now",
        androidSoon: "Android — coming soon",
      },
      waitlist: {
        placeholder: "Your email",
        button: "Notify me",
        success: "You're in! We'll email you when Android launches.",
        error: "Something went wrong. Try again.",
      },
    },
    stats: {
      items: [
        { value: "4", label: "Games in 1" },
        { value: "1000+", label: "Puzzles" },
        { value: "FR & EN", label: "Languages" },
        { value: "Free", label: "Download" },
      ],
    },
    features: {
      title: "One brain, four disciplines",
      subtitle:
        "Each game stimulates different cognitive skills. Combine them for a complete workout.",
      items: [
        {
          title: "Sudoku",
          description:
            "Pure logic and deductive reasoning. Grids for every level, from beginner to expert, with smart hints.",
        },
        {
          title: "Crosswords",
          description:
            "Expand your vocabulary and general knowledge. Original grids updated regularly.",
        },
        {
          title: "Word Search",
          description:
            "Find hidden words in the grid. A timeless word game to sharpen your observation skills.",
        },
        {
          title: "Cross Math",
          description:
            "Crossword-style equations blending arithmetic and logic. The perfect challenge for math lovers.",
        },
      ],
    },
    about: {
      title: "Built by enthusiasts",
      description:
        "Synapgeek is a French indie studio passionate about mobile games. We believe the best games combine elegance, challenge, and pure enjoyment.",
      values: [
        {
          title: "Quality over quantity",
          description:
            "Every puzzle is handcrafted with care. No mass-generated content.",
        },
        {
          title: "Privacy first",
          description: "Your data belongs to you. No invasive tracking.",
        },
        {
          title: "Made in France",
          description: "Designed and built in Paris with passion.",
        },
      ],
    },
    cta: {
      title: "Ready to train your brain?",
      subtitle:
        "Cerebrum is out now on iOS. Four puzzle games in one app.",
      cta: "Download for free",
      note: "Free with optional in-app purchases.",
      store: {
        availableNow: "Available now",
        androidSoon: "Android — coming soon",
      },
      waitlist: {
        placeholder: "Your email",
        button: "Notify me",
        success: "You're in! We'll email you when Android launches.",
        error: "Something went wrong. Try again.",
      },
    },
    contact: {
      title: "Got a question?",
      subtitle: "Drop us a line and we'll get back to you as soon as possible.",
    },
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: July 22, 2026",
    sections: [
      {
        title: "Who we are",
        content:
          "Synapgeek is an indie studio based in France, developing mobile puzzle game applications. This privacy policy applies to all Synapgeek applications and services, including Cerebrum (hereinafter \"the App\").\n\nFor any questions regarding the protection of your data, you can contact us at: privacy@synapgeek.com",
      },
      {
        title: "Data collected and sources",
        content:
          "We collect the following categories of data:\n\n**Account data**\nIf you create an account via Apple, Google, or Facebook: unique identifier, email address, display name, and profile photo (depending on the provider). You may also use the App without an account (anonymous mode).\n\n**Gameplay and progression data**\nScores, completion times, hints used, mistakes, stars earned, levels completed, difficulty level, attempts, best records, daily challenges, play streaks.\n\n**Virtual currency and customization data**\nCoin balance, in-app transaction history, unlocked avatars, monthly trophies, experience points (XP), league/ranking.\n\n**Device and usage data**\nDevice type, operating system version, language, anonymized usage data, diagnostics, error logs, app performance data.\n\n**Advertising data**\nAdvertising identifier (IDFA on iOS, with your consent via App Tracking Transparency; AAID on Android, see \"Advertising and tracking technologies\"), ad interactions, conversion events, attribution data via SKAdNetwork on iOS.\n\n**Transaction data**\nIn-app purchase and subscription history, processed by Apple via StoreKit 2 on iOS and by Google Play Billing on Android. Synapgeek does not collect or store your payment information.\n\n**Data we do NOT collect**\nWe do not collect any geolocation, health, contacts, photos, camera, calendar, or microphone data.",
      },
      {
        title: "Legal basis for processing",
        content:
          "In accordance with the General Data Protection Regulation (GDPR), we process your data on the following legal bases:\n\n- **Performance of a contract**: processing necessary to provide the service (account, progression, purchases, synchronization)\n- **Consent**: personalized advertising, advertising identifier (IDFA on iOS, AAID on Android), non-essential cookies and tracking technologies\n- **Legitimate interest**: first-party analytics, App improvement, fraud detection, security\n\nYou may withdraw your consent at any time through the App's privacy settings or your device settings.",
      },
      {
        title: "Purposes of data processing",
        content:
          "Your data is used to:\n\n- Provide, maintain, and improve the App and its features\n- Synchronize your progress across devices (if signed in)\n- Manage your account and preferences\n- Process your in-app purchases and subscriptions\n- Display advertisements (personalized with consent, or contextual)\n- Measure the effectiveness of our advertising campaigns (conversion measurement, with your consent)\n- Analyze aggregate usage to improve the user experience\n- Detect and prevent abuse, fraud, and technical issues\n- Manage leaderboards and the league system",
      },
      {
        title: "Advertising and tracking technologies",
        content:
          "The App displays advertisements served by Google AdMob. Users with an ad-free subscription or purchase do not see advertisements.\n\n**Advertising consent (EEA/UK/Switzerland)**\nFor users located in the European Economic Area, the United Kingdom, and Switzerland, a Consent Management Platform (CMP) is displayed at first launch. You can change your preferences at any time through the App's privacy settings.\n\n**App Tracking Transparency (ATT)**\nOn iOS 14.5 and later, the App requests your permission before accessing your advertising identifier (IDFA). If you decline, only contextual (non-personalized) ads are displayed. Declining tracking does not affect any App functionality.\n\n**Android advertising identifier (AAID)**\nOn Android, the App may access your Google Advertising ID (AAID) to display personalized ads — subject, for users in the EEA, the United Kingdom, and Switzerland, to the consent collected through the consent management platform described above. You can reset this identifier or opt out of personalization entirely at any time from your device settings (see \"Opting out of personalized ads\" below). Declining does not affect any App functionality.\n\n**SKAdNetwork (iOS only)**\nOn iOS, the App uses Apple's SKAdNetwork framework for advertising attribution. This mechanism does not allow you to be personally identified.\n\n**Opting out of personalized ads**\nYou can disable personalized ads at any time via:\n- Privacy settings within the App\n- iOS Settings > Privacy & Security > Tracking\n- Android Settings > Google > Ads\n- Purchasing an ad-free subscription or lifetime purchase",
      },
      {
        title: "Third-party sharing",
        content:
          "Your data may be shared with the following technical partners, strictly for the purposes described above:\n\n- **Google (Firebase Analytics, Firebase Crashlytics, Firebase Performance, Firebase Firestore, Firebase Auth, AdMob, Google Play Billing, Google Sign-In)** — for analytics, data storage, authentication, monitoring, advertising, and in-app purchases on Android. Privacy Policy: https://policies.google.com/privacy\n- **Apple (Sign in with Apple; StoreKit 2 and SKAdNetwork on iOS)** — for authentication on iOS and Android, and for in-app purchases and advertising attribution on iOS. Privacy Policy: https://www.apple.com/legal/privacy/\n- **Meta (Facebook SDK)** — for authentication via Facebook and, subject to your advertising consent, conversion measurement (purchase, account creation, first completed puzzle). Privacy Policy: https://www.facebook.com/privacy/policy/\n\nWe do not sell your personal data. We do not share your data with third-party artificial intelligence systems for model training purposes.",
      },
      {
        title: "International data transfers",
        content:
          "Some of our technical partners (Google, Meta, Apple) process data outside the European Economic Area, including in the United States. These transfers are governed by standard contractual clauses approved by the European Commission, in accordance with Articles 46 and 49 of the GDPR, to ensure an adequate level of protection for your data.",
      },
      {
        title: "Data retention",
        content:
          "We retain your data for the following periods:\n\n- **Analytics data**: maximum 14 months (Firebase Analytics default policy)\n- **Account and progression data**: as long as your account is active\n- **Transaction data**: we retain a minimal history of your purchases linked to your account (such as the product identifier, type, and date of purchase), for as long as your account is active. Billing records and your payment information are held exclusively by Apple and Google Play as the sellers of record; our accounting obligations cover their aggregated payout statements, which cannot identify you\n- **Error logs (Crashlytics)**: 90 days\n\nAfter account deletion, all your personal data is removed from our servers. Certain aggregated and anonymized data may be retained for statistical purposes.",
      },
      {
        title: "Data security",
        content:
          "We implement the following technical measures to protect your data:\n\n- Encryption of data in transit (HTTPS/TLS)\n- Firebase Security Rules (access limited to authenticated user)\n- Secure authentication via OAuth 2.0 protocols and nonce for Apple Sign-In\n- Encrypted local storage on device\n\nNo system is infallible. In the event of a data breach affecting your rights, we will notify you in accordance with applicable legal deadlines.",
      },
      {
        title: "Age restrictions",
        content:
          "The App is intended for users aged 13 and older. We do not knowingly collect personal data from individuals under 13 years of age.\n\nIf you are a parent or guardian and discover that your child under 13 has provided us with personal data, please contact us at privacy@synapgeek.com. We will delete such data promptly.",
      },
      {
        title: "Your rights",
        content:
          "**Rights under GDPR (EU/EEA)**\nIn accordance with the GDPR, you have the following rights:\n\n- **Access**: request a copy of your personal data\n- **Rectification**: correct inaccurate or incomplete data\n- **Erasure**: request deletion of your data\n- **Restriction**: request restriction of processing\n- **Objection**: object to processing based on legitimate interest\n- **Portability**: receive your data in a structured, machine-readable format\n- **Withdraw consent**: withdraw your consent at any time\n\nYou also have the right to lodge a complaint with a supervisory authority (in France: CNIL — www.cnil.fr).\n\n**Rights under CCPA/CPRA (California, United States)**\nIf you reside in California, you have the following rights:\n- Right to know what data is collected and how it is used\n- Right to request deletion of your data\n- Right to opt out of the \"sale\" or \"sharing\" of your data (we do not sell your data)\n- Right to non-discrimination for exercising your rights\n\n**Exercising your rights**\nTo exercise any of these rights, contact us at: privacy@synapgeek.com. We will respond within 30 days.",
      },
      {
        id: "account-deletion",
        title: "Account deletion",
        content:
          "You can delete your account directly in the App via Profile > Delete Account. This action is irreversible and results in the deletion of all your personal data from our servers: progression, purchases, avatars, and leaderboard entries.\n\nIf you no longer have access to the App, you may also request the deletion of your account by email at privacy@synapgeek.com.\n\nThis page is directly accessible at: https://synapgeek.com/en/account-deletion",
      },
      {
        title: "Changes to this policy",
        content:
          "We may update this privacy policy periodically. In the event of a material change, the update date at the top of this page will be revised. We encourage you to review this page regularly. Continued use of the App after any modification constitutes acceptance of the revised policy.",
      },
      {
        title: "Contact",
        content:
          "For any questions regarding this privacy policy or your personal data:\n\n**Synapgeek**\nEmail: privacy@synapgeek.com\nWebsite: https://synapgeek.com",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    lastUpdated: "Last updated: July 22, 2026",
    sections: [
      {
        title: "Acceptance of terms",
        content:
          "By downloading, installing, or using Synapgeek applications (hereinafter \"the App\"), you agree to these Terms of Use (hereinafter \"the Terms\"). If you do not agree to these Terms, please do not use the App.\n\nThe App is intended for users aged 13 and older. If you are between 13 and 18 years old, your parent or legal guardian must read and accept these Terms on your behalf.",
      },
      {
        title: "Service description",
        content:
          "Synapgeek develops and distributes mobile puzzle game applications. Cerebrum is a mobile application for iOS and Android, featuring four puzzle games: Sudoku, Crosswords, Word Search, and Cross Math.\n\nThe App includes:\n- Hundreds of puzzles across multiple difficulty levels\n- A progression system with stars, XP, and leaderboards\n- Daily challenges and play streaks\n- A virtual currency system (coins) and avatars\n- Optional in-app purchases and subscriptions\n- An ad-supported and ad-free mode",
      },
      {
        title: "License to use",
        content:
          "The App is licensed, not sold, to you. Synapgeek grants you a personal, limited, non-exclusive, non-transferable, and revocable license to use the App on any Apple or Android device that you own or control, in accordance with the usage rules of the store from which you downloaded it (App Store or Google Play).\n\nYou agree not to:\n- Copy, modify, decompile, or disassemble the App\n- Distribute, rent, lend, or sublicense the App\n- Use the App for unauthorized commercial purposes\n- Attempt to circumvent security measures or technical restrictions\n- Extract or collect data from the App by automated means (scraping, data mining, bots)",
      },
      {
        title: "User account",
        content:
          "You may use the App without creating an account (anonymous mode). If you choose to create an account via Apple, Google, or Facebook, you are responsible for maintaining the confidentiality of your credentials.\n\nCreating an account enables synchronization of your progress across devices and participation in leaderboards. You may only hold one active account.",
      },
      {
        title: "In-app purchases and subscriptions",
        content:
          "The App offers optional in-app purchases and subscriptions. All purchases are processed exclusively by your platform's app store: Apple (StoreKit 2) on iOS, Google (Google Play Billing) on Android.\n\n**Consumable purchases**\nCoin packs (virtual currency) may be purchased. Coins can be used within the App to unlock hints, avatars, and other features.\n\n**Non-consumable purchases**\nSome purchases are permanent, such as the \"Lifetime Ad-Free\" or \"Lifetime Premium\" plans.\n\n**Subscriptions**\nMonthly and annual subscriptions are available (Ad-Free, Premium). Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period. Subscription management and cancellation are done through your Apple account settings on iOS, or through Google Play > Payments & subscriptions on Android.\n\n**Refunds**\nPurchases are subject to the refund policy of the relevant platform. To request a refund, contact Apple at https://reportaproblem.apple.com (iOS) or Google Play at https://support.google.com/googleplay/answer/2479637 (Android).\n\nPrices are displayed in the App before any purchase and may vary by country.",
      },
      {
        title: "Virtual goods",
        content:
          "The App contains virtual goods, including coins (virtual currency), avatars, trophies, and experience points (XP).\n\nVirtual goods:\n- Have no monetary value outside the App\n- Are non-transferable, non-exchangeable, and non-refundable (except where required by law)\n- May be earned through gameplay, watching advertisements, or in-app purchases\n- Are tied to your account and cannot be transferred to another user\n\nSynapgeek reserves the right to modify the pricing, availability, or functionality of virtual goods at any time.",
      },
      {
        title: "Advertisements",
        content:
          "The App displays advertisements served by Google AdMob. Advertisements may include banners, interstitials, rewarded ads (which you choose to watch), and app-open ads.\n\nYou can remove advertisements by subscribing to an ad-free plan or making the lifetime ad-free purchase. Rewarded ads remain optionally accessible even for ad-free users.",
      },
      {
        title: "Intellectual property",
        content:
          "All content in the App — including but not limited to text, graphics, logos, icons, images, puzzle grids, sounds, interfaces, source code, and documentation — is the exclusive property of Synapgeek and is protected by French and international intellectual property laws.\n\nAny unauthorized reproduction, distribution, modification, adaptation, or use is strictly prohibited.\n\nIt is prohibited to use the App's content for training artificial intelligence or machine learning models, systematic screen capture of gameplay, data mining, or web scraping.",
      },
      {
        title: "User conduct",
        content:
          "By using the App, you agree not to:\n\n- Use the App in a manner contrary to applicable laws\n- Attempt to manipulate leaderboards, scores, or progression systems\n- Exploit bugs or vulnerabilities to gain an unfair advantage\n- Create fake accounts or impersonate another person\n- Interfere with the normal operation of the App or its servers\n\nSynapgeek reserves the right to suspend or delete any account in violation of these rules, without prior notice or compensation.\n\nYou further represent that you are not located in a country subject to a U.S. government embargo, nor on any U.S. government list of sanctioned persons.",
      },
      {
        title: "Limitation of liability",
        content:
          "The App is provided \"as is\" and \"as available.\" Synapgeek does not warrant that the App will operate without interruption, without errors, or that defects will be corrected.\n\nTo the fullest extent permitted by law, Synapgeek shall not be liable for:\n- Any indirect, incidental, special, or consequential damages\n- Loss of data, progress, or virtual goods\n- Any service interruption or App unavailability\n\nSynapgeek's total cumulative liability is limited to the amount you actually paid for the App in the 12 months preceding the claim.",
      },
      {
        title: "Termination and account deletion",
        content:
          "You may stop using the App at any time by uninstalling it.\n\nYou may delete your account at any time via Profile > Delete Account in the App. Deletion is irreversible and results in the permanent loss of all your data: progression, coins, avatars, trophies, and leaderboard rankings.\n\nSynapgeek reserves the right to terminate or suspend your access in the event of a violation of these Terms.\n\nThe sections relating to intellectual property, limitation of liability, and governing law shall survive any termination.",
      },
      {
        title: "Notice for Apple device users",
        content:
          "These Terms constitute an agreement between you and Synapgeek, not with Apple. Synapgeek, not Apple, is solely responsible for the App and its content.\n\nApple has no obligation to provide maintenance or support services for the App.\n\nIn the event that the App fails to conform to any applicable warranty, you may notify Apple, which may refund the purchase price, if applicable. Apple has no other warranty obligation.\n\nApple is not responsible for addressing any claims by you or any third party relating to the App or your use of the App.\n\nApple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.",
      },
      {
        title: "Governing law and disputes",
        content:
          "These Terms are governed by French law, without regard to its conflict of law provisions.\n\nAny dispute relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts of Paris, France.\n\nIf any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.",
      },
      {
        title: "Changes to terms",
        content:
          "Synapgeek reserves the right to modify these Terms at any time. In the event of a material change, the update date at the top of this document will be revised.\n\nContinued use of the App after any modification constitutes acceptance of the revised Terms.",
      },
      {
        title: "Contact",
        content:
          "For any questions regarding these Terms:\n\n**Synapgeek**\nEmail: contact@synapgeek.com\nWebsite: https://synapgeek.com",
      },
    ],
  },
  legal: {
    title: "Legal Notice",
    lastUpdated: "Last updated: June 4, 2026",
    sections: [
      {
        title: "Publisher",
        content:
          "This website is published by:\n\n**Synapgeek**, a French simplified joint-stock company (société par actions simplifiée — SAS) with a share capital of €1,000.\nRegistered office: 185 chemin des Brosses, 69620 Frontenas, France.\nRegistered with the Villefranche-Tarare Trade and Companies Register (RCS) under number **102 429 826**.\nSIRET (registered office): 102 429 826 00013.\nAPE/NAF code: 62.01Z (Computer programming).\nIntra-Community VAT number: FR86 102 429 826.\nEmail: contact@synapgeek.com",
      },
      {
        title: "Publication director",
        content:
          "The publication director is Adrien Monte, in his capacity as President of Synapgeek.",
      },
      {
        title: "Hosting provider",
        content:
          "This website is hosted by:\n\n**Vercel Inc.**\n440 N Barranca Avenue #4133, Covina, CA 91723, United States.\nWebsite: https://vercel.com",
      },
      {
        title: "Intellectual property",
        content:
          "All elements of this website — including but not limited to text, graphics, logos, icons, images, and the \"Synapgeek\" and \"Cerebrum\" trademarks — are the exclusive property of Synapgeek and are protected by French and international intellectual property laws.\n\nAny reproduction, representation, modification, or exploitation, in whole or in part, of these elements without Synapgeek's prior written consent is prohibited and constitutes infringement.",
      },
      {
        title: "Personal data and cookies",
        content:
          "The processing of your personal data and the use of cookies and analytics technologies are described in detail in our Privacy Policy: https://synapgeek.com/en/privacy\n\nIn accordance with the General Data Protection Regulation (GDPR) and the French Data Protection Act, you have rights of access, rectification, erasure, objection, and portability over your data. To exercise them: privacy@synapgeek.com\n\nYou may also lodge a complaint with the French data protection authority (CNIL): https://www.cnil.fr",
      },
      {
        title: "Contact",
        content:
          "For any questions regarding this website or this legal notice:\n\n**Synapgeek**\nEmail: contact@synapgeek.com\nWebsite: https://synapgeek.com",
      },
    ],
  },
};

export default en;
