(function () {
  var APP_KEY = "__buildSaverAllInOneV9";
  var app = window[APP_KEY] || (window[APP_KEY] = {});

  if (app.version === "v15" && typeof app.remount === "function") {
    app.remount();
    return;
  }
  app.version = "v15";

  var CONFIG = {
    ga4: {
      measurementId: "",
      autoLoadTag: true,
      debug: false
    },
    serviceArea: {
      enabled: true,
      allowedPrefixes: ["M", "L", "N"],
      helpText: "Service area check uses your delivery postal code.",
      outOfAreaText: "This postal code may be outside our standard service area. Call us to confirm options."
    },
    quoteConversion: {
      returnParam: "bsv_quote_submitted",
      returnValue: "1",
      dedupeSessionPrefix: "bsv_quote_submit_seen"
    },
    fallbackCallHref: "tel:+14166667775",
    formViewUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfhKnWlUOFMBLdqX7G_jm2SCunZ604NSQ0UAoZNSX7WtFf0CA/viewform",
    prefillEntries: {
      product: "",
      source: "",
      page: "",
      context: "1954630944",
      postal: "",
      serviceStatus: ""
    },
    trust: [
      { t: "Fast Quote Turnaround", s: "Most requests answered within business hours." },
      { t: "Contractor Pricing", s: "Bulk and repeat-order friendly support." },
      { t: "Local Fulfillment", s: "Delivery and pickup options across service areas." },
      { t: "Category Depth", s: "Drywall, roofing, insulation and related supplies." }
    ],
    mostRequested: [
      { label: "Drywall", term: "CGC Drywall" },
      { label: "Insulation", term: "Batt Fiberglass Insulation" },
      { label: "Shingles", term: "Shingles" },
      { label: "Roofing", term: "Roofing Materials" },
      { label: "Accessories", term: "Drywall Accessories" },
      { label: "Caulking", term: "Caulking" }
    ],
    faqs: [
      { q: "Do you deliver to job sites?", a: "Yes. Share your site address in the quote request and we will confirm delivery options and timing." },
      { q: "How fast will I get a quote?", a: "Most quote requests are answered during business hours. Include quantity and location for faster turnaround." },
      { q: "Can contractors get volume pricing?", a: "Yes. Contractor and repeat-order pricing is available based on product mix and volume." },
      { q: "Can I pick up instead of delivery?", a: "Yes. Ask for pickup when you request a quote and we will confirm timing and availability." },
      { q: "What if an item is unavailable?", a: "We can suggest equivalent options across compatible product lines when availability changes." }
    ],
    testimonials: [
      { quote: "Fast turnaround and reliable deliveries. Makes our job-site planning easier.", name: "GTA Contractor" },
      { quote: "Pricing is competitive and the support team is responsive when timelines are tight.", name: "Renovation Builder" },
      { quote: "Consistent product availability and smooth pickup process every time.", name: "Framing Crew Lead" }
    ]
  };

  var PRODUCTS = [
    { title: "CGC Drywall", tags: ["drywall", "cgc", "firecode", "durock", "mold"], items: ["1/2 in Plank", "1/2 in Mold Tough", "5/8 in Firecode", "1/2 in Durock"] },
    { title: "Drywall Accessories", tags: ["sheetrock", "durabond", "mud", "tape", "corner bead"], items: ["Sheetrock 90", "Durabond 90", "All Purpose Compound", "Drywall Tape"] },
    { title: "Batt Fiberglass Insulation", tags: ["insulation", "r12", "r14", "r20", "r31"], items: ["R12", "R14", "R20", "R31"] },
    { title: "Sound Proofing", tags: ["sound", "quietzone", "sound-shield"], items: ["QuietZone", "Sound-SHIELD"] },
    { title: "Blowing Wool", tags: ["blowing wool", "propink"], items: ["OC ProPink"] },
    { title: "Vapour Barrier", tags: ["vapour barrier", "super-six"], items: ["Super-Six"] },
    { title: "Tuck Tape", tags: ["tuck tape", "rst", "bst"], items: ["RST", "BST"] },
    { title: "Caulking", tags: ["caulking", "tremco"], items: ["Tremco"] },
    { title: "Roofing Materials", tags: ["roofing", "coil nails", "underlayment", "flashing"], items: ["Coil Nails", "Ice and Water", "Underlayment", "Flashing"] },
    { title: "Shingles", tags: ["shingles", "oakridge", "duration", "mystique", "dakota"], items: ["Oakridge", "Duration", "BP Mystique", "BP Dakota"] }
  ];

  var IDS = {
    style: "bsv-aio-style",
    finder: "bsv-aio-finder-root",
    trust: "bsv-aio-trust",
    mostRequested: "bsv-mr-section",
    cats: "bsv-aio-cats",
    faq: "bsv-aio-faq",
    faqJson: "bsv-aio-faq-jsonld",
    proof: "bsv-proof-section",
    mobile: "bsv-aio-mobile",
    drawerRoot: "bsv-qd-root",
    desktopRail: "bsv-drail-root",
    exitNudge: "bsv-exit-root"
  };

  var EXIT_CFG = {
    minDelayMs: 9000,
    cooldownDays: 7,
    sessionKey: "bsv_exit_nudge_seen_session",
    hiddenUntilKey: "bsv_exit_nudge_hidden_until"
  };

  var LEGACY_IDS = [
    "bsv-style", "bsv-finder-root", "bsv-trust-strip", "bsv-category-grid", "bsv-mobile-bar", "bsv-faq-style", "bsv-faq-section", "bsv-faq-jsonld", "bsv-qd-style", "bsv-qd-root", "bsv-addon14-style", "bsv-proof-section", "bsv-mr-style", "bsv-mr-section",
    "bsx-style", "bsx-finder", "bsx-trust", "bsx-cats", "bsx-mobile",
    "bs-pack-style", "bs-pack-root", "bs-pack-trust", "bs-pack-cats", "bs-pack-mobile",
    "bsq-suite-style", "bsq-suite-finder-root", "bsq-trust-strip", "bsq-mobile-bar",
    "bsq-root", "bsq-boost-style", "bsq-fab", "bsq-overlay"
  ];

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s || "").replace(/[&<>\"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m];
    });
  }

  function norm(s) {
    return String(s || "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function isHome() {
    var p = (location.pathname || "/").replace(/\/+$/, "");
    return p === "" || p === "/";
  }

  function callUrl() {
    var a = q('a[href^="tel:"]');
    return a && a.getAttribute("href") ? a.getAttribute("href") : CONFIG.fallbackCallHref;
  }

  function extractGa4IdFromText(text) {
    var m = String(text || "").match(/G-[A-Z0-9]{6,}/i);
    return m ? m[0].toUpperCase() : "";
  }

  function discoverGa4IdFromScripts() {
    var scripts = qa('script[src*="googletagmanager.com/gtag/js"]');
    var i;

    for (i = 0; i < scripts.length; i += 1) {
      var src = scripts[i].getAttribute("src") || "";
      var found = extractGa4IdFromText(src);
      if (found) return found;
    }

    return "";
  }

  function resolveGa4MeasurementId() {
    var fromGlobal = extractGa4IdFromText(window.BUILDSAVER_GA4_ID);
    if (fromGlobal) return fromGlobal;

    var fromConfig = extractGa4IdFromText(CONFIG.ga4 && CONFIG.ga4.measurementId);
    if (fromConfig) return fromConfig;

    var fromScripts = discoverGa4IdFromScripts();
    if (fromScripts) return fromScripts;

    return "";
  }

  function initAnalytics() {
    if (app.analyticsReady) return;

    var id = resolveGa4MeasurementId();
    var hasGtag = typeof window.gtag === "function";
    app.ga4MeasurementId = id;

    if (!hasGtag && id && CONFIG.ga4.autoLoadTag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };

      if (!document.querySelector('script[src*="googletagmanager.com/gtag/js?id="]')) {
        var s = document.createElement("script");
        s.async = true;
        s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
        document.head.appendChild(s);
      }

      window.gtag("js", new Date());
      window.gtag("config", id, { debug_mode: !!CONFIG.ga4.debug, send_page_view: false });
      app.analyticsReady = true;
      return;
    }

    if (hasGtag && id) {
      window.gtag("config", id, { debug_mode: !!CONFIG.ga4.debug, send_page_view: false });
      app.analyticsReady = true;
      return;
    }

    app.analyticsReady = hasGtag || !!id;
  }

  function trackEvent(name, params) {
    var payload = Object.assign({
      page_location: location.href,
      page_path: location.pathname
    }, params || {});

    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, payload));
  }

  function getAnalyticsState() {
    var svc = getServiceAreaState();
    return {
      measurementId: app.ga4MeasurementId || "",
      analyticsReady: !!app.analyticsReady,
      hasGtag: typeof window.gtag === "function",
      quoteReturnParam: (CONFIG.quoteConversion && CONFIG.quoteConversion.returnParam) || "bsv_quote_submitted",
      quoteReturnSignal: hasReturnSubmitSignal(),
      serviceAreaEnabled: serviceAreaEnabled(),
      serviceAreaChecked: !!svc.checked,
      serviceAreaQualified: !!svc.qualified,
      serviceAreaFsa: svc.fsa || ""
    };
  }

  function markQuoteSubmitted(method, ctx) {
    var payloadCtx = ctx || {};
    var activeCtx = app.quoteContext || {};
    var svc = getServiceAreaState();

    trackEvent("bs_quote_submit", {
      method: method || "unspecified",
      source: payloadCtx.source || activeCtx.source || "Website",
      product: payloadCtx.product || activeCtx.product || "General",
      service_qualified: activeCtx.serviceQualified === true ? "yes" : (activeCtx.serviceQualified === false ? "no" : "unknown"),
      postal_fsa: svc.fsa || ""
    });
  }

  function hasReturnSubmitSignal() {
    var cfg = CONFIG.quoteConversion || {};
    var param = cfg.returnParam || "bsv_quote_submitted";
    var expected = cfg.returnValue;
    var qs;

    try {
      qs = new URLSearchParams(location.search || "");
    } catch (e) {
      return false;
    }

    if (!qs.has(param)) return false;
    if (typeof expected !== "string" || expected === "") return true;
    return qs.get(param) === expected;
  }

  function captureReturnSubmitSignal() {
    if (!hasReturnSubmitSignal()) return;

    var cfg = CONFIG.quoteConversion || {};
    var keyPrefix = cfg.dedupeSessionPrefix || "bsv_quote_submit_seen";
    var dedupeKey = [keyPrefix, location.pathname, location.search].join(":");
    if (getSessionFlag(dedupeKey) === "1") return;

    markQuoteSubmitted("return_query_param", {
      source: "Google Form Return",
      product: "General"
    });
    setSessionFlag(dedupeKey, "1");
  }

  function serviceAreaEnabled() {
    return !!(CONFIG.serviceArea && CONFIG.serviceArea.enabled);
  }

  function normalizePostal(raw) {
    return String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  }

  function formatPostal(raw) {
    var n = normalizePostal(raw);
    if (n.length <= 3) return n;
    return n.slice(0, 3) + " " + n.slice(3);
  }

  function isValidCanadianPostal(n) {
    return /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/.test(String(n || ""));
  }

  function getServiceAreaPrefixes() {
    var cfg = CONFIG.serviceArea || {};
    var list = Array.isArray(cfg.allowedPrefixes) ? cfg.allowedPrefixes : [];
    return list.map(function (x) {
      return String(x || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    }).filter(Boolean);
  }

  function getServiceAreaState() {
    if (!app.serviceAreaState) {
      app.serviceAreaState = {
        checked: false,
        valid: false,
        qualified: false,
        normalized: "",
        formatted: "",
        fsa: "",
        reason: "empty"
      };
    }
    return app.serviceAreaState;
  }

  function setServiceAreaState(next) {
    app.serviceAreaState = Object.assign(getServiceAreaState(), next || {});
    return app.serviceAreaState;
  }

  function evaluateServiceArea(rawPostal) {
    var normalized = normalizePostal(rawPostal);
    var formatted = formatPostal(normalized);
    var fsa = normalized.slice(0, 3);
    var result = {
      checked: true,
      valid: false,
      qualified: false,
      normalized: normalized,
      formatted: formatted,
      fsa: fsa,
      reason: "invalid_format"
    };

    if (!normalized) {
      result.checked = false;
      result.reason = "empty";
      return result;
    }

    if (!isValidCanadianPostal(normalized)) return result;

    var prefixes = getServiceAreaPrefixes();
    result.valid = true;
    result.qualified = prefixes.length ? prefixes.some(function (prefix) { return fsa.indexOf(prefix) === 0; }) : true;
    result.reason = result.qualified ? "qualified" : "out_of_area";
    return result;
  }

  function serviceAreaMessage(state) {
    var cfg = CONFIG.serviceArea || {};
    var s = state || getServiceAreaState();
    if (!serviceAreaEnabled()) return "Service area check disabled.";
    if (!s.checked) return String(cfg.helpText || "Enter a Canadian postal code to confirm delivery coverage.");
    if (s.reason === "invalid_format") return "Enter a valid postal code (example: M5V 2T6).";
    if (s.qualified) return "Great, this postal code is within our service area.";
    return String(cfg.outOfAreaText || "This postal code may be outside our standard service area. Call us to confirm options.");
  }

  function applyServiceAreaGate() {
    app.quoteContext = app.quoteContext || { product: "", source: "Website", page: location.href, ts: new Date().toISOString() };

    var qualWrap = q("#bsv-qd-qual");
    var input = q("#bsv-qd-postal");
    var status = q("#bsv-qd-qual-status");
    var gate = q("#bsv-qd-gate");
    var gateText = q("#bsv-qd-gate-text");
    var frame = q("#bsv-qd-frame");
    var openNew = q("#bsv-qd-open-new");
    var state = getServiceAreaState();

    if (!serviceAreaEnabled()) {
      if (qualWrap) qualWrap.style.display = "none";
      if (gate) gate.classList.remove("open");
      if (openNew) {
        openNew.setAttribute("href", formOpenNewUrl(app.quoteContext || {}));
        openNew.removeAttribute("aria-disabled");
        openNew.removeAttribute("tabindex");
      }
      if (frame) {
        var directSrc = formEmbedUrl(app.quoteContext || {});
        if ((frame.getAttribute("src") || "") !== directSrc) frame.setAttribute("src", directSrc);
      }
      return;
    }

    if (qualWrap) qualWrap.style.display = "";
    if (input && document.activeElement !== input) input.value = state.formatted || "";

    if (state.formatted) app.quoteContext.postal = state.formatted;
    else delete app.quoteContext.postal;

    if (state.checked) app.quoteContext.serviceQualified = !!state.qualified;
    else delete app.quoteContext.serviceQualified;

    if (status) {
      status.textContent = serviceAreaMessage(state);
      status.setAttribute("data-state", state.qualified ? "ok" : (state.checked ? "warn" : "idle"));
    }

    if (state.qualified) {
      if (gate) gate.classList.remove("open");
      if (openNew) {
        openNew.setAttribute("href", formOpenNewUrl(app.quoteContext || {}));
        openNew.removeAttribute("aria-disabled");
        openNew.removeAttribute("tabindex");
      }
      if (frame) {
        var src = formEmbedUrl(app.quoteContext || {});
        if ((frame.getAttribute("src") || "") !== src) frame.setAttribute("src", src);
      }
      return;
    }

    if (gate) gate.classList.add("open");
    if (gateText) gateText.textContent = serviceAreaMessage(state);
    if (openNew) {
      openNew.setAttribute("href", "#");
      openNew.setAttribute("aria-disabled", "true");
      openNew.setAttribute("tabindex", "-1");
    }
    if (frame && frame.hasAttribute("src")) frame.removeAttribute("src");
  }

  function buildPrefillParams(ctx) {
    var params = [];
    var p = CONFIG.prefillEntries || {};
    var contextLines = [];
    var serviceStatus = "";

    if (p.product && ctx.product) params.push("entry." + p.product + "=" + encodeURIComponent(ctx.product));
    if (p.source && ctx.source) params.push("entry." + p.source + "=" + encodeURIComponent(ctx.source));
    if (p.page && ctx.page) params.push("entry." + p.page + "=" + encodeURIComponent(ctx.page));
    if (p.postal && ctx.postal) params.push("entry." + p.postal + "=" + encodeURIComponent(ctx.postal));

    if (ctx.serviceQualified === true) serviceStatus = "Qualified";
    else if (ctx.serviceQualified === false) serviceStatus = "Outside Standard Area";
    if (p.serviceStatus && serviceStatus) params.push("entry." + p.serviceStatus + "=" + encodeURIComponent(serviceStatus));

    if (ctx.product) contextLines.push("Product: " + ctx.product);
    if (ctx.source) contextLines.push("Source: " + ctx.source);
    if (ctx.page) contextLines.push("Page: " + ctx.page);
    if (ctx.ts) contextLines.push("Time: " + ctx.ts);
    if (ctx.postal) contextLines.push("Postal: " + ctx.postal);
    if (serviceStatus) contextLines.push("Service Area: " + serviceStatus);
    if (p.context && contextLines.length) {
      params.push("entry." + p.context + "=" + encodeURIComponent(contextLines.join(" | ")));
    }

    return params;
  }

  function formEmbedUrl(ctx) {
    var base = CONFIG.formViewUrl;
    var params = buildPrefillParams(ctx || {});

    if (params.length) params.unshift("usp=pp_url");
    params.push("embedded=true");
    return base + "?" + params.join("&");
  }

  function formOpenNewUrl(ctx) {
    var base = CONFIG.formViewUrl;
    var params = buildPrefillParams(ctx || {});

    if (params.length) params.unshift("usp=pp_url");
    return params.length ? (base + "?" + params.join("&")) : base;
  }

  function findHeading(title) {
    var target = norm(title);
    var hs = qa("main h1, main h2, main h3, h1, h2, h3");
    var i;

    for (i = 0; i < hs.length; i += 1) {
      if (norm(hs[i].textContent) === target) return hs[i];
    }
    for (i = 0; i < hs.length; i += 1) {
      var txt = norm(hs[i].textContent);
      if (txt.indexOf(target) !== -1 || target.indexOf(txt) !== -1) return hs[i];
    }
    return null;
  }

  function inferContext(trigger) {
    var product = trigger.getAttribute("data-product") || "";
    var source = trigger.getAttribute("data-source") || "";

    if (!product) {
      var card = trigger.closest(".bsv-aio-card, .bsv-aio-cat");
      var h = card ? q("h3", card) : null;
      if (h) product = (h.textContent || "").trim();
    }

    if (!source) {
      if (trigger.closest("#" + IDS.cats)) source = "Category Grid";
      else if (trigger.closest("#" + IDS.finder)) source = "Finder";
      else if (trigger.closest("#" + IDS.faq)) source = "FAQ";
      else if (trigger.closest("#" + IDS.trust)) source = "Trust Strip";
      else if (trigger.closest("#" + IDS.mostRequested)) source = "Most Requested";
      else if (trigger.closest("#" + IDS.mobile)) source = "Mobile Bar";
      else if (trigger.closest("#" + IDS.proof)) source = "Reviews";
      else source = "Website";
    }

    return {
      product: product,
      source: source,
      page: location.href,
      ts: new Date().toISOString()
    };
  }

  function cleanup() {
    var ids = [IDS.style, IDS.finder, IDS.trust, IDS.mostRequested, IDS.cats, IDS.faq, IDS.faqJson, IDS.proof, IDS.mobile, IDS.drawerRoot, IDS.desktopRail, IDS.exitNudge].concat(LEGACY_IDS);
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });

    document.documentElement.classList.remove("bsv-aio-mobile-pad");
    document.body.style.overflow = "";
  }

  function injectStyle() {
    var css = '' +
      '#bsv-aio-fab{position:fixed;right:18px;bottom:18px;z-index:9999;border:none;border-radius:999px;padding:12px 18px;font:700 14px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff;background:#0f3557;box-shadow:0 12px 28px rgba(0,0,0,.25);cursor:pointer;}' +
      '#bsv-aio-fab:hover{background:#12456f;transform:translateY(-1px);}' +
      '#bsv-aio-overlay{position:fixed;inset:0;z-index:10010;display:none;background:rgba(8,15,25,.62);backdrop-filter:blur(2px);padding:20px;}' +
      '#bsv-aio-overlay.open{display:grid;place-items:center;}' +
      '#bsv-aio-modal{width:min(860px,96vw);max-height:90vh;overflow:auto;background:#fff;border:1px solid #e6edf4;border-radius:16px;box-shadow:0 26px 64px rgba(0,0,0,.28);}' +
      '#bsv-aio-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;padding:16px 18px 10px;border-bottom:1px solid #edf2f7;}' +
      '#bsv-aio-title{margin:0;font:800 22px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#10263c;}' +
      '#bsv-aio-sub{margin:6px 0 0;font:500 13px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#51667a;}' +
      '#bsv-aio-close{border:none;width:36px;height:36px;border-radius:10px;background:#f2f6fa;color:#1f3347;cursor:pointer;font-size:20px;line-height:1;}' +
      '#bsv-aio-body{padding:14px 18px 18px;}' +
      '#bsv-aio-search{width:100%;border:1px solid #d7e1eb;border-radius:12px;padding:12px 14px;font:600 15px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;outline:none;}' +
      '#bsv-aio-search:focus{border-color:#0f3557;box-shadow:0 0 0 3px rgba(15,53,87,.12);}' +
      '#bsv-aio-actions{margin:10px 0 14px;display:flex;gap:10px;flex-wrap:wrap;}' +
      '#bsv-aio-results{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;}' +
      '.bsv-aio-card{border:1px solid #e1eaf3;border-radius:12px;padding:12px;background:#fff;color:#13212f;}' +
      '.bsv-aio-card h3{margin:0 0 6px;font:800 15px/1.25 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-card p{margin:0 0 8px;color:#5a6f82;font:500 12px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-row{display:flex;gap:8px;flex-wrap:wrap;}' +
      '.bsv-aio-btn{border:none;border-radius:9px;padding:8px 10px;cursor:pointer;font:700 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-decoration:none;}' +
      '.bsv-aio-btn-sec{background:#edf4fb;color:#12314d;}' +
      '.bsv-aio-btn-pri{background:#f97316;color:#fff;}' +
      '.bsv-aio-btn-pri:hover{background:#ea580c;}' +
      '.bsv-aio-empty{grid-column:1/-1;border:1px dashed #d6e2ee;border-radius:12px;padding:12px;background:#f8fbfe;color:#5b6f82;font:600 13px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-aio-note{margin-top:8px;min-height:16px;color:#5c6f81;font:600 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-aio-trust{max-width:1200px;margin:18px auto 8px;padding:14px;border:1px solid #dbe6f0;border-radius:16px;background:#fff;box-shadow:0 10px 26px rgba(15,53,87,.08);display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr auto;gap:10px;}' +
      '.bsv-aio-trust-item{border:1px solid #e8eff6;border-radius:12px;padding:10px 12px;background:#fbfdff;}' +
      '.bsv-aio-trust-item strong{display:block;margin-bottom:4px;color:#112b44;font:800 14px/1.25 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-trust-item span{display:block;color:#526678;font:600 12px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-trust-cta{border:none;border-radius:12px;padding:0 16px;min-height:56px;display:inline-flex;align-items:center;justify-content:center;background:#f97316;color:#fff;white-space:nowrap;font:800 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;}' +
      '#bsv-mr-section{max-width:1200px;margin:10px auto 12px;padding:0 2px;}' +
      '.bsv-mr-wrap{border:1px solid #dbe6f0;border-radius:12px;background:#fff;padding:10px 12px;}' +
      '.bsv-mr-title{margin:0 0 8px;color:#10263c;font:800 15px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-mr-row{display:flex;flex-wrap:wrap;gap:8px;}' +
      '.bsv-mr-chip{border:none;border-radius:999px;padding:8px 12px;background:#edf4fb;color:#12314d;cursor:pointer;font:700 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-mr-chip:hover{background:#dfeaf5;}' +
      '#bsv-aio-cats{max-width:1200px;margin:10px auto 14px;padding:0 2px;}' +
      '#bsv-aio-cats h2{margin:0 0 10px;color:#10263c;font:800 22px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-cat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;}' +
      '.bsv-aio-cat{border:1px solid #dbe6f0;border-radius:12px;background:#fff;padding:12px;}' +
      '.bsv-aio-cat h3{margin:0 0 6px;color:#13283f;font:800 15px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-cat p{margin:0 0 10px;color:#5a6f82;font:600 12px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-aio-faq{max-width:1200px;margin:12px auto 18px;display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 2px;}' +
      '.bsv-aio-faq-card{border:1px solid #dbe6f0;border-radius:14px;background:#fff;padding:14px;}' +
      '.bsv-aio-faq-card h2{margin:0 0 10px;color:#10263c;font:800 22px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-steps{margin:0;padding-left:18px;color:#233a4f;font:600 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-steps li{margin:0 0 6px;}' +
      '.bsv-aio-faq-cta{border:none;margin-top:10px;border-radius:10px;padding:10px 14px;background:#f97316;color:#fff;font:800 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;}' +
      '.bsv-aio-faq-item{border-top:1px solid #e9f0f6;}' +
      '.bsv-aio-faq-item:first-of-type{border-top:none;}' +
      '.bsv-aio-faq-btn{width:100%;text-align:left;border:none;background:transparent;padding:12px 0;cursor:pointer;color:#112b44;font:700 15px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:flex;justify-content:space-between;gap:12px;}' +
      '.bsv-aio-faq-btn span:last-child{color:#5a6f82;}' +
      '.bsv-aio-faq-answer{display:none;padding:0 0 12px;color:#4e6377;font:500 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-faq-answer.open{display:block;}' +
      '#bsv-proof-section{max-width:1200px;margin:14px auto 20px;display:grid;grid-template-columns:1fr;gap:12px;padding:0 2px;}' +
      '.bsv-proof-card{border:1px solid #dbe6f0;border-radius:14px;background:#fff;padding:14px;}' +
      '.bsv-proof-card h2{margin:0 0 10px;color:#10263c;font:800 22px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-proof-reviews{display:grid;gap:8px;}' +
      '.bsv-review{margin:0;border:1px solid #e9f0f6;border-radius:10px;padding:10px;background:#fbfdff;}' +
      '.bsv-review p{margin:0 0 6px;color:#243b50;font:600 13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-review footer{color:#5a6f82;font:700 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-proof-cta{margin-top:10px;border:none;border-radius:10px;padding:10px 14px;background:#f97316;color:#fff;cursor:pointer;font:800 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-proof-cta:hover{background:#ea580c;}' +
      '#bsv-aio-mobile{position:fixed;left:10px;right:10px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);z-index:10020;display:none;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:8px;border:1px solid #d8e4ef;border-radius:14px;background:rgba(255,255,255,.96);backdrop-filter:blur(8px);box-shadow:0 14px 34px rgba(16,38,60,.2);}' +
      '.bsv-aio-mb{min-height:42px;border-radius:10px;border:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font:800 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-decoration:none;}' +
      '.bsv-aio-mb-call{background:#0f3557;color:#fff;}' +
      '.bsv-aio-mb-quote{background:#f97316;color:#fff;}' +
      '.bsv-aio-mb-find{background:#edf4fb;color:#12314d;}' +
      '#bsv-drail-root{position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:10018;}' +
      '#bsv-drail{width:180px;display:flex;flex-direction:column;gap:8px;padding:10px;border:1px solid #d7e3ee;border-radius:14px;background:#fff;box-shadow:0 16px 36px rgba(16,38,60,.20);}' +
      '.bsv-drail-label{font:800 11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#5a6f82;margin:2px 2px 4px;}' +
      '.bsv-drail-btn{border:none;border-radius:10px;min-height:38px;padding:9px 10px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;font:800 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-drail-call{background:#0f3557;color:#fff;}' +
      '.bsv-drail-quote{background:#f97316;color:#fff;}' +
      '.bsv-drail-find{background:#edf4fb;color:#12314d;}' +
      '.bsv-drail-call:hover{background:#12456f;}' +
      '.bsv-drail-quote:hover{background:#ea580c;}' +
      '.bsv-drail-find:hover{background:#dfeaf5;}' +
      '#bsv-exit-root{position:fixed;inset:0;z-index:11030;display:none;align-items:center;justify-content:center;background:rgba(8,15,25,.58);padding:16px;}' +
      '#bsv-exit-root.open{display:flex;}' +
      '#bsv-exit-card{width:min(520px,96vw);background:#fff;border:1px solid #dbe6f0;border-radius:14px;box-shadow:0 20px 52px rgba(0,0,0,.28);padding:16px;}' +
      '#bsv-exit-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}' +
      '#bsv-exit-title{margin:0;color:#10263c;font:800 22px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-exit-close{border:none;background:#f3f7fb;color:#1f3347;border-radius:8px;width:34px;height:34px;cursor:pointer;font-size:18px;line-height:1;}' +
      '#bsv-exit-body{margin-top:8px;color:#4d6276;font:600 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-exit-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;}' +
      '.bsv-exit-btn{border:none;border-radius:10px;min-height:40px;padding:9px 10px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;font:800 13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-exit-quote{background:#f97316;color:#fff;}' +
      '.bsv-exit-call{background:#0f3557;color:#fff;}' +
      '.bsv-exit-skip{background:#edf4fb;color:#12314d;grid-column:1/-1;}' +
      '.bsv-exit-quote:hover{background:#ea580c;}' +
      '.bsv-exit-call:hover{background:#12456f;}' +
      '.bsv-exit-skip:hover{background:#dfeaf5;}' +
      '#bsv-exit-note{margin-top:8px;color:#5a6f82;font:600 12px/1.35 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '.bsv-aio-highlight{outline:3px solid rgba(249,115,22,.5);animation:bsvAioFlash 1.4s ease;}' +
      '@keyframes bsvAioFlash{0%{background:rgba(249,115,22,.14);}100%{background:transparent;}}' +
      '#bsv-qd-overlay{position:fixed;inset:0;z-index:11000;background:rgba(8,15,25,.58);display:none;}' +
      '#bsv-qd-overlay.open{display:block;}' +
      '#bsv-qd-panel{position:absolute;top:0;right:0;height:100%;width:min(760px,100vw);background:#fff;box-shadow:-18px 0 42px rgba(0,0,0,.22);display:flex;flex-direction:column;}' +
      '#bsv-qd-head{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #e7eef5;}' +
      '#bsv-qd-title{margin:0;font:800 18px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#10263c;}' +
      '#bsv-qd-actions{display:flex;gap:8px;align-items:center;}' +
      '#bsv-qd-open-new{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;padding:8px 10px;border-radius:8px;background:#edf4fb;color:#12314d;font:700 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-qd-open-new[aria-disabled="true"]{opacity:.62;cursor:not-allowed;}' +
      '#bsv-qd-close{border:none;background:#f3f7fb;color:#1f3347;border-radius:8px;width:34px;height:34px;cursor:pointer;font-size:18px;line-height:1;}' +
      '#bsv-qd-context-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 14px;border-bottom:1px solid #edf2f7;background:#fafcff;}' +
      '#bsv-qd-context-text{color:#334a5f;font:600 12px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-qd-copy{border:none;background:#edf4fb;color:#12314d;border-radius:8px;padding:7px 10px;cursor:pointer;font:700 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-qd-qual{padding:10px 14px;border-bottom:1px solid #edf2f7;background:#fff;}' +
      '#bsv-qd-qual-label{display:block;margin:0 0 6px;color:#122f4a;font:700 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-qd-qual-row{display:flex;gap:8px;align-items:center;}' +
      '#bsv-qd-postal{flex:1;border:1px solid #d7e1eb;border-radius:10px;padding:10px 11px;font:700 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#13283f;outline:none;text-transform:uppercase;}' +
      '#bsv-qd-postal:focus{border-color:#0f3557;box-shadow:0 0 0 3px rgba(15,53,87,.12);}' +
      '#bsv-qd-check{border:none;border-radius:10px;padding:10px 12px;background:#0f3557;color:#fff;cursor:pointer;font:800 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;white-space:nowrap;}' +
      '#bsv-qd-check:hover{background:#12456f;}' +
      '#bsv-qd-qual-status{margin-top:7px;color:#5a6f82;font:600 12px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-qd-qual-status[data-state="ok"]{color:#0f6a3d;}' +
      '#bsv-qd-qual-status[data-state="warn"]{color:#934112;}' +
      '#bsv-qd-frame-wrap{position:relative;flex:1;min-height:0;}' +
      '#bsv-qd-gate{position:absolute;inset:0;z-index:2;display:none;align-items:center;justify-content:center;flex-direction:column;gap:10px;text-align:center;padding:16px;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(247,251,255,.98));}' +
      '#bsv-qd-gate.open{display:flex;}' +
      '#bsv-qd-gate-text{margin:0;color:#394f63;font:600 13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:420px;}' +
      '#bsv-qd-gate-call{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:0 12px;border-radius:9px;background:#0f3557;color:#fff;text-decoration:none;font:800 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}' +
      '#bsv-qd-frame{width:100%;height:100%;border:0;}' +
      '@media (max-width:980px){#bsv-aio-trust{grid-template-columns:1fr 1fr;}}' +
      '@media (max-width:1100px){#bsv-drail-root{display:none;}}' +
      '@media (max-width:900px){#bsv-aio-mobile{display:grid;}html.bsv-aio-mobile-pad body{padding-bottom:calc(86px + env(safe-area-inset-bottom,0px))!important;}#bsv-aio-faq{grid-template-columns:1fr;}}' +
      '@media (max-width:640px){#bsv-aio-fab{right:12px;bottom:12px;padding:11px 14px;font-size:13px;}#bsv-aio-title{font-size:19px;}#bsv-aio-results{grid-template-columns:1fr;}#bsv-aio-trust{grid-template-columns:1fr;}#bsv-qd-title{font-size:16px;}#bsv-exit-title{font-size:19px;}#bsv-exit-actions{grid-template-columns:1fr;}.bsv-mr-chip{padding:8px 10px;font-size:12px;}}';

    var style = document.createElement("style");
    style.id = IDS.style;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function closeDrawer() {
    var overlay = q("#bsv-qd-overlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openDrawerFromContext(ctxOverride) {
    var overlay = q("#bsv-qd-overlay");
    var frame = q("#bsv-qd-frame");
    var openNew = q("#bsv-qd-open-new");
    var contextText = q("#bsv-qd-context-text");

    var ctx = ctxOverride || app.quoteContext || {};
    app.quoteContext = {
      product: ctx.product || "",
      source: ctx.source || "Website",
      page: ctx.page || location.href,
      ts: ctx.ts || new Date().toISOString()
    };
    app.quoteSession = {
      iframeLoads: 0,
      submitted: false,
      source: app.quoteContext.source || "Website",
      product: app.quoteContext.product || "General"
    };

    if (contextText) {
      var productLabel = app.quoteContext.product ? ("Product: " + app.quoteContext.product + " | ") : "";
      contextText.textContent = "Context: " + productLabel + "Source: " + app.quoteContext.source;
    }

    if (frame && frame.hasAttribute("src")) frame.removeAttribute("src");

    if (!serviceAreaEnabled()) {
      if (frame) frame.setAttribute("src", formEmbedUrl(app.quoteContext));
      if (openNew) openNew.setAttribute("href", formOpenNewUrl(app.quoteContext));
    }
    applyServiceAreaGate();

    trackEvent("bs_quote_open", {
      source: app.quoteContext.source || "Website",
      product: app.quoteContext.product || "General",
      service_qualified: app.quoteContext.serviceQualified === true ? "yes" : (app.quoteContext.serviceQualified === false ? "no" : "unknown")
    });

    if (overlay) {
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function mountQuoteDrawer() {
    var root = document.createElement("div");
    root.id = IDS.drawerRoot;
    root.innerHTML = [
      '<div id="bsv-qd-overlay" aria-hidden="true">',
      '  <aside id="bsv-qd-panel" role="dialog" aria-modal="true" aria-labelledby="bsv-qd-title">',
      '    <div id="bsv-qd-head">',
      '      <h3 id="bsv-qd-title">Request a Quote</h3>',
      '      <div id="bsv-qd-actions">',
      '        <a id="bsv-qd-open-new" target="_blank" rel="noopener" data-quote-drawer="ignore">Open in New Tab</a>',
      '        <button id="bsv-qd-close" type="button" aria-label="Close">×</button>',
      '      </div>',
      '    </div>',
      '    <div id="bsv-qd-context-row">',
      '      <div id="bsv-qd-context-text">Context: General quote request</div>',
      '      <button id="bsv-qd-copy" type="button">Copy details</button>',
      '    </div>',
      '    <div id="bsv-qd-qual">',
      '      <label id="bsv-qd-qual-label" for="bsv-qd-postal">Delivery Postal Code</label>',
      '      <div id="bsv-qd-qual-row">',
      '        <input id="bsv-qd-postal" type="text" inputmode="text" autocomplete="postal-code" maxlength="7" placeholder="M5V 2T6" />',
      '        <button id="bsv-qd-check" type="button">Check Area</button>',
      '      </div>',
      '      <div id="bsv-qd-qual-status" data-state="idle">Enter a Canadian postal code to confirm delivery coverage.</div>',
      '    </div>',
      '    <div id="bsv-qd-frame-wrap">',
      '      <div id="bsv-qd-gate" class="open">',
      '        <p id="bsv-qd-gate-text">Enter your postal code and check service area to continue.</p>',
      '        <a id="bsv-qd-gate-call" href="' + esc(callUrl()) + '">Call Sales</a>',
      '      </div>',
      '      <iframe id="bsv-qd-frame" title="BuildSaver Quote Form" loading="lazy"></iframe>',
      '    </div>',
      '  </aside>',
      '</div>'
    ].join("");

    document.body.appendChild(root);

    var overlay = q("#bsv-qd-overlay");
    var panel = q("#bsv-qd-panel");
    var closeBtn = q("#bsv-qd-close");
    var copyBtn = q("#bsv-qd-copy");
    var openNew = q("#bsv-qd-open-new");
    var frame = q("#bsv-qd-frame");
    var postalInput = q("#bsv-qd-postal");
    var postalCheck = q("#bsv-qd-check");

    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", function (e) { if (!panel.contains(e.target)) closeDrawer(); });

    function runServiceAreaCheck(sourceOverride) {
      if (!serviceAreaEnabled()) return null;
      var rawPostal = postalInput ? postalInput.value : "";
      var state = setServiceAreaState(evaluateServiceArea(rawPostal));
      var ctx = app.quoteContext || {};
      var source = sourceOverride || ctx.source || "Website";

      trackEvent("bs_service_area_checked", {
        source: source,
        product: ctx.product || "General",
        postal_fsa: state.fsa || "",
        qualified: state.qualified ? "yes" : "no",
        reason: state.reason
      });

      if (state.checked && !state.qualified && state.reason === "out_of_area") {
        trackEvent("bs_service_area_blocked", {
          source: source,
          product: ctx.product || "General",
          reason: "out_of_area",
          postal_fsa: state.fsa || ""
        });
      }

      applyServiceAreaGate();
      return state;
    }

    if (postalInput) {
      postalInput.addEventListener("input", function () {
        var normalized = normalizePostal(postalInput.value);
        postalInput.value = formatPostal(normalized);

        var prev = getServiceAreaState();
        if (prev.normalized !== normalized || prev.checked) {
          setServiceAreaState({
            checked: false,
            valid: false,
            qualified: false,
            normalized: normalized,
            formatted: formatPostal(normalized),
            fsa: normalized.slice(0, 3),
            reason: normalized ? "pending" : "empty"
          });
          applyServiceAreaGate();
        }
      });

      postalInput.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        runServiceAreaCheck("Quote Drawer");
      });
    }

    if (postalCheck) {
      postalCheck.addEventListener("click", function () {
        runServiceAreaCheck("Quote Drawer");
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var ctx = app.quoteContext || {};
        var serviceLabel = ctx.serviceQualified === true ? "Qualified" : (ctx.serviceQualified === false ? "Outside Standard Area" : "Not checked");
        var lines = [
          "Quote Context",
          "Product: " + (ctx.product || "Not specified"),
          "Source: " + (ctx.source || "Website"),
          "Page: " + (ctx.page || location.href),
          "Time: " + (ctx.ts || new Date().toISOString()),
          "Postal: " + (ctx.postal || "Not provided"),
          "Service Area: " + serviceLabel
        ].join("\n");

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(lines).then(function () {
            copyBtn.textContent = "Copied";
            setTimeout(function () { copyBtn.textContent = "Copy details"; }, 1200);
          });
        }
      });
    }

    if (openNew) {
      openNew.addEventListener("click", function (e) {
        var ctx = app.quoteContext || {};
        var state = getServiceAreaState();

        if (serviceAreaEnabled() && !state.qualified) {
          e.preventDefault();
          trackEvent("bs_service_area_blocked", {
            source: ctx.source || "Website",
            product: ctx.product || "General",
            reason: state.reason || "not_qualified",
            postal_fsa: state.fsa || ""
          });
          applyServiceAreaGate();
          if (postalInput) postalInput.focus();
          return;
        }

        trackEvent("bs_quote_open_new_tab", {
          source: ctx.source || "Website",
          product: ctx.product || "General",
          postal_fsa: state.fsa || ""
        });
      });
    }

    if (frame) {
      frame.addEventListener("load", function () {
        var src = frame.getAttribute("src") || "";
        if (src.indexOf("docs.google.com/forms") === -1) return;

        var session = app.quoteSession;
        if (!session) return;

        session.iframeLoads += 1;

        if (session.iframeLoads === 1) {
          trackEvent("bs_quote_form_loaded", {
            source: session.source || "Website",
            product: session.product || "General"
          });
          return;
        }

        if (!session.submitted) {
          session.submitted = true;
          markQuoteSubmitted("iframe_reload_detected", {
            source: session.source || "Website",
            product: session.product || "General"
          });
        }
      });
    }

    applyServiceAreaGate();
    app.openDrawer = openDrawerFromContext;
  }

  function mountFinder() {
    var root = document.createElement("div");
    root.id = IDS.finder;
    root.innerHTML = [
      '<button id="bsv-aio-fab" type="button" aria-haspopup="dialog" aria-controls="bsv-aio-overlay">Find Product / Quote</button>',
      '<div id="bsv-aio-overlay" aria-hidden="true">',
      '  <div id="bsv-aio-modal" role="dialog" aria-modal="true" aria-labelledby="bsv-aio-title">',
      '    <div id="bsv-aio-head">',
      '      <div><h2 id="bsv-aio-title">Quick Product Finder</h2><p id="bsv-aio-sub">Search category, jump to section, then request your quote.</p></div>',
      '      <button id="bsv-aio-close" type="button" aria-label="Close">×</button>',
      '    </div>',
      '    <div id="bsv-aio-body">',
      '      <input id="bsv-aio-search" type="search" placeholder="Try: shingles, insulation, drywall..." />',
      '      <div id="bsv-aio-actions"><button id="bsv-aio-quote" class="bsv-aio-btn bsv-aio-btn-pri" type="button" data-open-quote-drawer="1" data-source="Finder">Request a Quote</button></div>',
      '      <div id="bsv-aio-results"></div>',
      '      <div id="bsv-aio-note"></div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join("");

    document.body.appendChild(root);

    var fab = q("#bsv-aio-fab");
    var overlay = q("#bsv-aio-overlay");
    var close = q("#bsv-aio-close");
    var search = q("#bsv-aio-search");
    var results = q("#bsv-aio-results");
    var note = q("#bsv-aio-note");

    function closeModal() {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function openModal(prefill, source) {
      note.textContent = "";
      search.value = prefill || "";
      render(search.value);
      trackEvent("bs_finder_open", {
        source: source || "Website",
        prefill: prefill || ""
      });
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(function () { search.focus(); }, 30);
    }

    function render(term) {
      var t = norm(term);
      var out = [];

      PRODUCTS.forEach(function (p, idx) {
        var hay = norm(p.title + " " + p.tags.join(" ") + " " + p.items.join(" "));
        if (!t || hay.indexOf(t) !== -1) {
          out.push(
            '<article class="bsv-aio-card">' +
              '<h3>' + esc(p.title) + '</h3>' +
              '<p>' + esc(p.items.slice(0, 4).join(" • ")) + '</p>' +
              '<div class="bsv-aio-row">' +
                '<button class="bsv-aio-btn bsv-aio-btn-sec" type="button" data-go="' + idx + '">View Section</button>' +
                '<button class="bsv-aio-btn bsv-aio-btn-pri" type="button" data-open-quote-drawer="1" data-product="' + esc(p.title) + '" data-source="Finder">Get Quote</button>' +
              '</div>' +
            '</article>'
          );
        }
      });

      results.innerHTML = out.length ? out.join("") : '<div class="bsv-aio-empty">No matches yet. Try another keyword.</div>';
    }

    if (fab) fab.addEventListener("click", function () { openModal("", "Finder FAB"); });
    if (close) close.addEventListener("click", closeModal);
    if (overlay) overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });
    if (search) search.addEventListener("input", function () { render(search.value); });

    if (results) {
      results.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-go]");
        if (!btn) return;

        var idx = Number(btn.getAttribute("data-go"));
        var p = PRODUCTS[idx];
        if (!p) return;

        var h = findHeading(p.title);
        if (!h) {
          note.textContent = "Could not find that exact heading in this layout. Use Get Quote.";
          return;
        }

        closeModal();
        h.scrollIntoView({ behavior: "smooth", block: "start" });
        h.classList.add("bsv-aio-highlight");
        setTimeout(function () { h.classList.remove("bsv-aio-highlight"); }, 1400);
      });
    }

    app.openFinder = function (prefill, source) {
      openModal(prefill || "", source || "Website");
    };
  }

  function mountTrust() {
    if (!isHome()) return null;

    var trust = document.createElement("section");
    trust.id = IDS.trust;

    trust.innerHTML =
      CONFIG.trust.map(function (x) {
        return '<div class="bsv-aio-trust-item"><strong>' + esc(x.t) + '</strong><span>' + esc(x.s) + '</span></div>';
      }).join("") +
      '<button class="bsv-aio-trust-cta" type="button" data-open-quote-drawer="1" data-source="Trust Strip">Get a Fast Quote</button>';

    var main = q("main") || document.body;
    var first = q(".page-section, [data-section-id], section", main);
    if (first && first.parentNode) first.insertAdjacentElement("afterend", trust);
    else main.insertBefore(trust, main.firstChild);

    return trust;
  }

  function mountMostRequested(anchorEl) {
    if (!isHome()) return null;

    var section = document.createElement("section");
    section.id = IDS.mostRequested;
    section.innerHTML =
      '<div class="bsv-mr-wrap">' +
        '<h3 class="bsv-mr-title">Most Requested Products</h3>' +
        '<div class="bsv-mr-row">' +
          CONFIG.mostRequested.map(function (chip) {
            return '<button class="bsv-mr-chip" type="button" data-open-finder="1" data-term="' + esc(chip.term) + '">' + esc(chip.label) + '</button>';
          }).join("") +
        '</div>' +
      '</div>';

    if (anchorEl && anchorEl.parentNode) anchorEl.insertAdjacentElement("afterend", section);
    else {
      var main = q("main") || document.body;
      var first = q(".page-section, [data-section-id], section", main);
      if (first && first.parentNode) first.insertAdjacentElement("afterend", section);
      else main.insertBefore(section, main.firstChild);
    }

    return section;
  }

  function mountCategories(anchorEl) {
    if (!isHome()) return null;

    var cats = document.createElement("section");
    cats.id = IDS.cats;

    cats.innerHTML =
      '<h2>Shop By Category</h2>' +
      '<div class="bsv-aio-cat-grid">' +
      PRODUCTS.map(function (p) {
        return (
          '<article class="bsv-aio-cat">' +
            '<h3>' + esc(p.title) + '</h3>' +
            '<p>' + esc(p.items.slice(0, 3).join(" • ")) + '</p>' +
            '<div class="bsv-aio-row">' +
              '<button class="bsv-aio-btn bsv-aio-btn-sec" type="button" data-open-finder="1" data-term="' + esc(p.title) + '">Open Finder</button>' +
              '<button class="bsv-aio-btn bsv-aio-btn-pri" type="button" data-open-quote-drawer="1" data-product="' + esc(p.title) + '" data-source="Category Grid">Quote</button>' +
            '</div>' +
          '</article>'
        );
      }).join("") +
      '</div>';

    if (anchorEl && anchorEl.parentNode) anchorEl.insertAdjacentElement("afterend", cats);
    else {
      var main = q("main") || document.body;
      var first = q(".page-section, [data-section-id], section", main);
      if (first && first.parentNode) first.insertAdjacentElement("afterend", cats);
      else main.insertBefore(cats, main.firstChild);
    }

    return cats;
  }

  function mountFaq(anchorEl) {
    if (!isHome()) return null;

    var faq = document.createElement("section");
    faq.id = IDS.faq;

    faq.innerHTML =
      '<article class="bsv-aio-faq-card">' +
        '<h2>How Ordering Works</h2>' +
        '<ol class="bsv-aio-steps">' +
          '<li>Choose a product category with Finder or Category cards.</li>' +
          '<li>Submit your quote request with quantity, location, and timeline.</li>' +
          '<li>Get pricing and delivery or pickup options quickly.</li>' +
        '</ol>' +
        '<button class="bsv-aio-faq-cta" type="button" data-open-quote-drawer="1" data-source="FAQ">Start Quote Request</button>' +
      '</article>' +
      '<article class="bsv-aio-faq-card">' +
        '<h2>Common Questions</h2>' +
        CONFIG.faqs.map(function (f, i) {
          return (
            '<div class="bsv-aio-faq-item">' +
              '<button class="bsv-aio-faq-btn" type="button" aria-expanded="false" data-faq-index="' + i + '">' +
                '<span>' + esc(f.q) + '</span><span>+</span>' +
              '</button>' +
              '<div class="bsv-aio-faq-answer" id="bsv-aio-faq-a-' + i + '">' + esc(f.a) + '</div>' +
            '</div>'
          );
        }).join("") +
      '</article>';

    faq.addEventListener("click", function (e) {
      var btn = e.target.closest(".bsv-aio-faq-btn");
      if (!btn) return;
      var idx = btn.getAttribute("data-faq-index");
      var ans = q("#bsv-aio-faq-a-" + idx);
      if (!ans) return;

      var isOpen = ans.classList.contains("open");
      ans.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      var icon = btn.querySelector("span:last-child");
      if (icon) icon.textContent = isOpen ? "+" : "-";
    });

    if (anchorEl && anchorEl.parentNode) anchorEl.insertAdjacentElement("afterend", faq);
    else {
      var main = q("main") || document.body;
      main.insertBefore(faq, main.firstChild);
    }

    var jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: CONFIG.faqs.map(function (f) {
        return {
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a }
        };
      })
    };

    var s = document.createElement("script");
    s.id = IDS.faqJson;
    s.type = "application/ld+json";
    s.text = JSON.stringify(jsonLd);
    document.head.appendChild(s);

    return faq;
  }

  function mountProof(anchorEl) {
    if (!isHome()) return null;

    var section = document.createElement("section");
    section.id = IDS.proof;

    section.innerHTML =
      '<article class="bsv-proof-card">' +
        '<h2>Contractor Reviews</h2>' +
        '<div class="bsv-proof-reviews">' +
          CONFIG.testimonials.map(function (t) {
            return (
              '<blockquote class="bsv-review">' +
                '<p>"' + esc(t.quote) + '"</p>' +
                '<footer>' + esc(t.name) + '</footer>' +
              '</blockquote>'
            );
          }).join("") +
        '</div>' +
        '<button class="bsv-proof-cta" type="button" data-open-quote-drawer="1" data-source="Reviews">Request Quote</button>' +
      '</article>';

    if (anchorEl && anchorEl.parentNode) anchorEl.insertAdjacentElement("afterend", section);
    else {
      var main = q("main") || document.body;
      main.insertBefore(section, main.firstChild);
    }

    return section;
  }

  function mountMobile() {
    var nav = document.createElement("nav");
    nav.id = IDS.mobile;
    nav.setAttribute("aria-label", "Quick actions");

    nav.innerHTML = [
      '<a class="bsv-aio-mb bsv-aio-mb-call" href="' + esc(callUrl()) + '">Call</a>',
      '<button class="bsv-aio-mb bsv-aio-mb-quote" type="button" data-open-quote-drawer="1" data-source="Mobile Bar">Quote</button>',
      '<button class="bsv-aio-mb bsv-aio-mb-find" id="bsv-aio-mobile-find" type="button">Catalog</button>'
    ].join("");

    document.body.appendChild(nav);
    document.documentElement.classList.add("bsv-aio-mobile-pad");

    var mobileFind = q("#bsv-aio-mobile-find", nav);
    if (mobileFind) {
      mobileFind.addEventListener("click", function () {
        if (typeof app.openFinder === "function") app.openFinder("", "Mobile Bar");
      });
    }
  }

  function mountDesktopRail() {
    var rail = document.createElement("aside");
    rail.id = IDS.desktopRail;
    rail.setAttribute("aria-label", "Quick actions");
    rail.innerHTML = [
      '<div id="bsv-drail">',
      '  <div class="bsv-drail-label">Quick Actions</div>',
      '  <a class="bsv-drail-btn bsv-drail-call" href="' + esc(callUrl()) + '">Call Sales</a>',
      '  <button class="bsv-drail-btn bsv-drail-quote" type="button" data-open-quote-drawer="1" data-source="Desktop Rail">Get Quote</button>',
      '  <button class="bsv-drail-btn bsv-drail-find" type="button" data-open-finder="1" data-term="">Find Product</button>',
      '</div>'
    ].join("");
    document.body.appendChild(rail);
  }

  function getSessionFlag(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }

  function setSessionFlag(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) {}
  }

  function getLocalNumber(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return 0;
      var n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    } catch (e) {
      return 0;
    }
  }

  function setLocalNumber(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (e) {}
  }

  function isDesktopViewport() {
    if (window.matchMedia) return window.matchMedia("(min-width: 1101px)").matches;
    return window.innerWidth > 1100;
  }

  function isExitSuppressed() {
    if (getSessionFlag(EXIT_CFG.sessionKey) === "1") return true;
    return Date.now() < getLocalNumber(EXIT_CFG.hiddenUntilKey);
  }

  function suppressExitNudge(days) {
    var ms = (days || EXIT_CFG.cooldownDays) * 24 * 60 * 60 * 1000;
    setLocalNumber(EXIT_CFG.hiddenUntilKey, Date.now() + ms);
    setSessionFlag(EXIT_CFG.sessionKey, "1");
  }

  function closeExitNudge(suppress) {
    var root = q("#" + IDS.exitNudge);
    if (!root) return;
    root.classList.remove("open");
    root.setAttribute("aria-hidden", "true");
    if (suppress) suppressExitNudge(EXIT_CFG.cooldownDays);
  }

  function openExitNudge() {
    var root = q("#" + IDS.exitNudge);
    if (!root) return;
    if (isExitSuppressed()) return;
    trackEvent("bs_exit_intent_shown", { source: "Exit Intent Nudge" });
    root.classList.add("open");
    root.setAttribute("aria-hidden", "false");
    setSessionFlag(EXIT_CFG.sessionKey, "1");
  }

  function mountExitNudge() {
    var root = document.createElement("div");
    root.id = IDS.exitNudge;
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = [
      '<div id="bsv-exit-card" role="dialog" aria-modal="true" aria-labelledby="bsv-exit-title">',
      '  <div id="bsv-exit-top">',
      '    <h3 id="bsv-exit-title">Need pricing before you go?</h3>',
      '    <button id="bsv-exit-close" type="button" aria-label="Close">×</button>',
      '  </div>',
      '  <div id="bsv-exit-body">Send a quick quote request and we will follow up with pricing and delivery options.</div>',
      '  <div id="bsv-exit-actions">',
      '    <button class="bsv-exit-btn bsv-exit-quote" type="button" data-open-quote-drawer="1" data-source="Exit Intent Nudge">Get Fast Quote</button>',
      '    <a class="bsv-exit-btn bsv-exit-call" href="' + esc(callUrl()) + '">Call Sales</a>',
      '    <button id="bsv-exit-skip" class="bsv-exit-btn bsv-exit-skip" type="button">No thanks</button>',
      '  </div>',
      '  <div id="bsv-exit-note">We only show this once per session.</div>',
      '</div>'
    ].join("");
    document.body.appendChild(root);

    var closeBtn = q("#bsv-exit-close", root);
    var skipBtn = q("#bsv-exit-skip", root);
    var quoteBtn = q(".bsv-exit-quote", root);
    var callBtn = q(".bsv-exit-call", root);

    if (closeBtn) closeBtn.addEventListener("click", function () { closeExitNudge(true); });
    if (skipBtn) skipBtn.addEventListener("click", function () { closeExitNudge(true); });
    if (quoteBtn) quoteBtn.addEventListener("click", function () { closeExitNudge(true); });
    if (callBtn) callBtn.addEventListener("click", function () { suppressExitNudge(EXIT_CFG.cooldownDays); });

    root.addEventListener("click", function (e) {
      if (e.target === root) closeExitNudge(true);
    });
  }

  function bindExitIntent() {
    if (app.exitBound) return;
    app.exitBound = true;

    var readyAt = Date.now() + EXIT_CFG.minDelayMs;

    document.addEventListener("mouseout", function (e) {
      if (Date.now() < readyAt) return;
      if (!isDesktopViewport()) return;
      if (isExitSuppressed()) return;
      if (!e) return;
      if (e.relatedTarget || e.toElement) return;
      if (typeof e.clientY === "number" && e.clientY > 8) return;
      if (q("#bsv-aio-overlay.open") || q("#bsv-qd-overlay.open")) return;
      openExitNudge();
    }, true);
  }

  function bindGlobalCapture() {
    if (app.captureBound) return;
    app.captureBound = true;

    var quoteSelectors = [
      'a[href*="forms.gle"]',
      'a[href*="docs.google.com/forms"]',
      '#bsv-aio-quote',
      '.bsv-aio-btn-pri',
      '.bsv-aio-mb-quote',
      '.bsv-aio-trust-cta',
      '.bsv-aio-faq-cta',
      '.bsv-proof-cta',
      '[data-open-quote-drawer]'
    ].join(",");

    document.addEventListener("click", function (e) {
      var callTrigger = e.target.closest('a[href^="tel:"]');
      if (callTrigger) {
        var callCtx = inferContext(callTrigger);
        trackEvent("bs_call_click", {
          source: callCtx.source || "Website",
          phone: callTrigger.getAttribute("href") || ""
        });
      }

      var quoteTrigger = e.target.closest(quoteSelectors);
      if (quoteTrigger) {
        if (quoteTrigger.getAttribute("data-quote-drawer") === "ignore") return;
        if (quoteTrigger.closest("#bsv-qd-panel")) return;

        e.preventDefault();
        app.quoteContext = inferContext(quoteTrigger);
        if (typeof app.openDrawer === "function") app.openDrawer();
        return;
      }

      var finderTrigger = e.target.closest("[data-open-finder]");
      if (finderTrigger) {
        var term = finderTrigger.getAttribute("data-term") || "";
        var finderCtx = inferContext(finderTrigger);
        if (typeof app.openFinder === "function") app.openFinder(term, finderCtx.source || "Website");
      }
    }, true);

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;

      var finderOverlay = q("#bsv-aio-overlay");
      if (finderOverlay && finderOverlay.classList.contains("open")) {
        finderOverlay.classList.remove("open");
        finderOverlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        return;
      }

      var drawerOverlay = q("#bsv-qd-overlay");
      if (drawerOverlay && drawerOverlay.classList.contains("open")) {
        closeDrawer();
        return;
      }

      var exitOverlay = q("#" + IDS.exitNudge);
      if (exitOverlay && exitOverlay.classList.contains("open")) {
        closeExitNudge(true);
      }
    });
  }

  function mountAll() {
    cleanup();
    injectStyle();
    initAnalytics();
    captureReturnSubmitSignal();
    window.BUILDSAVER_ANALYTICS = window.BUILDSAVER_ANALYTICS || {};
    window.BUILDSAVER_ANALYTICS.getState = getAnalyticsState;
    window.BUILDSAVER_ANALYTICS.track = trackEvent;
    window.BUILDSAVER_ANALYTICS.markQuoteSubmitted = markQuoteSubmitted;
    bindGlobalCapture();

    app.quoteContext = { product: "", source: "Website", page: location.href, ts: new Date().toISOString() };

    mountQuoteDrawer();
    mountFinder();
    var trust = mountTrust();
    var mr = mountMostRequested(trust);
    var cats = mountCategories(mr || trust);
    var faq = mountFaq(cats || mr || trust);
    mountProof(faq || cats || mr || trust);
    mountMobile();
    mountDesktopRail();
    mountExitNudge();
    bindExitIntent();
  }

  app.remount = mountAll;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll);
  } else {
    mountAll();
  }

  if (!app.mercuryBound) {
    document.addEventListener("mercury:load", mountAll);
    app.mercuryBound = true;
  }
})();
/* BuildSaver deploy metadata */
window.__BUILDSAVER_DEPLOY_BUILD_AT = "2026-04-13T04:47:42Z";
window.__BUILDSAVER_DEPLOY_SOURCE_SHA = "19cec003d4fa2872eadfd6860908fde1a626edda";
