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

      if (!response.ok) throw new Error(String(response.status));

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
