/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */

function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function strip(str) {
  interior = str.replace("$", "").replace("%", "").replace(/,/g, "").replace(
    "k",
    "",
  );
  if (interior.includes("+")) {
    interior = interior.split("+").reduce(function (accumVariable, curValue) {
      return Number(accumVariable) + Number(curValue);
    }, 0);
  }
  return Number(interior);
}

function text2num(el) {
  var val = strip(el.value);
  el.type = "number";
  el.value = val;
}
function num2text(el, pre = "", suf = "") {
  el.type = "text";
  el.value = pre + strip(el.value).toLocaleString() + suf;
  if (localStorage["autosave"] == "true") {
    localStorage["json_settings"] = document.getElementById("savebox").value;
    localStorage["logplot"] = document.getElementById("logplot").checked;
  }
}

function init() {
  if (localStorage.autosave == null || !(localStorage.autosave == "true")) {
    loadDefaults();
  } else {
    document.getElementById("savebox").value = localStorage.json_settings;
    document.getElementById("autosave").checked = true;
    datamodel = JSON.parse(localStorage.json_settings);
    if (datamodel.length > 0) {
      loadDefaults(true);
    }
  }
  loaddata();
  updateData();
  if (localStorage[model] == null) {
    localStorage[model] = true;
    toggleHelpWindow();
  }
  if (model != "app") {
    localStorage.last = model;
    console.log(model);
  }
}

function toggleSaveWindow() {
  toggleModal("save");
}
function toggleAutoSave(item) {
  localStorage.setItem("autosave", item.checked);
  if (item.checked == false) {
    delete localStorage.json_settings;
    delete localStorage.secondVisit;
    delete localStorage.PlanCalculator;
    delete localStorage.JobCalculator;
    delete localStorage.LoanPayoffCalculator;
    delete localStorage.ContributionCalculator;
  } else {
    loadDefaults();
    localStorage["json_settings"] = document.getElementById("savebox").value;
    updateData();
    console.log(model);
  }
}
function toggleLogAxis(item) {
  if (item.checked == true) {
    layout.yaxis.type = "log";
    updateData();
  } else {
    layout.yaxis.type = null;
    updateData();
  }
}
function toggleHelpWindow() {
  toggleModal("help");
}

function toggleModal(id) {
  var dialog = document.getElementById(id);
  if (!dialog) return;
  if (dialog.open) {
    dialog.close();
    return;
  }
  closeAllModals();
  dialog.showModal();
}

function closeAllModals() {
  ["save", "help"].forEach(function (id) {
    var dialog = document.getElementById(id);
    if (dialog && dialog.open) dialog.close();
  });
}

// Click on the dialog's backdrop (i.e. outside its content box) closes it.
document.addEventListener("click", function (e) {
  var target = e.target;
  if (target.tagName === "DIALOG" && target.open) target.close();
});
function expgrowth(principle, rate, years, y0) {
  n = 100;
  x = [...Array(n + 1).keys()];
  expgrow = (x) => principle * Math.exp(x * rate / 100 / n * years);
  yadd = (y) => (y / n * years + y0 - 1970) * 1000 * 3600 * 24 * 365.24;
  return [x.map(yadd), x.map(expgrow)];
}
function growWithContributions(principle, contrib, rate, years) {
  return principle * Math.exp(years * rate / 100 ) +
    contrib / (rate / 100) * (Math.exp(years * rate / 100 ) - 1);
};
function expcont(principle, contrib, rate, years, y0) {
  n = 100;
  x = [...Array(n + 1).keys()];
  expgrow = (x) =>
    principle * Math.exp(x * (rate / 100 / n * years)) +
    contrib / (rate / 100) * (Math.exp(x * (rate / 100 / n * years)) - 1);
  yadd = (y) => (y / n * years + y0 - 1970) * 1000 * 3600 * 24 * 365.24;
  return [x.map(yadd), x.map(expgrow)];
}

function addarray(array1, array2) {
  var sum = array1.map(function (num, idx) {
    return num + array2[idx];
  }); // [6,8,10,12]
  return sum;
}

function subarray(array1, array2) {
  var sum = array1.map(function (num, idx) {
    return num - array2[idx];
  }); // [6,8,10,12]
  return sum;
}
