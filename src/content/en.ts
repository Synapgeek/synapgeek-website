import type { Dictionary } from "./types";

const en: Dictionary = {
  common: {
    siteName: "Synapgeek",
    tagline: "Indie mobile game studio",
    nav: {
      home: "Home",
      privacy: "Privacy",
      terms: "Terms",
      features: "Games",
      about: "About",
      faq: "FAQ",
      contact: "Contact",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Synapgeek. All rights reserved.`,
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      legalNotice: "Legal Notice",
      contact: "Contact",
      manageCookies: "Manage cookies",
      productHeading: "Product",
      legalHeading: "Legal",
      contactHeading: "Contact",
      features: "Features",
      writeToUs: "Write to us",
      madeWith: "Made with",
      inFrance: "in France",
    },
    consent: {
      title: "Your choice on audience measurement",
      body: 'We use Google Analytics (audience measurement cookies) to understand how this site is used. Depending on your country, this measurement either waits for your consent or is on by default: accept or refuse it here, and change your mind at any time via "Manage cookies". This website shows no ads.',
      learnMore: "Learn more",
      accept: "Accept",
      refuse: "Refuse",
    },
    languageSwitch: "Français",
    languageSwitchLocale: "fr",
  },
  landing: {
    meta: {
      title: "Cerebrum: Offline Puzzle Games, No Wi-Fi Needed | Synapgeek",
      description:
        "Cerebrum is an offline puzzle games app for iPhone, iPad and Android by Synapgeek: Sudoku, Pandoku (Star Battle), Pixel Art (nonograms) and more.",
    },
    hero: {
      badge: "Now on iOS and Android",
      title: "Train your brain, one puzzle at a time",
      subtitle:
        "Cerebrum is an offline puzzle games app for iPhone, iPad and Android, made by Synapgeek. Sudoku, Pandoku (Star Battle), Minesweeper, Pixel Art (nonograms), Cross Math (a math crossword), Crossword, Word Search, Trace (a one-line path puzzle), Maze and Arrow Maze (an arrow puzzle): play them all without Wi-Fi, every day.",
      cta: "Download Cerebrum",
      ctaSecondary: "Learn more",
      store: {
        availableNow: "Available now",
        appStoreLabel: "Download on the App Store",
        googlePlayLabel: "Get it on Google Play",
      },
      slider: {
        carouselLabel: "Cerebrum app screenshots",
        slideLabel: "Slide {index} of {total}",
        controlsLabel: "Slide controls",
        goToSlide: "Go to slide {index}",
        alts: {
          home: "Cerebrum home screen with the Daily Challenge, the themes and game cards including Sudoku, Word Search, Pandoku and Minesweeper",
          pandoku:
            "Cerebrum Pandoku, a Star Battle logic puzzle: a colored region grid with pandas placed one per row, column and region",
          pixelart:
            "Cerebrum Pixel Art, a nonogram solved to reveal a pixel art panda",
          daily:
            "Cerebrum Daily Challenge calendar with completed days marked by stars",
          progression:
            "Cerebrum Sudoku level path with a difficulty selector and levels rated with stars",
        },
      },
    },
    stats: {
      items: [
        { value: "2", label: "Platforms" },
        { value: "0", label: "Wi-Fi needed to play" },
        { value: "16", label: "Languages" },
        { value: "Free", label: "Download" },
      ],
    },
    features: {
      title: "One brain, every kind of puzzle",
      subtitle:
        "Logic and numbers, words, paths: each family of games exercises a different skill. Combine them for a complete workout.",
      items: [
        {
          id: "sudoku",
          title: "Sudoku",
          description:
            "The classic 9×9 grid, solved by pure deduction. Difficulty levels from Easy to Elite, with notes and hints.",
        },
        {
          id: "pandoku",
          title: "Pandoku",
          description:
            "A Star Battle logic puzzle. Place one panda in every row, column and region, with no two pandas touching, not even diagonally.",
        },
        {
          id: "minesweeper",
          title: "Minesweeper",
          description:
            "The classic. Use the numbers to reveal every safe cell and flag every mine.",
        },
        {
          id: "pixelart",
          title: "Pixel Art",
          description:
            "Nonograms, also known as hanjie. Fill in cells from the row and column clues to reveal a hidden picture.",
        },
        {
          id: "crossmath",
          title: "Cross Math",
          description:
            "A math crossword. Every “word” in the grid is an equation, to complete with numbers from the pool.",
        },
        {
          id: "crossword",
          title: "Crossword",
          description:
            "Clue-based grids to expand your vocabulary and general knowledge. Available in English and French only.",
        },
        {
          id: "wordsearch",
          title: "Word Search",
          description:
            "Swipe to find the words hidden in the grid. Available in English and French only.",
        },
        {
          id: "trace",
          title: "Trace",
          description:
            "A one-line path puzzle. Draw a single path through every cell, hitting the numbers in order.",
        },
        {
          id: "maze",
          title: "Maze",
          description:
            "Guide your firefly to the exit and collect crystals along the way.",
        },
        {
          id: "arrowmaze",
          title: "Arrow Maze",
          description:
            "A relaxing arrow puzzle. Tap an arrow to slide it off the board when its way is clear, until the board is empty.",
        },
      ],
    },
    about: {
      title: "Built by enthusiasts",
      description:
        "Synapgeek is the independent French studio that designs and publishes Cerebrum, available on the App Store and Google Play. We believe the best games combine elegance, challenge, and pure enjoyment.",
      values: [
        {
          title: "Solver-checked puzzles",
          description:
            "Our puzzles are generated with our own tools, then automatically checked by solvers before they reach the app.",
        },
        {
          title: "Your data, your choice",
          description:
            "On iPhone and iPad, no ad tracking without your permission; in the EEA, the UK and Switzerland, you are asked for consent before any personalized ads. You can delete your account from the app at any time.",
        },
        {
          title: "Made in France",
          description:
            "Designed and developed in France by Synapgeek, an independent studio.",
        },
      ],
    },
    faq: {
      title: "Cerebrum FAQ",
      subtitle:
        "Pricing, offline play, supported devices, accounts: what you need to know before downloading the app.",
      items: [
        {
          question: "What games are in Cerebrum?",
          answer:
            "Cerebrum is an offline puzzle games app for iPhone, iPad and Android, made by Synapgeek. Logic and number puzzles: Sudoku, Pandoku (a Star Battle logic puzzle), Minesweeper, Pixel Art (nonograms) and Cross Math (a math crossword). Word games: Crossword and Word Search, in English and French only. Path puzzles: Trace (a one-line path puzzle), Maze and Arrow Maze (an arrow puzzle). Every game has several difficulty levels, and the app adds a daily challenge, streaks and level-by-level progression.",
        },
        {
          question: "Is Cerebrum free?",
          answer:
            "Yes, Cerebrum is free to download and play on the App Store and Google Play, and no game or difficulty level is locked behind a purchase. It is free with ads, and offers optional in-app purchases (gem packs, and the Movies, Cooking and Travel theme packs for themed crosswords and word searches) and a Premium subscription.",
        },
        {
          question: "Does Cerebrum have ads, and how do I remove them?",
          answer:
            "Yes. Cerebrum is free and supported by ads: a banner during play and ads between some games. Rewarded ads are always optional: you choose to watch one for gems, a hint or a second chance. A weekly, monthly or yearly Premium subscription means no forced ads: it removes the banner and the ads between games. It also adds infinite lives, 5 free hints a day in each game, your first mistake forgiven in every puzzle, free daily gems and double gems after every win. Gem packs and the theme packs are in-app purchases and are not included in Premium.",
        },
        {
          question: "Can I play Cerebrum offline, without Wi-Fi?",
          answer:
            "Yes, every Cerebrum game works without an internet connection, daily challenge and streak included: all the puzzles are already in the app and your progress is saved on your device. You still need a connection to sync your progress, make a purchase, sign in to an account and load ads.",
        },
        {
          question: "Which devices does Cerebrum run on?",
          answer:
            "Cerebrum is available for iPhone and iPad (iOS 17 or later) on the App Store, and for Android devices (Android 8.0 or later) on Google Play. The app is played in portrait mode.",
        },
        {
          question: "Do I need an account to play Cerebrum?",
          answer:
            "No, you can play Cerebrum without creating an account: an anonymous session starts automatically the first time you open the app. You can sign in with Apple, Google or Facebook later if you wish.",
        },
        {
          question: "Does Cerebrum sync my progress across devices?",
          answer:
            "Yes, once you sign in to Cerebrum with an Apple, Google or Facebook account: your progress is saved online and follows you to your other devices signed in to the same account. Without a signed-in account, progress stays tied to the device and cannot be recovered if you switch devices.",
        },
        {
          question: "What languages is Cerebrum available in?",
          answer:
            "Cerebrum is available in 16 languages, on both iOS and Android. Crossword and Word Search exist in French and English only, so they are offered when the app is set to one of those two languages.",
        },
        {
          question: "How do I delete my Cerebrum account?",
          answer:
            "In Cerebrum, open Profile and tap Delete Account: once you confirm, your account and its data (progress, achievements, streak history, synced data) are deleted. If you can no longer access the app, the steps to follow are described in our privacy policy.",
          link: {
            text: "our privacy policy",
            path: { page: "privacy", hash: "account-deletion" },
          },
        },
        {
          question: "Who makes Cerebrum?",
          answer:
            "Cerebrum is published by Synapgeek SAS, an independent French mobile game studio based in Frontenas, France. For any question about the app, the contact form on synapgeek.com also serves as customer support.",
        },
      ],
    },
    cta: {
      title: "Ready to train your brain?",
      subtitle:
        "Cerebrum is out now on iOS and Android. Puzzle games in one app.",
      cta: "Download for free",
      note: "Free with ads. Premium and in-app purchases are optional.",
      store: {
        availableNow: "Available now",
        appStoreLabel: "Download on the App Store",
        googlePlayLabel: "Get it on Google Play",
      },
    },
    contact: {
      title: "Got a question?",
      subtitle: "Drop us a line and we'll get back to you as soon as possible.",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        topicLabel: "Topic",
        topicPlaceholder: "Choose a topic",
        topics: [
          { value: "support", label: "Technical issue or bug" },
          { value: "purchases", label: "Purchases, subscriptions, refunds" },
          { value: "account", label: "Account and personal data" },
          { value: "feedback", label: "Suggestion or feedback on a game" },
          { value: "press", label: "Press and partnerships" },
          { value: "other", label: "Other" },
        ],
        submit: "Send message",
        sending: "Sending...",
        successTitle: "Message sent!",
        successBody: "We'll get back to you as soon as possible.",
        error: "An error occurred. Please try again or contact us directly.",
        unavailable:
          "The form is temporarily unavailable. Please write to us directly at contact@synapgeek.com.",
      },
    },
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: September 12, 2026",
    updatedAt: "2026-09-12",
    sections: [
      {
        title: "Who we are",
        content:
          'Synapgeek is an indie studio based in France, developing mobile puzzle game applications. This privacy policy applies to all Synapgeek applications and services, including Cerebrum (hereinafter "the App").\n\nFor any questions regarding the protection of your data, you can contact us at: privacy@synapgeek.com',
      },
      {
        title: "Data collected and sources",
        content:
          'We collect the following categories of data:\n\n**Account data**\nIf you create an account via Apple, Google, or Facebook: unique identifier, email address, display name, and profile photo (depending on the provider). You may also use the App without an account (anonymous mode).\n\n**Gameplay and progression data**\nScores, completion times, hints used, mistakes, stars earned, levels completed, difficulty level, attempts, best records, daily challenges, play streaks.\n\n**Virtual currency and customization data**\nGem balance, in-app transaction history, unlocked avatars, monthly trophies, experience points (XP), league/ranking.\n\n**Device and usage data**\nDevice type, operating system version, language, anonymized usage data, diagnostics, error logs, app performance data.\n\n**Notification data**\nTo send you notifications and update Live Activities on iOS, we associate the following with your device: your FCM (Firebase Cloud Messaging) token, ActivityKit tokens (push-to-start and Live Activity updates) on iOS, your time zone, language, App version, Live Activities activation status, and platform (iOS or Android). On Android, this feature relies on the notification permission and Firebase Cloud Messaging. This data is deleted along with your account.\n\n**Advertising data**\nAdvertising identifier (IDFA on iOS, with your consent via App Tracking Transparency; AAID on Android, see "Advertising and tracking technologies"), ad interactions, conversion events, attribution data via SKAdNetwork on iOS. Our advertising partner (Google AdMob) also derives an approximate location from your IP address for ad targeting purposes, and our consent management platform (CMP) uses this approximate location to determine whether you are located in the European Economic Area, the United Kingdom, or Switzerland.\n\n**Transaction data**\nIn-app purchase and subscription history, processed by Apple via StoreKit 2 on iOS and by Google Play Billing on Android. Synapgeek does not collect or store your payment information.\n\n**Data we do NOT collect**\nThe App never requests access to your location and does not use any GPS data. An approximate location is, however, derived from your IP address by our advertising partner, as described under "Advertising data" above and "Advertising and tracking technologies" below. We do not otherwise collect any health, contacts, photos, camera, calendar, or microphone data.',
      },
      {
        title: "Legal basis for processing",
        content:
          'In accordance with the General Data Protection Regulation (GDPR), we process your data on the following legal bases.\n\n**For the App.** We rely on performance of a contract for processing necessary to provide the service (account, progression, purchases, synchronization), on your consent for personalized advertising, the advertising identifier (IDFA on iOS, AAID on Android), and non-essential cookies and tracking technologies, and on our legitimate interest for first-party analytics, App improvement, fraud detection, and security.\n\n**For the synapgeek.com website.** We rely on your consent for Google Analytics 4 audience measurement, where your agreement is required (see the "The synapgeek.com website" section), on our legitimate interest for cookie-free measurement of traffic and performance via Vercel Analytics and Vercel Speed Insights, reCAPTCHA protection of the contact form, and Google Analytics 4 audience measurement active by default outside the zones where your agreement is required — you can object to it at any time via the consent banner or "Manage cookies" —, and on pre-contractual measures or legitimate interest, depending on your message, for handling messages sent through the contact form, in order to reply to you.\n\nYou may withdraw your consent at any time through the App\'s privacy settings, your device settings, or, for the website, the banner accessible via "Manage cookies".',
      },
      {
        title: "Purposes of data processing",
        content:
          "Your data is used to:\n\n- Provide, maintain, and improve the App and its features\n- Synchronize your progress across devices (if signed in)\n- Manage your account and preferences\n- Process your in-app purchases and subscriptions\n- Display advertisements (personalized with consent, or contextual)\n- Measure the effectiveness of our advertising campaigns (conversion measurement, with your consent)\n- Analyze aggregate usage to improve the user experience\n- Detect and prevent abuse, fraud, and technical issues\n- Manage leaderboards and the league system",
      },
      {
        title: "Advertising and tracking technologies",
        content:
          'The App displays advertisements served by Google AdMob. Users with a Premium subscription, or a legacy "Ad-Free" subscription, do not see forced advertisements (banners and interstitials); rewarded ads remain available if they choose to watch them.\n\n**Advertising consent (EEA/UK/Switzerland)**\nFor users located in the European Economic Area, the United Kingdom, and Switzerland, a Consent Management Platform (CMP) is displayed at first launch. You can change your preferences at any time through the App\'s privacy settings.\n\n**App Tracking Transparency (ATT)**\nOn iOS 14.5 and later, the App requests your permission before accessing your advertising identifier (IDFA). If you decline, ads are not personalized using your advertising identifier. Declining tracking does not affect any App functionality.\n\n**Android advertising identifier (AAID)**\nOn Android, the App may access your Google Advertising ID (AAID) to display personalized ads — subject, for users in the EEA, the United Kingdom, and Switzerland, to the consent collected through the consent management platform described above. You can reset this identifier or opt out of personalization entirely at any time from your device settings (see "Opting out of personalized ads" below). Declining does not affect any App functionality.\n\n**SKAdNetwork (iOS only)**\nOn iOS, the App uses Apple\'s SKAdNetwork framework for advertising attribution. This mechanism does not allow you to be personally identified.\n\n**Opting out of personalized ads**\nYou can disable personalized ads at any time via:\n- Privacy settings within the App\n- iOS Settings > Privacy & Security > Tracking\n- Android Settings > Google > Ads\n- The Premium subscription, which removes forced ads (banners and interstitials) — rewarded ads remain available if you choose to watch them (see the Terms of Use)',
      },
      {
        id: "website",
        title: "The synapgeek.com website",
        content:
          "This section covers the synapgeek.com website itself, as distinct from the App described elsewhere in this policy.\n\n**Account**\nThe website has no sign-up or sign-in: browsing it never requires an email address or password.\n\n**Vercel audience measurement**\nWe use Vercel Analytics and Vercel Speed Insights to measure the site's traffic and performance. These tools set no cookies and only produce aggregated statistics, with no individual identifier.\n\n**Google Analytics 4**\nWe use Google Analytics 4 to understand how the site is used: pages viewed, homepage sections displayed, language changes, clicks through to the App Store and Google Play, and contact form submissions (with the chosen subject). A banner lets you accept or refuse this audience measurement; it stays displayed until you make a choice. Your choice is then remembered for 6 months as a simple indicator in your browser's local storage — never a cookie for the choice itself — and you can change it at any time via \"Manage cookies\" in the footer. In the European Economic Area, the United Kingdom, Switzerland, the EU's outermost regions, and a few associated territories, the measurement cookie (_ga and _ga_*, kept for a maximum of 13 months) is only set if you accepted; if you refuse, or before you respond, no measurement cookie is set. Outside these territories, measurement is active by default unless you refuse through the same banner, with the same measurement cookie kept for a maximum of 13 months. Regardless of your country, as long as cookie-based measurement is not active — before you consent in the territories listed above, or after a refusal anywhere — cookie-free measurement signals with no persistent identifier (page viewed, action taken, timestamp, browser type) may nonetheless be sent to Google, which receives your IP address in the process and uses these signals in aggregate to model traffic. You can also opt out using Google Analytics' browser opt-out add-on, a content blocker, or by writing to privacy@synapgeek.com. Google Analytics browser opt-out add-on: https://tools.google.com/dlpage/gaoptout This website does not display any advertising and does not use this data for advertising purposes: advertising consent signals (ad_storage, ad_user_data, ad_personalization) remain refused at all times. Google's privacy policy: https://policies.google.com/privacy\n\n**Contact form**\nIf you use the contact form, we collect your name, email address, chosen subject, and message, solely to reply to you. This information is sent to us by email through our business mailbox and is not kept in a separate database. The form is protected by reCAPTCHA, a Google service whose script only loads once you interact with the form (click, tap, or focusing a field).",
      },
      {
        title: "Third-party sharing",
        content:
          'Your data may be shared with the following technical partners, strictly for the purposes described above.\n\n**For the App.** We share data with Google (Firebase Analytics, Firebase Crashlytics, Firebase Performance, Firebase Firestore, Firebase Auth, Firebase Cloud Messaging, AdMob, Google Play Billing, Google Sign-In) for analytics, data storage, authentication, monitoring, notifications, advertising, and in-app purchases on Android: Privacy Policy https://policies.google.com/privacy\n\nWe also share data with Apple (Sign in with Apple; StoreKit 2 and SKAdNetwork on iOS) for authentication on iOS and Android, and for in-app purchases and advertising attribution on iOS: Privacy Policy https://www.apple.com/legal/privacy/\n\nFinally, we share data with Meta (Facebook SDK) for authentication via Facebook and, subject to your advertising consent, conversion measurement (App launch, purchase, account creation, first completed puzzle): Privacy Policy https://www.facebook.com/privacy/policy/\n\n**For the synapgeek.com website.** We share data with Google (Google Analytics 4, reCAPTCHA) for audience measurement on the site, according to the choice you make through the banner described in the "The synapgeek.com website" section, and to protect the contact form against automated submissions: Privacy Policy https://policies.google.com/privacy\n\nWe also share data with Vercel Inc., our hosting provider, which processes the technical requests needed to serve the site\'s pages, as well as Vercel Analytics and Vercel Speed Insights (cookie-free measurement of traffic and performance): Privacy Policy https://vercel.com/legal/privacy-policy\n\nWe do not sell your personal data. We do not share your data with third-party artificial intelligence systems for model training purposes.',
      },
      {
        title: "International data transfers",
        content:
          "Some of our technical partners (Google, Meta, Apple, Vercel Inc.) process data outside the European Economic Area, including in the United States — this is the case for Vercel Inc., our hosting provider, based in the United States. These transfers are governed by standard contractual clauses approved by the European Commission, in accordance with Articles 46 and 49 of the GDPR, to ensure an adequate level of protection for your data.",
      },
      {
        title: "Data retention",
        content:
          "We retain your data for the following periods:\n\n- **Analytics data**: maximum 14 months\n- **Account and progression data**: as long as your account is active\n- **Transaction data**: we retain a minimal history of your purchases linked to your account (such as the product identifier, type, and date of purchase), for as long as your account is active. Billing records and your payment information are held exclusively by Apple and Google Play as the sellers of record; our accounting obligations cover their aggregated payout statements, which cannot identify you\n- **Error logs (Crashlytics)**: 90 days\n\nAfter account deletion, all your personal data is removed from our servers. Certain aggregated and anonymized data may be retained for statistical purposes.",
      },
      {
        title: "Data security",
        content:
          "We implement the following technical measures to protect your data:\n\n- Encryption of data in transit (HTTPS/TLS)\n- Firebase Security Rules (access limited to authenticated user)\n- Secure authentication via OAuth 2.0 protocols and nonce for Apple Sign-In\n- Data stored locally on the device, protected by the operating system's encryption (iOS and Android encrypt app data by default on a device locked with a passcode)\n\nNo system is infallible. In the event of a data breach affecting your rights, we will notify you in accordance with applicable legal deadlines.",
      },
      {
        title: "Age restrictions",
        content:
          "The App is intended for users aged 13 and older. We do not knowingly collect personal data from individuals under 13 years of age.\n\nIf you are a parent or guardian and discover that your child under 13 has provided us with personal data, please contact us at privacy@synapgeek.com. We will delete such data promptly.",
      },
      {
        title: "Your rights",
        content:
          '**Rights under GDPR (EU/EEA)**\nIn accordance with the GDPR, you have the following rights:\n\n- **Access**: request a copy of your personal data\n- **Rectification**: correct inaccurate or incomplete data\n- **Erasure**: request deletion of your data\n- **Restriction**: request restriction of processing\n- **Objection**: object to processing based on legitimate interest\n- **Portability**: receive your data in a structured, machine-readable format\n- **Withdraw consent**: withdraw your consent at any time\n\nYou also have the right to lodge a complaint with a supervisory authority (in France: CNIL — www.cnil.fr).\n\n**Rights under CCPA/CPRA (California, United States)**\nIf you reside in California, you have the following rights:\n- Right to know what data is collected and how it is used\n- Right to request deletion of your data\n- Right to opt out of the "sale" or "sharing" of your data (we do not sell your data)\n- Right to non-discrimination for exercising your rights\n\n**Exercising your rights**\nTo exercise any of these rights, contact us at: privacy@synapgeek.com. We will respond within 30 days.',
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
    lastUpdated: "Last updated: October 1, 2026",
    updatedAt: "2026-10-01",
    sections: [
      {
        title: "Acceptance of terms",
        content:
          'By downloading, installing, or using Synapgeek applications (hereinafter "the App"), you agree to these Terms of Use (hereinafter "the Terms"). If you do not agree to these Terms, please do not use the App.\n\nThe App is intended for users aged 13 and older. If you are between 13 and 18 years old, your parent or legal guardian must read and accept these Terms on your behalf.',
      },
      {
        title: "Service description",
        content:
          "Synapgeek develops and distributes mobile puzzle game applications. Cerebrum is a mobile puzzle and brain game application for iOS and Android.\n\nThe App offers puzzles across multiple difficulty levels, a progression system based on stars, XP and leagues, a daily challenge and play streaks, as well as a virtual currency (gems) and avatars.\n\nThe App is free to download and supported by advertising. It also offers optional in-app purchases and a Premium subscription, which removes forced advertisements (banners and interstitials); rewarded ads remain optional and available if you choose to watch them.",
      },
      {
        title: "License to use",
        content:
          "The App is licensed, not sold, to you. Synapgeek grants you a personal, limited, non-exclusive, non-transferable, and revocable license to use the App on any Apple or Android device that you own or control, in accordance with the usage rules of the store from which you downloaded it (App Store or Google Play).\n\nYou agree not to:\n- Copy, modify, decompile, or disassemble the App\n- Distribute, rent, lend, or sublicense the App\n- Use the App for unauthorized commercial purposes\n- Attempt to circumvent security measures or technical restrictions\n- Extract or collect data from the App by automated means (scraping, data mining, bots)",
      },
      {
        title: "User account",
        content:
          "You may use the App without creating an account (anonymous mode). If you choose to create an account via Apple, Google, or Facebook, you are responsible for maintaining the confidentiality of your credentials.\n\nCreating an account enables synchronization of your progress across devices. You may only hold one active account.",
      },
      {
        title: "In-app purchases and subscriptions",
        content:
          'The App offers optional in-app purchases and subscriptions. All purchases are processed exclusively by your platform\'s app store: Apple (StoreKit 2) on iOS, Google (Google Play Billing) on Android.\n\n**Consumable purchases**\nGem packs (virtual currency) may be purchased. Gems can be used within the App to unlock hints, avatars, and other features.\n\n**Non-consumable purchases**\nSome purchases are permanent: themed Crossword and Word Search packs (Movies, Cooking, Travel) and a one-time gem starter pack, available once per user.\n\n**Subscriptions**\nA Premium subscription is available on a weekly, monthly, or annual basis. Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period. Some users hold a legacy "Ad-Free" subscription purchased before it was discontinued: it remains active until cancelled, but is no longer available for purchase. Subscription management and cancellation are done through your Apple account settings on iOS, or through Google Play > Payments & subscriptions on Android.\n\n**Refunds**\nPurchases are subject to the refund policy of the relevant platform. To request a refund, contact Apple at https://reportaproblem.apple.com (iOS) or Google Play at https://support.google.com/googleplay/answer/2479637 (Android).\n\nPrices are displayed in the App before any purchase and may vary by country.',
      },
      {
        title: "Virtual goods",
        content:
          "The App contains virtual goods, including gems (virtual currency), avatars, trophies, and experience points (XP).\n\nVirtual goods:\n- Have no monetary value outside the App\n- Are non-transferable, non-exchangeable, and non-refundable (except where required by law)\n- May be earned through gameplay, watching advertisements, or in-app purchases\n- Are tied to your account and cannot be transferred to another user\n\nSynapgeek reserves the right to modify the pricing, availability, or functionality of virtual goods at any time.",
      },
      {
        title: "Advertisements",
        content:
          'The App displays advertisements served by Google AdMob. Advertisements include banners, interstitials, and rewarded ads (which you choose to watch).\n\nYou can remove forced advertisements (banners and interstitials) by subscribing to a Premium plan. Rewarded ads remain optionally accessible even with an active subscription. Users who still hold a legacy "Ad-Free" subscription purchased before it was discontinued also continue to see no forced advertisements.',
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
          'The App is provided "as is" and "as available." Synapgeek does not warrant that the App will operate without interruption, without errors, or that defects will be corrected.\n\nTo the fullest extent permitted by law, Synapgeek shall not be liable for:\n- Any indirect, incidental, special, or consequential damages\n- Loss of data, progress, or virtual goods\n- Any service interruption or App unavailability\n\nSynapgeek\'s total cumulative liability is limited to the amount you actually paid for the App in the 12 months preceding the claim.',
      },
      {
        title: "Termination and account deletion",
        content:
          "You may stop using the App at any time by uninstalling it.\n\nYou may delete your account at any time via Profile > Delete Account in the App. Deletion is irreversible and results in the permanent loss of all your data: progression, gems, avatars, trophies, and leaderboard rankings.\n\nSynapgeek reserves the right to terminate or suspend your access in the event of a violation of these Terms.\n\nThe sections relating to intellectual property, limitation of liability, and governing law shall survive any termination.",
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
    updatedAt: "2026-06-04",
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
          'All elements of this website — including but not limited to text, graphics, logos, icons, images, and the "Synapgeek" and "Cerebrum" trademarks — are the exclusive property of Synapgeek and are protected by French and international intellectual property laws.\n\nAny reproduction, representation, modification, or exploitation, in whole or in part, of these elements without Synapgeek\'s prior written consent is prohibited and constitutes infringement.',
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
  // /cerebrum/play reste en français quelle que soit la locale (voir src/app/cerebrum/play/page.tsx) ;
  // ces clés existent ici pour la complétude du type Dictionary.
  play: {
    title: "Télécharger Cerebrum",
    chooseStore: "Choisissez votre store pour installer l'application.",
  },
};

export default en;
