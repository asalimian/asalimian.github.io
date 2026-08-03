let model = "ContributionCalculator";

function loadDefaults(upgrade = false) {
  var currentTime = new Date();
  payload = {
    "Optimistic Scenario": {
      Principle: "100",
      Goal: "2000",
      Rate: "7",
      Years: "30",
      Contribution: "25",
    },
    "Pessimistic Scenario": {
      Principle: "200",
      Goal: "2000",
      Rate: "4",
      Years: "30",
      Contribution: "25",
    },
    app_url: "https://asalimian.github.io/contributionreturns/app.html",
    "last_update": currentTime,
  };

  datamodel = JSON.parse(document.getElementById("savebox").value);
  datamodel[model] = payload;

  payload = JSON.stringify(datamodel);
  document.getElementById("savebox").value = payload;

  return datamodel;
}

function loaddata() {
  if (localStorage.logplot == "true") {
    document.getElementById("logplot").checked = localStorage.logplot;
    layout.yaxis.type = "log";
  } else {
    layout.yaxis.type = null;
  }

  if (localStorage["autosave"] == "true") {
    document.getElementById("autosave").checked = true;
    document.getElementById("savebox").value = localStorage["json_settings"];
  }

  payload = JSON.parse(document.getElementById("savebox").value);

  if (payload[model] == null) {
    payload = loadDefaults();
  }

  datamodel = payload[model];

  now = new Date();
  last_update = new Date(datamodel.last_update);

  timeshift = (now - last_update) / 1000 / 3600 / 24 / 365.25;

  document.getElementById("pmax_opt").value =
    datamodel["Optimistic Scenario"]["Goal"];
  document.getElementById("pmax_pes").value =
    datamodel["Pessimistic Scenario"]["Goal"];
  document.getElementById("p0_opt").value = growWithContributions(
    datamodel["Optimistic Scenario"]["Principle"],
    datamodel["Optimistic Scenario"]["Contribution"],
    datamodel["Optimistic Scenario"]["Rate"],
    timeshift,
  ).toFixed(2);
  document.getElementById("p0_pes").value = growWithContributions(
    datamodel["Pessimistic Scenario"]["Principle"],
    datamodel["Pessimistic Scenario"]["Contribution"],
    datamodel["Pessimistic Scenario"]["Rate"],
    timeshift,
  ).toFixed(2);
  document.getElementById("r_opt").value =
    datamodel["Optimistic Scenario"]["Rate"];
  document.getElementById("r_pes").value =
    datamodel["Pessimistic Scenario"]["Rate"];
  document.getElementById("years_opt").value =
    (Number(datamodel["Optimistic Scenario"]["Years"]) - timeshift).toFixed(2);
  document.getElementById("years_pes").value =
    (Number(datamodel["Pessimistic Scenario"]["Years"]) - timeshift).toFixed(2);
  document.getElementById("cont_opt").value =
    datamodel["Optimistic Scenario"]["Contribution"];
  document.getElementById("cont_pes").value =
    datamodel["Pessimistic Scenario"]["Contribution"];

  calcContributions();
  calcSavings();
  syncDatesFromYears();

  console.log("App Data loaded");
}

function calcContributions() {
  Tm = document.getElementById("years_opt").value * 1;
  r = document.getElementById("r_opt").value.replace("%", "") / 100;
  c = document.getElementById("cont_opt").value.replace("$", "").replace(
    /,/g,
    "",
  ) * 1;
  P0 =
    document.getElementById("p0_opt").value.replace("$", "").replace(/,/g, "") *
    1;
  Pm = document.getElementById("pmax_opt").value.replace("$", "").replace(
    /,/g,
    "",
  ) * 1;
  t = Tm - 1 / r * Math.log((r / c * P0 + 1) * Math.exp(r * Tm) - r / c * Pm);
  t = Math.min(Math.max(0, t), Tm);
  time_opt = t.toFixed(2);
  Tm = document.getElementById("years_pes").value * 1;
  r = document.getElementById("r_pes").value.replace("%", "") / 100;
  c = document.getElementById("cont_pes").value.replace("$", "").replace(
    /,/g,
    "",
  ) * 1;
  P0 =
    document.getElementById("p0_pes").value.replace("$", "").replace(/,/g, "") *
    1;
  Pm = document.getElementById("pmax_pes").value.replace("$", "").replace(
    /,/g,
    "",
  ) * 1;
  t = Tm - 1 / r * Math.log((r / c * P0 + 1) * Math.exp(r * Tm) - r / c * Pm);
  t = Math.min(Math.max(0, t), Tm);
  time_pes = t.toFixed(2);

  document.getElementById("time_opt").value = time_opt;
  document.getElementById("time_pes").value = time_pes;

  num2text(document.getElementById("time_opt"));
  num2text(document.getElementById("time_pes"));
  return { "opt": time_opt, "pes": time_pes };
}
function calcSavings() {
  Tm = document.getElementById("years_opt").value * 1;
  r = document.getElementById("r_opt").value.replace("%", "") / 100;
  P0 =
    document.getElementById("p0_opt").value.replace("$", "").replace(/,/g, "") *
    1 * 1;
  Pm = document.getElementById("pmax_opt").value.replace("$", "").replace(
    /,/g,
    "",
  ) * 1 * 1;
  c = -r * (P0 * Math.exp(r * Tm) - Pm) / (Math.exp(r * Tm) - 1);
  lux_opt = Math.round(c * 100) / 100;
  Tm = document.getElementById("years_pes").value * 1;
  r = document.getElementById("r_pes").value.replace("%", "") / 100;
  P0 =
    document.getElementById("p0_pes").value.replace("$", "").replace(/,/g, "") *
    1 * 1;
  Pm = document.getElementById("pmax_pes").value.replace("$", "").replace(
    /,/g,
    "",
  ) * 1 * 1;
  c = -r * (P0 * Math.exp(r * Tm) - Pm) / (Math.exp(r * Tm) - 1);
  lux_pes = Math.round(c * 100) / 100;

  document.getElementById("lux_opt").value = lux_opt;
  document.getElementById("lux_pes").value = lux_pes;

  num2text(document.getElementById("lux_opt"), "$ ");
  num2text(document.getElementById("lux_pes"), "$ ");

  return { "opt": lux_opt, "pes": lux_pes };
}

function updateData() {
  var currentTime = new Date();

  time = calcContributions();
  lux = calcSavings();
  pmax_opt = document.getElementById("pmax_opt").value;
  pmax_pes = document.getElementById("pmax_pes").value;
  p0_opt = document.getElementById("p0_opt").value;
  p0_pes = document.getElementById("p0_pes").value;
  r_opt = document.getElementById("r_opt").value;
  r_pes = document.getElementById("r_pes").value;
  years_opt = document.getElementById("years_opt").value;
  years_pes = document.getElementById("years_pes").value;
  syncDatesFromYears();
  cont_opt = document.getElementById("cont_opt").value;
  cont_pes = document.getElementById("cont_pes").value;

  pmax_opt = pmax_opt.replace("$", "").replace(/,/g, "") * 1;
  pmax_pes = pmax_pes.replace("$", "").replace(/,/g, "") * 1;
  p0_opt = p0_opt.replace("$", "").replace(/,/g, "") * 1;
  p0_pes = p0_pes.replace("$", "").replace(/,/g, "") * 1;
  r_opt = r_opt.replace("%", "");
  r_pes = r_pes.replace("%", "");
  years_opt = years_opt;
  years_pes = years_pes;
  cont_opt = cont_opt.replace("$", "").replace(/,/g, "") * 1;
  cont_pes = cont_pes.replace("$", "").replace(/,/g, "") * 1;

  payload = JSON.parse(document.getElementById("savebox").value);
  payload.ContributionCalculator = {
    "Optimistic Scenario": {
      "Principle": p0_opt,
      "Goal": pmax_opt,
      "Rate": r_opt,
      "Years": years_opt,
      "Contribution": cont_opt,
    },
    "Pessimistic Scenario": {
      "Principle": p0_pes,
      "Goal": pmax_pes,
      "Rate": r_pes,
      "Years": years_pes,
      "Contribution": cont_pes,
    },
    "app_url": "https://asalimian.github.io/contributionreturns/loan.html",
    "last_update": currentTime,
  };
  document.getElementById("savebox").value = JSON.stringify(payload);

  
  if (localStorage["autosave"] == "true") {
    localStorage["json_settings"] = document.getElementById("savebox").value;
    localStorage["logplot"] = document.getElementById("logplot").checked;
  }

  if (lux.opt * 1 > cont_opt * 1) {
    document.getElementById("status_opt").value = "Off Track";
    document.getElementById("status_opt").className = "offtrack";
  } else if (time.opt * 1 <= 0) {
    document.getElementById("status_opt").value = "Oversaved";
    document.getElementById("status_opt").className = "oversaved";
  } else {
    document.getElementById("status_opt").value = "On Track";
    document.getElementById("status_opt").className = "ontrack";
  }

  if (lux.pes * 1 > cont_pes * 1) {
    document.getElementById("status_pes").value = "Off Track";
    document.getElementById("status_pes").className = "offtrack";
  } else if (time.pes * 1 <= 0) {
    document.getElementById("status_pes").value = "Oversaved";
    document.getElementById("status_pes").className = "oversaved";
  } else {
    document.getElementById("status_pes").value = "On Track";
    document.getElementById("status_pes").className = "ontrack";
  }

  optcoast = expgrowth(
    pmax_opt / Math.exp(r_opt / 100 * (years_opt - time_opt)),
    r_opt,
    years_opt * 1 - time.opt * 1,
    currentTime.getFullYear() + currentTime.getMonth() / 12 + time.opt,
  );
  pescoast = expgrowth(
    pmax_pes / Math.exp(r_pes / 100 * (years_pes - time_pes)),
    r_pes,
    years_pes - time_pes,
    currentTime.getFullYear() + currentTime.getMonth() / 12 + time_pes,
  );
  if (time.opt == 0) {
    ylen = years_opt;
  } else {
    ylen = time.opt;
  }
  optcontrib = expcont(
    p0_opt,
    cont_opt,
    r_opt,
    ylen,
    currentTime.getFullYear() + currentTime.getMonth() / 12,
  );
  if (time_pes == 0) {
    ylen = years_pes;
  } else {
    ylen = time_pes;
  }
  pescontrib = expcont(
    p0_pes,
    cont_pes,
    r_pes,
    ylen,
    currentTime.getFullYear() + currentTime.getMonth() / 12,
  );

  graphDiv = document.getElementById("tester");

  // Design token colors (kept in sync with app.css)
  // RGB equivalents of --opt / --pes tokens (Plotly doesn't parse oklch())
  var COLOR_OPT = "#144c73"; // --opt        (contributions)
  var COLOR_OPT_RETURNS = "#419ede"; // lighter green (returns)
  var COLOR_PES = "#951b1c"; // --pes        (contributions)
  var COLOR_PES_RETURNS = "#e36667"; // lighter blue  (returns)

  //update the layout and all the traces
  Plotly.react(TESTER, [{
    x: pescontrib[0],
    y: pescontrib[1],
    name: "Pessimistic Contributions",
    marker: { color: COLOR_PES },
    line: { color: COLOR_PES, width: 2 },
  }, {
    x: pescoast[0],
    y: pescoast[1],
    name: "Pessimistic Returns",
    marker: { color: COLOR_PES_RETURNS },
    line: { color: COLOR_PES_RETURNS, width: 2.5 },
  }, {
    x: optcontrib[0],
    y: optcontrib[1],
    name: "Optimistic Contributions",
    marker: { color: COLOR_OPT },
    line: { color: COLOR_OPT, width: 2 },
  }, {
    x: optcoast[0],
    y: optcoast[1],
    name: "Optimistic Returns",
    marker: { color: COLOR_OPT_RETURNS },
    line: { color: COLOR_OPT_RETURNS, width: 2.5 },
  }], layout);

  // Populate desktop status cards + mobile chips
  updateStatusCards(time, lux, cont_opt, cont_pes);
}

function updateStatusCards(time, lux, cont_opt, cont_pes) {
  var optEl = document.getElementById("status_card_opt");
  var pesEl = document.getElementById("status_card_pes");
  var doneOpt = document.getElementById("done_opt");
  var donePes = document.getElementById("done_pes");
  var chipOpt = document.getElementById("chip_opt");
  var chipPes = document.getElementById("chip_pes");

  function labelFor(luxVal, timeVal, contVal) {
    if (luxVal * 1 > contVal * 1) return "Off Track";
    if (timeVal * 1 <= 0) return "Oversaved";
    return "On Track";
  }

  var optLabel = labelFor(lux.opt, time.opt, cont_opt);
  var pesLabel = labelFor(lux.pes, time.pes, cont_pes);

  if (optEl) optEl.textContent = optLabel;
  if (pesEl) pesEl.textContent = pesLabel;
  if (doneOpt) {
    doneOpt.textContent = Math.max(0, Math.round(time.opt * 10) / 10);
  }
  if (donePes) {
    donePes.textContent = Math.max(0, Math.round(time.pes * 10) / 10);
  }
  if (chipOpt) chipOpt.textContent = "Optimistic: " + optLabel;
  if (chipPes) chipPes.textContent = "Pessimistic: " + pesLabel;
}

// Project balance forward by `t` years under continuous contribution at rate `r`.
// Solves dP/dt = rP + c, giving P(t) = P0*e^(rt) + (c/r)*(e^(rt) - 1).
function projectBalance(p0Str, rStr, cStr, t) {
  const P0 = text2num(p0Str);
  const r = text2num(rStr) / 100;
  const c = text2num(cStr);
  if (Math.abs(r) < 1e-9) return P0 + c * t;
  return 1000; //P0 * Math.exp(r * t) + (c / r) * (Math.exp(r * t) - 1);
}

// Convert years (number) to an ISO date string `today + years*365.25 days`.
function yearsToISODate(years) {
  var ms = Date.now() + Number(years) * 365.25 * 24 * 3600 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
}

// Refresh both date inputs from the current years values.
// Skipped while the user is mid-edit on a date input (see dateToYears).
function syncDatesFromYears() {
  if (_dateEditInFlight) return;
  var dateOpt = document.getElementById("date_opt");
  var datePes = document.getElementById("date_pes");
  if (dateOpt) {
    dateOpt.value = yearsToISODate(document.getElementById("years_opt").value);
  }
  if (datePes) {
    datePes.value = yearsToISODate(document.getElementById("years_pes").value);
  }
}

// User edited a date input — convert back to fractional years and recompute.
// Sets a flag so updateData() skips the years→date round-trip that would
// drift the user's selected date by a day or two due to rounding.
var _dateEditInFlight = false;
function dateToYears(el, scenario) {
  if (!el.value) return;
  var goal = new Date(el.value).getTime();
  var years = (goal - Date.now()) / (365.25 * 24 * 3600 * 1000);
  years = Math.max(0, years);
  document.getElementById("years_" + scenario).value = years.toFixed(2);
  _dateEditInFlight = true;
  try {
    updateData();
  } finally {
    _dateEditInFlight = false;
  }
}
