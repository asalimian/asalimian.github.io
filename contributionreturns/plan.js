let model = "PlanCalculator"

function loadDefaults() {
    var currentTime = new Date()
    payload = {
        planA: { name: 'Plan A', premium: '$ 175', frequency: 26, deductable: '$  750', coinsurance: '80 %', oop: '$ 4000', discount: '$    0' },
        planB: { name: 'Plan B', premium: '$ 80', frequency: 26, deductable: '$ 1500', coinsurance: '80 %', oop: '$ 5000', discount: '$ -150' },
        planC: { name: 'Plan C', premium: '$ 0', frequency: 26, deductable: '$ 3000', coinsurance: '80 %', oop: '$ 6000', discount: '$ -300' },
        app_url: "https://asalimian.github.io/contributionreturns/plan.html",
        last_update: currentTime
    }

    datamodel = JSON.parse(document.getElementById("savebox").value)
    datamodel[model] = payload

    payload = JSON.stringify(datamodel)
    document.getElementById("savebox").value = payload

    return datamodel
}


function loaddata() {
    if (localStorage.logplot == "true") {
        document.getElementById('logplot').checked = localStorage.logplot
        layout.yaxis.type = 'log'
    } else {
        layout.yaxis.type = null

    }

    payload = JSON.parse(document.getElementById("savebox").value)

    if (payload[model] == null) {
        payload = loadDefaults()
    }

    datamodel = payload[model]

    for (plan of ['a', 'b', 'c']) {
        document.getElementById('plan'+plan.toUpperCase()).innerHTML = datamodel['plan'+plan.toUpperCase()]["name"]
        document.getElementById('prem_'+plan).value = datamodel['plan'+plan.toUpperCase()]["premium"];
        document.getElementById('freq_'+plan).value = datamodel['plan'+plan.toUpperCase()]["frequency"];
        document.getElementById('ded_'+plan).value = datamodel['plan'+plan.toUpperCase()]["deductable"];
        document.getElementById('co_'+plan).value = datamodel['plan'+plan.toUpperCase()]["coinsurance"];
        document.getElementById('oop_'+plan).value = datamodel['plan'+plan.toUpperCase()]["oop"];
        document.getElementById('disc_'+plan).value = datamodel['plan'+plan.toUpperCase()]["discount"];
    }
}


function headerlabel(el) {
    el.hidden = true
    nel = document.getElementById(el.id+'_name')
    console.log(el.id+'_name')
    nel.hidden = false
    nel.value = el.innerHTML.trim()
    nel.focus()
}

function labelheader(el) {
    el.hidden = true
    nelid = el.id.substring(0,5)
    nel = document.getElementById(nelid)
    console.log(nelid)
    nel.hidden = false
    nel.innerHTML = el.value
    updateData()
}

function updateData() {
    if (localStorage['autosave'] == 'true') {
        document.getElementById('autosave').checked = true
        document.getElementById('savebox').value = localStorage['json_settings']
    }

    var currentTime = new Date()
    payload = JSON.parse(document.getElementById('savebox').value)

    plotload = []

    pmax = strip(document.getElementById('plotmax').value)

    for (plan of ['a', 'b', 'c']) {
        n = document.getElementById('plan'+plan.toUpperCase()).innerHTML
        p = document.getElementById('prem_' + plan).value
        f = document.getElementById('freq_' + plan).value
        d = document.getElementById('ded_' + plan).value
        c = document.getElementById('co_' + plan).value
        o = document.getElementById('oop_' + plan).value
        s = document.getElementById('disc_' + plan).value

        payload[model]["plan" + plan.toUpperCase()] = {
            "name": n,
            "premium": p,
            "frequency": f,
            "deductable": d,
            "coinsurance": c,
            "oop": o,
            "discount": s
        }
        
        p = strip(p) * 1;
        f = strip(f) * 1;
        d = strip(d) * 1;
        c = strip(c) * .01;
        o = strip(o) * 1;
        s = strip(s) * 1;

        charges = [0,d,o/(1-c)+(1-1/(1-c))*d,o/(1-c)+(1-1/(1-c))*d]
        payment = [p*f+s,p*f+d+s,p*f+o+s,p*f+o+s]

        r = interpolate(charges,payment,pmax*1e3)

        plotload.push({
            x: r[0],
            y: r[1],
            name: n,
        })
        
    }

    payload[model].app_url = "https://asalimian.github.io/contributionreturns/loan.html"
    payload[model].last_update = currentTime
    document.getElementById('savebox').value = JSON.stringify(payload)

    if (localStorage['autosave'] == 'true') {
        localStorage['json_settings'] = document.getElementById('savebox').value
        localStorage['logplot'] = document.getElementById('logplot').checked
    }

    //update the layout and all the traces
    Plotly.react(TESTER, plotload, layout);
}

function interpolate(charges,payments,maxcharge) {
    var payment
    var charge
    var n = 1000
    var index
    x = [...Array(n + 1).keys()]
    expgrow = x => (x+1e-8)/n*maxcharge;
    var payarray = []
    chgarray = x.map(expgrow)
    for (charge of chgarray) {
        index = charges.findIndex(n => n >= charge)
        

        payment = (payments[index]-payments[index-1])/(charges[index]-charges[index-1])*(charge-charges[index])+payments[index]
        if (isNaN(payment)) {
            payment = payments[payments.length-2]
        }

        payarray.push(payment)
    }
    console.log([chgarray,payarray])
    console.log([charges,payments])
    return [chgarray,payarray]
}

