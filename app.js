(() => {
  const storageKey = "campus-stores.shift.v2";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Desk book", "messages-square"],
  ];
  const original = () => ({
    version: 2,
    tab: "Requests",
    phase: 0,
    selected: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
      },
    ],
    notes: [],
    editing: false,
    returning: 0,
    custody: 0,
    kit: "",
    onlyOpen: true,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, good = false, warn = false) =>
    '<span class="tag' + (good ? " good" : "") + (warn ? " warn" : "") + '">' + esc(t) + "</span>";
  const dues = ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"];
  const rank = { "Fri 8 pm": 20, "Sat 9 am": 33, "Sat 10 am": 34, "Sat noon": 36 };
  const clock = [15.75, 19.5, 33];
  const overdue = (l) => !l.back && clock[s.phase] > rank[l.due];
  const late = (l) => (overdue(l) ? badge("Overdue since " + l.due, false, true) : "");
  const holderOf = (l) => l.holder || l.who;
  const loanSub = (l) =>
    l.req + " · Collected by " + l.who +
    (l.holder && l.holder !== l.who ? " · Now with " + l.holder : "") +
    " · Due " + l.due + (l.expected ? " · Expected " + l.expected : "") +
    (l.note ? " · " + l.note : "");
  const returnUI = (l) =>
    s.returning === l.num
      ? '<form data-return="' + l.num + '" class="inline"><label><span>Label on the unit in hand</span><input name="label" required autocomplete="off" placeholder="' + esc(l.asset) + '"></label><button type="submit" class="primary">Confirm return</button>' + btn("Cancel", "cancelreturn") + "</form>"
      : btn("Record return", "return", String(l.num));
  const custodyForm = (l) =>
    '<form data-custody="' + l.num + '" class="inline"><label><span>Now with</span><select name="holder">' +
    people.map((p) => "<option" + (p === holderOf(l) ? " selected" : "") + ">" + esc(p) + "</option>").join("") +
    '</select></label><label><span>Expected back</span><select name="expected"><option value="">No time given</option>' +
    dues.map((d) => "<option" + (d === l.expected ? " selected" : "") + ">" + d + "</option>").join("") +
    '</select></label><label><span>Note</span><input name="note" maxlength="120" value="' + esc(l.note || "") + '"></label><button type="submit" class="primary">Save</button>' +
    btn("Cancel", "cancelcustody") + "</form>";
  const loanActions = (l) =>
    '<div class="stack">' + late(l) +
    (s.custody === l.num ? custodyForm(l) : returnUI(l) + (s.returning === l.num ? "" : btn("Update holder", "custody", String(l.num)))) +
    "</div>";
  const lines = (r) =>
    r.items.map((type) => ({
      type,
      loan: s.loans.filter((l) => l.req === r.id && getAsset(l.asset).type === type).pop(),
    }));
  const kitForm = (r, ls) => {
    const todo = ls.filter((x) => !x.loan);
    return (
      '<form data-kit="' + r.id + '"><div class="form"><label><span>Collected by</span><select name="who" required><option value="">Select…</option>' +
      opts(people.map((p) => [p, p])) + '</select></label><label><span>Return by</span><select name="due">' +
      dues.map((d) => "<option" + (d === r.due ? " selected" : "") + ">" + d + "</option>").join("") + "</select></label>" +
      todo.map(({ type }) =>
        "<label><span>" + esc(type) + '</span><select name="u:' + esc(type) + '" required><option value="">Select unit…</option>' +
        opts(assets.filter((a) => a.type === type && !a.repair && !out(a.id)).map((a) => [a.id, a.id + " · " + a.model + " · bin " + a.bin])) +
        "</select></label>").join("") +
      '</div><button type="submit" class="primary">Issue ' + todo.length + " unit" + (todo.length > 1 ? "s" : "") + "</button>" +
      btn("Cancel", "cancelkit") + "</form>"
    );
  };
  function requestPage() {
    let html = head("Approved requests", "Student Activities Office · 3 approved forms");
    if (!s.selected)
      return html + requests.map((r) => {
        const ls = lines(r);
        const todo = ls.filter((x) => !x.loan).length;
        const open = ls.filter((x) => x.loan && !x.loan.back);
        return row(r.event,
          r.id + " · " + r.club + " · " + (todo ? todo + " not issued" : open.length ? open.length + " still out" : "All returned"),
          (open.some((x) => overdue(x.loan)) ? badge("Overdue", false, true) : "") + btn("View form", "request", r.id));
      }).join("");
    const r = getReq(s.selected), ls = lines(r);
    html += btn("Back to list", "close") +
      '<div class="record"><small>' + r.id + " · Approved</small><h3>" + r.event + "</h3><p>" + r.club + " · Filed by " + r.owner +
      "</p><p><b>Return by</b> " + r.due + "</p><p>" + r.note + "</p></div><h3>Kit checklist</h3>";
    html += ls.map(({ type, loan }) =>
      row(type,
        loan ? loan.asset + " · " + (loan.back ? "Returned" : "With " + holderOf(loan) + " · Due " + loan.due + (loan.expected ? " · Expected " + loan.expected : "")) : "Not issued",
        loan && !loan.back ? loanActions(loan) : badge(loan ? "Returned" : "Not issued", !!loan))).join("");
    if (ls.some((x) => !x.loan))
      html += s.kit === r.id ? kitForm(r, ls) : btn("Issue kit", "kit", r.id, "primary");
    return html;
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const status = a.repair
        ? "In repair"
        : out(a.id)
          ? "On loan"
          : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model + " · " + a.bin,
        badge(status, status === "On shelf"),
      );
    }
    return html;
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      const select = (label, key, options) =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" required><option value="">Select…</option>' +
        opts(options) +
        "</select></label>";
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        select(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type]),
        ) +
        select(
          "Collected by",
          "who",
          people.map((p) => [p, p]),
        ) +
        select(
          "Return by",
          "due",
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .reverse();
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    for (const l of shown)
      html += row("L-" + l.num + " · " + l.asset, loanSub(l),
        l.back ? '<div class="stack">' + badge("Returned") + btn("Undo return", "undo", String(l.num)) + "</div>" : loanActions(l));
    return html;
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const n of s.notes)
      entries.push([shifts[n.phase].time, "Counter handover", n.text]);
    const open = s.loans.filter((l) => !l.back);
    html +=
      '<article class="record"><small>Still out · ' + esc(shifts[s.phase].time) + "</small><h3>Open slips</h3>" +
      (open.length ? open.map((l) => "<p><b>" + esc(l.asset) + "</b> · " + esc(getAsset(l.asset).type) + " · " + esc(loanSub(l)) + (overdue(l) ? " · Overdue" : "") + "</p>").join("") : "<p>Nothing is out.</p>") +
      "</article>";
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        s.returning = s.custody = 0;
        s.kit = "";
        break;
      case "close":
        s.selected = "";
        s.returning = s.custody = 0;
        s.kit = "";
        break;
      case "request":
        s.selected = v;
        s.returning = s.custody = 0;
        s.kit = "";
        break;
      case "new":
        s.editing = true;
        break;
      case "cancel":
        s.editing = false;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "return":
        s.returning = Number(v);
        s.custody = 0;
        break;
      case "cancelreturn":
        s.returning = 0;
        break;
      case "custody":
        s.custody = Number(v);
        s.returning = 0;
        break;
      case "cancelcustody":
        s.custody = 0;
        break;
      case "kit":
        s.kit = v;
        s.returning = s.custody = 0;
        break;
      case "cancelkit":
        s.kit = "";
        break;
      case "undo": {
        const l = s.loans.find((l) => l.num === Number(v));
        if (!l || !l.back) return;
        l.back = false;
        s.notice = "Return undone. Slip L-" + l.num + " is open again.";
        break;
      }
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (f.matches("[data-kit]")) {
      const r = getReq(f.dataset.kit), who = form.get("who"), due = form.get("due");
      if (!r || !people.includes(who) || !dues.includes(due)) return;
      const picks = lines(r).filter((x) => !x.loan).map(({ type }) => [type, getAsset(form.get("u:" + type))]);
      if (!picks.length || picks.some(([ty, u]) => !u || u.type !== ty || u.repair || out(u.id))) return;
      let num = Math.max(...s.loans.map((l) => l.num));
      for (const [, u] of picks) s.loans.push({ num: ++num, req: r.id, asset: u.id, who, due, back: false });
      s.kit = "";
      commit("Issued " + picks.map(([, u]) => u.id).join(", ") + " to " + who + ".");
      return;
    }
    if (f.matches("[data-return]")) {
      const l = s.loans.find((x) => x.num === Number(f.dataset.return));
      if (!l || l.back) return;
      const label = String(form.get("label")).trim().toUpperCase();
      if (label === l.asset) {
        l.back = true;
        s.returning = 0;
        commit(l.asset + " returned to stock. Slip L-" + l.num + " closed.");
        return;
      }
      const other = getAsset(label), ol = other && out(label);
      commit(ol ? label + " is on slip L-" + ol.num + " with " + holderOf(ol) + ". This slip is for " + l.asset + "."
        : other ? label + " was not issued on this slip. This slip is for " + l.asset + "."
        : "No unit labelled " + label + ". This slip is for " + l.asset + ".");
      return;
    }
    if (f.matches("[data-custody]")) {
      const l = s.loans.find((x) => x.num === Number(f.dataset.custody));
      const holder = form.get("holder"), expected = form.get("expected");
      if (!l || l.back || !people.includes(holder) || (expected && !dues.includes(expected))) return;
      l.holder = holder;
      l.expected = expected;
      l.note = String(form.get("note")).trim();
      s.custody = 0;
      commit("L-" + l.num + " is now with " + holder + ".");
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (!r || !unit || unit.repair || out(asset) || !people.includes(who))
      return;
    if (!r.items.includes(unit.type)) {
      q("[data-status]").textContent =
        "This equipment type is outside the approved request. Choose an approved unit.";
      return;
    }
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      q("[data-status]").textContent =
        "The approved quantity of this equipment type is already on loan.";
      return;
    }
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false });
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 2 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l && getReq(l.req) && getAsset(l.asset) && Number.isInteger(l.num),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({ ...l })),
      notes: d.notes.map((n) => ({ ...n })),
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
  }
})();