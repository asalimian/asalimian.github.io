let model = "PlanCalculator"

function loadDefaults() {
    var currentTime = new Date()
    payload = {
        planA: { name: 'Plan A', premium: '$ 175', frequency: 26, deductible: '$  750', coinsurance: '10 %', oop: '$ 4000', discount: '$    0' },
        planB: { name: 'Plan B', premium: '$ 80', frequency: 26, deductible: '$ 1500', coinsurance: '20 %', oop: '$ 5000', discount: '$ -150' },
        planC: { name: 'Plan C', premium: '$ 0', frequency: 26, deductible: '$ 3000', coinsurance: '20 %', oop: '$ 6000', discount: '$ -300' },
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

    if (localStorage['autosave'] == 'true') {
        document.getElementById('autosave').checked = true
        document.getElementById('savebox').value = localStorage['json_settings']
    }

    payload = JSON.parse(document.getElementById("savebox").value)

    if (payload[model] == null) {
        console.log('need to load new data')
        payload = loadDefaults()
    }

    datamodel = payload[model]

    for (plan of ['a', 'b', 'c']) {
        document.getElementById('plan' + plan.toUpperCase()).innerHTML = datamodel['plan' + plan.toUpperCase()]["name"]
        document.getElementById('prem_' + plan).value = datamodel['plan' + plan.toUpperCase()]["premium"];
        document.getElementById('freq_' + plan).value = datamodel['plan' + plan.toUpperCase()]["frequency"];
        document.getElementById('ded_' + plan).value = datamodel['plan' + plan.toUpperCase()]["deductible"];
        document.getElementById('co_' + plan).value = datamodel['plan' + plan.toUpperCase()]["coinsurance"];
        document.getElementById('oop_' + plan).value = datamodel['plan' + plan.toUpperCase()]["oop"];
        document.getElementById('disc_' + plan).value = datamodel['plan' + plan.toUpperCase()]["discount"];
    }

    document.getElementById('savebox').value = JSON.stringify(payload)

    console.log('Plan Data loaded')
}


function headerlabel(el) {
    el.hidden = true
    nel = document.getElementById(el.id + '_name')
    console.log(el.id + '_name')
    nel.hidden = false
    nel.value = el.innerHTML.trim()
    nel.focus()
}

function labelheader(el) {
    el.hidden = true
    nelid = el.id.substring(0, 5)
    nel = document.getElementById(nelid)
    console.log(nelid)
    nel.hidden = false
    nel.innerHTML = el.value
    updateData()
}

function updateData() {
    var currentTime = new Date()
    payload = JSON.parse(document.getElementById('savebox').value)

    plotload = []
    plotdiff = []

    pmax = strip(document.getElementById('plotmax').value)

    for (plan of ['a', 'b', 'c']) {
        n = document.getElementById('plan' + plan.toUpperCase()).innerHTML
        p = document.getElementById('prem_' + plan).value
        f = document.getElementById('freq_' + plan).value
        d = document.getElementById('ded_' + plan).value
        c = document.getElementById('co_' + plan).value
        e = document.getElementById('coe_' + plan)
        o = document.getElementById('oop_' + plan).value
        s = document.getElementById('disc_' + plan).value

        e.value = (100 - Number(c.replace(' %', ''))) + " %"

        payload[model]["plan" + plan.toUpperCase()] = {
            "name": n,
            "premium": p,
            "frequency": f,
            "deductible": d,
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

        charges = [0, d, o / (c) + (1 - 1 / (c)) * d, o / (c) + (1 - 1 / (c)) * d]
        payment = [p * f + s, p * f + d + s, p * f + o + s, p * f + o + s]

        r = interpolate(p * f + s, c, d, o, pmax * 1e3)

        plotload.push({
            x: r[0],
            y: r[1],
            name: n,
        })
    }

    plotload[0].line = { color: '#1F77B4' }
    plotload[1].line = { color: '#FF7F0E' }
    plotload[2].line = { color: '#2CA02C' }

    payload[model].app_url = "https://asalimian.github.io/contributionreturns/loan.html"
    payload[model].last_update = currentTime
    document.getElementById('savebox').value = JSON.stringify(payload)

    if (localStorage['autosave'] == 'true') {
        localStorage['json_settings'] = document.getElementById('savebox').value
        localStorage['logplot'] = document.getElementById('logplot').checked
    }


    plotdiff = [
        {
            x: plotload[0].y,
            y: subarray(plotload[1].y, plotload[0].y),
            name: document.getElementById('planB').innerHTML
        },
        {
            x: plotload[0].y,
            y: subarray(plotload[2].y, plotload[0].y),
            name: document.getElementById('planC').innerHTML
        },
    ]
    difflayout.xaxis.title = document.getElementById('planA').innerHTML + ' Costs'

    document.getElementById('optionA').innerHTML = document.getElementById('planA').innerHTML

    plotdiff[0].line = { color: '#FF7F0E' }
    plotdiff[1].line = { color: '#2CA02C' }

    //update the layout and all the traces
    Plotly.react(diffplot, plotdiff, difflayout);
    Plotly.react(TESTER, plotload, layout);
}

function interpolate(p, c, d, o, maxcharge) {
    var payment
    var charge
    var n = 1000
    var index
    x = [...Array(n + 1).keys()]
    expgrow = x => (x + 1e-8) / n * maxcharge;
    var payarray = []
    chgarray = x.map(expgrow)
    for (charge of chgarray) {
        index = charges.findIndex(n => n >= charge)
        payment = p + charge - Math.max(0, (charge - d)) * (1 - c) - Math.max(0, charge - (d + (o - d) / c)) * (c)
        payarray.push(payment)
    }
    console.log([chgarray, payarray])
    return [chgarray, payarray]
}

