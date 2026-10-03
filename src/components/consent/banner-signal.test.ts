import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SG_CONSENT_BANNER_EVENT,
  publishBannerOpen,
  readBannerOpen,
  readBannerOpenOnServer,
  subscribeBannerOpen,
} from "./banner-signal";

describe("signal d'ouverture du bandeau de consentement", () => {
  beforeEach(() => {
    vi.stubGlobal("window", new EventTarget());
    vi.stubGlobal("document", { documentElement: { dataset: {} } });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("est fermé tant que rien n'a été publié, y compris au rendu serveur", () => {
    expect(readBannerOpen()).toBe(false);
    expect(readBannerOpenOnServer()).toBe(false);
  });

  it("pose data-consent-banner=open à l'ouverture et le retire à la fermeture", () => {
    publishBannerOpen(true);
    expect(document.documentElement.dataset.consentBanner).toBe("open");
    expect(readBannerOpen()).toBe(true);

    publishBannerOpen(false);
    expect("consentBanner" in document.documentElement.dataset).toBe(false);
    expect(readBannerOpen()).toBe(false);
  });

  it("prévient les abonnés à chaque changement, jusqu'au désabonnement", () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeBannerOpen(onChange);

    publishBannerOpen(true);
    publishBannerOpen(false);
    expect(onChange).toHaveBeenCalledTimes(2);

    unsubscribe();
    publishBannerOpen(true);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("émet l'événement sg-consent:banner", () => {
    const listener = vi.fn();
    window.addEventListener(SG_CONSENT_BANNER_EVENT, listener);
    publishBannerOpen(true);
    expect(SG_CONSENT_BANNER_EVENT).toBe("sg-consent:banner");
    expect(listener).toHaveBeenCalledOnce();
  });
});
