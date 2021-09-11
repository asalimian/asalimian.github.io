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
    value = el.value.replace('%','').replace('$','').replace(/,/g,'') * 1
    el.type = "number"
    el.value = value
}
function num2text(el,pre='',suf='') {
  value = pre+Number(el.value.replace('%','').replace(',','')).toLocaleString()+suf;
  el.type = "text"
  el.value = value
  if (localStorage['autosave'] == 'true') {
      localStorage['json_settings'] = document.getElementById('savebox').value
      localStorage['logplot'] = document.getElementById('logplot').checked
  }
}

function loadDefaults(upgrade=false) {
  var currentTime = new Date()
  loanpaydefault = {"Loan":{"Principle":"$ 100000","Rate":"5 %","MinPay":"$ 536"},"Savings":{"Principle":"$ 0","Rate":"7 %"},"Budget":{"Income":"$ 1050","Split":"0.60"},"app_url":"https://asalimian.github.io/contributionreturns/loan.html","last_update":currentTime}

  if (upgrade==false) {
    datamodel = {}
    datamodel.ContributionCalculator = {"Optimistic Scenario":{"Principle":"$ 100","Goal":"$ 2,000","Rate":"7","Years":"30","Contribution":"$ 25"},"Pessimistic Scenario":{"Principle":"$ 200","Goal":"$ 2,000","Rate":"4","Years":"30","Contribution":"$ 25"},"app_url":"https://asalimian.github.io/contributionreturns/app.html","last_update":currentTime}
    datamodel.LoanPayoffCalculator = loanpaydefault
  }
  if (upgrade==true) {
    datamodel_old = JSON.parse(document.getElementById("savebox").value)
    datamodel = {}
    datamodel.ContributionCalculator = datamodel_old[0]
    datamodel.LoanPayoffCalculator = loanpaydefault
    
  }
  payload = JSON.stringify(datamodel)
  document.getElementById("savebox").value = payload

  return datamodel
  
}

function init() {
  if (localStorage.autosave == null || !(localStorage.autosave == "true")) {
      loadDefaults()
      loaddata()
      updateData()
  } else {
      document.getElementById("savebox").value = localStorage.json_settings
      document.getElementById("autosave").checked = true
      datamodel = JSON.parse(localStorage.json_settings)
      if (datamodel.length>0) {
        loadDefaults(true)
      }
      loaddata()
      updateData()
  }

}

function toggleSaveWindow() {
  if (document.getElementById("save").style.display == "block") {
      document.getElementById("save").style.display = "none";
  } else {
      document.getElementById("save").style.display = "block";
  }
  document.getElementById("help").style.display = "none";

}
function toggleAutoSave(item) {
  localStorage.setItem('autosave', item.checked)
  if (item.checked == false) {
      delete localStorage.json_settings
  } else {
      loadDefaults()
      localStorage['json_settings'] = document.getElementById('savebox').value
      updateData()
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