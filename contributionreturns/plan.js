let model = "PlanCalculator"

function loadDefaults(upgrade = false) {
    var currentTime = new Date()
    payload = {
        planA: { name: 'Plan A', premium: '$ 175', frequency: 26, deductable: '$  750', coinsurance: '10 %', oop: '$ 4000', discount: '$    0' },
        planB: { name: 'Plan B', premium: '$ 80', frequency: 26, deductable: '$ 1500', coinsurance: '20 %', oop: '$ 5000', discount: '$ -150' },
        planC: { name: 'Plan C', premium: '$ 0', frequency: 26, deductable: '$ 3000', coinsurance: '20 %', oop: '$ 6000', discount: '$ -300' },
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
    document.getElementById('prem_a').value = datamodel["planA"]["premium"];
    document.getElementById('prem_b').value = datamodel["planB"]["premium"];
    document.getElementById('prem_c').value = datamodel["planC"]["premium"];
    document.getElementById('freq_a').value = datamodel["planA"]["frequency"];
    document.getElementById('freq_b').value = datamodel["planB"]["frequency"];
    document.getElementById('freq_c').value = datamodel["planC"]["frequency"];
    document.getElementById('ded_a').value = datamodel["planA"]["deductable"];
    document.getElementById('ded_b').value = datamodel["planB"]["deductable"];
    document.getElementById('ded_c').value = datamodel["planC"]["deductable"];
    document.getElementById('co_a').value = datamodel["planA"]["coinsurance"];
    document.getElementById('co_b').value = datamodel["planB"]["coinsurance"];
    document.getElementById('co_c').value = datamodel["planC"]["coinsurance"];
    document.getElementById('oop_a').value = datamodel["planA"]["oop"];
    document.getElementById('oop_b').value = datamodel["planB"]["oop"];
    document.getElementById('oop_c').value = datamodel["planC"]["oop"];
    document.getElementById('disc_a').value = datamodel["planA"]["discount"];
    document.getElementById('disc_b').value = datamodel["planB"]["discount"];
    document.getElementById('disc_c').value = datamodel["planC"]["discount"];




}


function updateData() {
    if (localStorage['autosave'] == 'true') {
        document.getElementById('autosave').checked = true
        document.getElementById('savebox').value = localStorage['json_settings']
    }

    var currentTime = new Date()
    payload = JSON.parse(document.getElementById('savebox').value)

    plotload = []

    for (plan of ['a', 'b', 'c']) {
        n = "Plan " + plan.toUpperCase()
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


        
        p = p.replace('$', '').replace(/,/g, '').replace('%', '') * 1;
        f = f.replace('$', '').replace(/,/g, '').replace('%', '') * 1;
        d = d.replace('$', '').replace(/,/g, '').replace('%', '') * 1;
        c = c.replace('$', '').replace(/,/g, '').replace('%', '') * .01;
        o = o.replace('$', '').replace(/,/g, '').replace('%', '') * 1;
        s = s.replace('$', '').replace(/,/g, '').replace('%', '') * 1;

        plotload.push({
            x: [0,d,o/c+(1-1/c)*d],
            y: [p*f+s,p*f+d+s,p*f+o+s],
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
