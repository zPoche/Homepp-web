/**
 * Hero-Demo: Haus mit Tür/Fenster, Scharf/Unscharf, Sirene, Übertragung
 * und Video-Erkennung. Rein lokal, kein Backend.
 */

type DemoCopy = {
  status: { disarmed: string; armed: string; alarm: string };
  arm: string;
  disarm: string;
  events: {
    armed: string;
    disarmed: string;
    notReady: string;
    doorOpen: string;
    doorClosed: string;
    windowOpen: string;
    windowClosed: string;
    doorAlarm: string;
    windowAlarm: string;
    notify: string;
    ack: string;
    person: string;
    face: string;
    plate: string;
  };
  house: {
    doorOpen: string;
    doorClosed: string;
    windowOpen: string;
    windowClosed: string;
    sirenIdle: string;
    sirenAlarm: string;
    txIdle: string;
    txSending: string;
  };
  video: {
    idle: string;
    appTitle: string;
    appIdle: string;
    personOverlay: string;
    faceOverlay: string;
    plateOverlay: string;
  };
  logEmpty: string;
};

type DetectKind = "person" | "face" | "plate";

const root = document.querySelector<HTMLElement>("[data-alarm-demo]");
if (!root) {
  // Seite ohne Demo
} else {
  const copy = JSON.parse(root.dataset.copy ?? "{}") as DemoCopy;

  const statusEl = root.querySelector<HTMLElement>("[data-demo-status]");
  const armBtn = root.querySelector<HTMLButtonElement>("[data-demo-arm]");
  const ackBtn = root.querySelector<HTMLButtonElement>("[data-demo-ack]");
  const doorBtn = root.querySelector<HTMLButtonElement>("[data-demo-door]");
  const windowBtn = root.querySelector<HTMLButtonElement>("[data-demo-window]");
  const cameraBtn = root.querySelector<HTMLButtonElement>("[data-demo-camera]");
  const logEl = root.querySelector<HTMLElement>("[data-demo-log]");
  const sirenLabel = root.querySelector<HTMLElement>("[data-demo-siren-label]");
  const txLabel = root.querySelector<HTMLElement>("[data-demo-tx-label]");
  const liveCaption = root.querySelector<HTMLElement>("[data-demo-live-caption]");
  const overlays = [...root.querySelectorAll<HTMLElement>("[data-demo-overlay]")];
  const appTitle = root.querySelector<HTMLElement>("[data-demo-app-title]");
  const appBody = root.querySelector<HTMLElement>("[data-demo-app-body]");
  const alarmPanel = root.querySelector<HTMLElement>("#demo-panel-alarm");
  const videoPanel = root.querySelector<HTMLElement>("#demo-panel-video");
  const tabButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-demo-tab]")];

  let armed = false;
  let doorOpen = false;
  let windowOpen = false;
  let alarm = false;
  const lines: string[] = [];

  const paintLog = () => {
    if (!logEl) return;
    if (!lines.length) {
      logEl.innerHTML = `<li class="text-ink-500 text-xs leading-relaxed">${copy.logEmpty}</li>`;
      return;
    }
    logEl.innerHTML = lines
      .slice(0, 6)
      .map(
        (line) =>
          `<li class="rounded-xl border border-white/6 bg-white/3 px-3 py-2 text-xs leading-relaxed">${line}</li>`,
      )
      .join("");
  };

  const push = (line: string) => {
    lines.unshift(line);
    paintLog();
  };

  const setTab = (tab: "alarm" | "video") => {
    const isAlarm = tab === "alarm";
    for (const btn of tabButtons) {
      const on = btn.dataset.demoTab === tab;
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.classList.toggle("text-ink-400", !on);
    }
    alarmPanel?.classList.toggle("hidden", !isAlarm);
    videoPanel?.classList.toggle("hidden", isAlarm);
    if (alarmPanel) alarmPanel.hidden = !isAlarm;
    if (videoPanel) videoPanel.hidden = isAlarm;
  };

  const paintScene = () => {
    root.toggleAttribute("data-door-open", doorOpen);
    root.toggleAttribute("data-window-open", windowOpen);
    root.toggleAttribute("data-alarm", alarm);
    root.toggleAttribute("data-sending", alarm);

    if (doorBtn) {
      doorBtn.setAttribute("aria-pressed", doorOpen ? "true" : "false");
      doorBtn.textContent = doorOpen ? copy.house.doorOpen : copy.house.doorClosed;
    }
    if (windowBtn) {
      windowBtn.setAttribute("aria-pressed", windowOpen ? "true" : "false");
      windowBtn.textContent = windowOpen
        ? copy.house.windowOpen
        : copy.house.windowClosed;
    }
    if (armBtn) {
      armBtn.setAttribute("aria-pressed", armed ? "true" : "false");
      armBtn.textContent = armed ? copy.disarm : copy.arm;
      armBtn.classList.toggle("bg-brand-400", !armed);
      armBtn.classList.toggle("text-ink-950", !armed);
      armBtn.classList.toggle("glass", armed);
    }
    if (ackBtn) ackBtn.classList.toggle("hidden", !alarm);
    if (statusEl) {
      statusEl.textContent = alarm
        ? copy.status.alarm
        : armed
          ? copy.status.armed
          : copy.status.disarmed;
    }
    if (sirenLabel) {
      sirenLabel.textContent = alarm ? copy.house.sirenAlarm : copy.house.sirenIdle;
    }
    if (txLabel) {
      txLabel.textContent = alarm ? copy.house.txSending : copy.house.txIdle;
    }
  };

  const raiseAlarm = (source: "door" | "window") => {
    const already = alarm;
    alarm = true;
    push(source === "door" ? copy.events.doorAlarm : copy.events.windowAlarm);
    if (!already) push(copy.events.notify);
    paintScene();
  };

  const setDoor = (open: boolean) => {
    if (doorOpen === open) return;
    doorOpen = open;
    if (open) {
      if (armed) raiseAlarm("door");
      else push(copy.events.doorOpen);
    } else {
      push(copy.events.doorClosed);
    }
    paintScene();
  };

  const setWindow = (open: boolean) => {
    if (windowOpen === open) return;
    windowOpen = open;
    if (open) {
      if (armed) raiseAlarm("window");
      else push(copy.events.windowOpen);
    } else {
      push(copy.events.windowClosed);
    }
    paintScene();
  };

  const setArmed = (next: boolean) => {
    if (next) {
      if (doorOpen || windowOpen) {
        push(copy.events.notReady);
        return;
      }
      armed = true;
      push(copy.events.armed);
    } else {
      armed = false;
      if (alarm) {
        alarm = false;
        push(copy.events.ack);
      }
      push(copy.events.disarmed);
    }
    paintScene();
  };

  const ack = () => {
    if (!alarm) return;
    alarm = false;
    push(copy.events.ack);
    paintScene();
  };

  const detect = (kind: DetectKind) => {
    const message =
      kind === "person"
        ? copy.events.person
        : kind === "face"
          ? copy.events.face
          : copy.events.plate;
    if (liveCaption) liveCaption.textContent = message;
    for (const overlay of overlays) {
      overlay.classList.toggle("hidden", overlay.dataset.demoOverlay !== kind);
    }
    if (appTitle) appTitle.textContent = copy.video.appTitle;
    if (appBody) appBody.textContent = message;
  };

  for (const btn of tabButtons) {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.demoTab === "video" ? "video" : "alarm";
      setTab(tab);
    });
  }

  doorBtn?.addEventListener("click", () => setDoor(!doorOpen));
  windowBtn?.addEventListener("click", () => setWindow(!windowOpen));
  armBtn?.addEventListener("click", () => setArmed(!armed));
  ackBtn?.addEventListener("click", ack);
  cameraBtn?.addEventListener("click", () => detect("person"));

  for (const btn of root.querySelectorAll<HTMLButtonElement>("[data-demo-detect]")) {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.demoDetect;
      if (kind === "person" || kind === "face" || kind === "plate") detect(kind);
    });
  }

  paintLog();
  paintScene();
  setTab("alarm");
}
