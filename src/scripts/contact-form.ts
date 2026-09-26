/**
 * Kontaktformular: POST an Endpoint (Standard /api/contact.php auf Plesk).
 * Ohne Endpoint öffnet sich der Mailclient als Fallback.
 */

const form = document.querySelector<HTMLFormElement>("[data-contact-form]");

if (form) {
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = form.querySelector<HTMLElement>("[data-submit-label]");
  const endpoint = form.dataset.endpoint?.trim();
  const mailto = form.dataset.mailto ?? "";
  const turnstileHost = form.querySelector<HTMLElement>("[data-turnstile]");
  const turnstileSlot = form.querySelector<HTMLElement>("[data-turnstile-slot]");
  let turnstileSiteKey = turnstileHost?.dataset.sitekey?.trim() ?? "";
  const turnstileConfigUrl = turnstileHost?.dataset.config?.trim() ?? "";
  let turnstileWidgetId = "";
  let turnstileLoad: Promise<void> | null = null;
  let siteKeyLookup: Promise<string> | null = null;

  type TurnstileApi = {
    render: (
      element: HTMLElement,
      options: {
        sitekey: string;
        theme: "dark";
        language: "de";
        appearance: "always";
        action: "contact";
        callback: () => void;
        "error-callback": () => void;
        "expired-callback": () => void;
      },
    ) => string;
    reset: (widgetId?: string) => void;
    getResponse: (widgetId?: string) => string | undefined;
  };

  const turnstileApi = () =>
    (window as Window & { turnstile?: TurnstileApi }).turnstile;

  const resolveSiteKey = () => {
    if (turnstileSiteKey) return Promise.resolve(turnstileSiteKey);
    if (!turnstileConfigUrl) return Promise.resolve("");
    if (siteKeyLookup) return siteKeyLookup;

    siteKeyLookup = fetch(turnstileConfigUrl, {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) return "";
        const payload = (await response.json()) as { sitekey?: unknown };
        const key = typeof payload.sitekey === "string" ? payload.sitekey.trim() : "";
        if (!/^0x[A-Za-z0-9_-]{16,200}$/.test(key)) return "";
        turnstileSiteKey = key;
        return key;
      })
      .catch(() => "");

    return siteKeyLookup;
  };

  const ensureTurnstile = () => {
    if (!turnstileHost) return Promise.resolve();
    if (turnstileLoad) return turnstileLoad;

    turnstileLoad = resolveSiteKey()
      .then((sitekey) => {
        if (!sitekey) return;
        turnstileSlot?.classList.remove("hidden");
        return new Promise<void>((resolve, reject) => {
          const render = () => {
            const api = turnstileApi();
            if (!api) {
              reject(new Error("turnstile"));
              return;
            }
            if (!turnstileWidgetId) {
              turnstileWidgetId = api.render(turnstileHost, {
                sitekey,
                theme: "dark",
                language: "de",
                appearance: "always",
                action: "contact",
                callback: () => {},
                "error-callback": () => {},
                "expired-callback": () => {
                  api.reset(turnstileWidgetId);
                },
              });
            }
            resolve();
          };

          if (turnstileApi()) {
            render();
            return;
          }

          const script = document.createElement("script");
          script.src =
            "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
          script.async = true;
          script.onload = () => render();
          script.onerror = () => reject(new Error("turnstile-load"));
          document.head.appendChild(script);
        });
      })
      .catch((error) => {
        turnstileLoad = null;
        throw error;
      });

    return turnstileLoad;
  };

  form.addEventListener("focusin", () => void ensureTurnstile().catch(() => {}), {
    once: true,
  });
  form.addEventListener("pointerenter", () => void ensureTurnstile().catch(() => {}), {
    once: true,
  });

  const setStatus = (message: string, tone: "ok" | "error" | "info") => {
    if (!status) return;
    status.textContent = message;
    status.classList.remove("hidden", "text-brand-300", "text-red-400", "text-ink-400");
    status.classList.add(
      tone === "ok"
        ? "text-brand-300"
        : tone === "error"
          ? "text-red-400"
          : "text-ink-400",
    );
  };

  const markInvalid = (field: HTMLElement, invalid: boolean) => {
    field.classList.toggle("border-red-400/60", invalid);
    field.classList.toggle("border-white/10", !invalid);
    // Die Farbe allein reicht nicht - Screenreader brauchen aria-invalid
    if (invalid) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Honeypot: still abbrechen, damit Bots keinen Hinweis bekommen
    if ((form.elements.namedItem("company") as HTMLInputElement)?.value) return;

    const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input[required], textarea[required]",
    );
    let firstInvalid: HTMLElement | null = null;

    for (const field of fields) {
      const invalid = !field.checkValidity();
      if (field.type !== "checkbox") markInvalid(field, invalid);
      if (invalid && !firstInvalid) firstInvalid = field;
    }

    if (firstInvalid) {
      setStatus("Bitte fülle die markierten Pflichtfelder aus.", "error");
      firstInvalid.focus();
      return;
    }

    try {
      await ensureTurnstile();
    } catch {
      setStatus(
        `Die Sicherheitsprüfung konnte nicht geladen werden. Schreib uns bitte direkt an ${mailto}.`,
        "error",
      );
      return;
    }

    if (turnstileSiteKey) {
      const token = turnstileApi()?.getResponse(turnstileWidgetId) ?? "";
      if (!token) {
        setStatus(
          "Bitte setze zuerst das Häkchen bei der Sicherheitsprüfung.",
          "error",
        );
        turnstileHost?.scrollIntoView({ block: "nearest" });
        return;
      }
    }

    const data = new FormData(form);
    data.delete("company");

    if (!endpoint) {
      const subject = `Anfrage über homepowerplus.de: ${data.get("topic") || "Allgemein"}`;
      const body = [
        `Name: ${data.get("name")}`,
        `E-Mail: ${data.get("email")}`,
        `Telefon: ${data.get("phone") || "-"}`,
        `Thema: ${data.get("topic") || "-"}`,
        "",
        String(data.get("message") ?? ""),
      ].join("\n");

      window.location.href = `mailto:${mailto}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setStatus(
        "Dein E-Mail-Programm öffnet sich mit der fertigen Nachricht. Klappt das nicht, schreib uns direkt an " +
          mailto +
          ".",
        "info",
      );
      return;
    }

    if (button) button.disabled = true;
    if (label) label.textContent = "Wird gesendet …";
    setStatus("Deine Nachricht wird übermittelt …", "info");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        const error = payload?.error;
        if (error === "turnstile") {
          turnstileApi()?.reset(turnstileWidgetId);
          setStatus(
            "Die Sicherheitsprüfung ist abgelaufen oder ungültig. Bitte setze das Häkchen erneut.",
            "error",
          );
        } else if (error === "turnstile_unavailable") {
          setStatus(
            `Die Sicherheitsprüfung ist gerade nicht erreichbar. Schreib uns bitte direkt an ${mailto}.`,
            "error",
          );
        } else if (error === "rate_limit") {
          setStatus(
            `Zu viele Anfragen hintereinander. Bitte warte eine Stunde oder schreib uns direkt an ${mailto}.`,
            "error",
          );
        } else {
          throw new Error(String(response.status));
        }
        if (label) label.textContent = "Nachricht senden";
        if (button) button.disabled = false;
        return;
      }

      form.reset();
      setStatus(
        "Danke! Deine Nachricht ist angekommen. Wir melden uns innerhalb eines Werktages.",
        "ok",
      );
      if (label) label.textContent = "Gesendet";
    } catch {
      setStatus(
        `Das hat leider nicht geklappt. Schreib uns bitte direkt an ${mailto}.`,
        "error",
      );
      if (label) label.textContent = "Nachricht senden";
      if (button) button.disabled = false;
    }
  });

  form.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.required && target.type !== "checkbox") {
      markInvalid(target, !target.checkValidity());
    }
  });
}
