/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */

function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function text2num(el) {
  interior = el.value.replace('$', '').replace('%', '').replace(/,/g, '').replace('k', '')
  if (interior.includes('+')) {
    interior = interior.split('+').reduce(function (accumVariable, curValue) {
      return Number(accumVariable) + Number(curValue)
    }, 0);
  }
  value = el.value.replace('$', '').replace('%', '').replace(/,/g, '').replace('k', '') * 1
  el.type = "number"
  el.value = value
}
function num2text(el,pre='',suf='') {
  interior = el.value.replace('$', '').replace('%', '').replace(/,/g, '').replace('k', '')
  if (interior.includes('+')) {
    console.log('detected')
    interior = interior.split('+').reduce(function (accumVariable, curValue) {
      return Number(accumVariable) + Number(curValue)
    }, 0);
  }
  value = pre+Number(interior).toLocaleString()+suf;
  el.type = "text"
  el.value = value
  if (localStorage['autosave'] == 'true') {
    localStorage['json_settings'] = document.getElementById('savebox').value
    localStorage['logplot'] = document.getElementById('logplot').checked
  }
}

function strip(str) {
  return str.replace('$', '').replace(/,/g, '').replace('%', '').replace('k', '')
}


function init() {
  if (localStorage.autosave == null || !(localStorage.autosave == "true")) {
    loadDefaults()
  } else {
    document.getElementById("savebox").value = localStorage.json_settings
    document.getElementById("autosave").checked = true
    datamodel = JSON.parse(localStorage.json_settings)
    if (datamodel.length > 0) {
      loadDefaults(true)
    }
  }
  loaddata()
  updateData()
  if (localStorage.secondVisit == null) {
    toggleHelpWindow()
    localStorage.secondVisit = true
  if (model != 'app') {
    localStorage.last = model
    console.log(model)
  }
}

function toggleSaveWindow() {
  if (document.getElementById("save").style.display == "block") {
    document.getElementById("save").style.display = "none";
  } else {
    document.getElementById("save").style.display = "block";
  }
  document.getElementById("help").style.display = "none";
  document.getElementById("plot").style.display = "block";

}
function toggleAutoSave(item) {
  localStorage.setItem('autosave', item.checked)
  if (item.checked == false) {
    delete localStorage.json_settings
    delete localStorage.secondVisit
  } else {
    loadDefaults()
    localStorage['json_settings'] = document.getElementById('savebox').value
    updateData()
    console.log(model)
  }

}
function toggleLogAxis(item) {
  if (item.checked == true) {
    layout.yaxis.type = 'log';
    updateData()
  } else {
    layout.yaxis.type = null;
    updateData()
  }

}
function toggleHelpWindow() {
  document.getElementById("save").style.display = "none";
  if (document.getElementById("help").style.display == "block") {
    document.getElementById("help").style.display = "none";
    document.getElementById("plot").style.display = "block";
  } else {
    document.getElementById("help").style.display = "block";
    document.getElementById("plot").style.display = "none";
  }
}
function expgrowth(principle, rate, years, y0) {
  n = 100
  x = [...Array(n + 1).keys()]
  expgrow = x => principle * Math.exp(x * rate / 100 / n * years);
  yadd = y => (y / n * years + y0 - 1970) * 1000 * 3600 * 24 * 365.24;
  return [x.map(yadd), x.map(expgrow)];
}
function expcont(principle, contrib, rate, years, y0) {
  n = 100
  x = [...Array(n + 1).keys()]
  expgrow = x => principle * Math.exp(x * (rate / 100 / n * years)) + contrib / (rate / 100) * (Math.exp(x * (rate / 100 / n * years)) - 1);
  yadd = y => (y / n * years + y0 - 1970) * 1000 * 3600 * 24 * 365.24;
  return [x.map(yadd), x.map(expgrow)];
}

function addarray(array1, array2) {
  var sum = array1.map(function (num, idx) {
    return num + array2[idx];
  }); // [6,8,10,12]
  return sum
}

function subarray(array1, array2) {
  var sum = array1.map(function (num, idx) {
    return num - array2[idx];
  }); // [6,8,10,12]
  return sum
}