let model = "JobCalculator"

function loadDefaults(upgrade = false) {
    var currentTime = new Date()
    payload = {
        "old job": { "Salary": '$ 45', "Bonus": '$ 0', "MatchRate": '1%', "MatchMax": '1%', "Healthcare": '$ 5', "COL": '$ 40', "Tax": '10%', "Other": '$ 0' },
        "new job": { "Salary": '$ 50', "Bonus": '$ 5', "MatchRate": '1%', "MatchMax": '1%', "Healthcare": '$ 5', "COL": '$ 40', "Tax": '10%', "Other": '$ 0' },
        "app_url": "https://asalimian.github.io/contributionreturns/switch.html",
        'last_update': currentTime
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

    } else {


    }

    if (localStorage['autosave'] == 'true') {
        document.getElementById('autosave').checked = true
        document.getElementById('savebox').value = localStorage['json_settings']
    }

    payload = JSON.parse(document.getElementById("savebox").value)

    if (payload[model] == null) {
        payload = loadDefaults()
    }

    datamodel = payload[model]

    document.getElementById('sal_new').value = datamodel["new job"]["Salary"];
    document.getElementById('sal_old').value = datamodel["old job"]["Salary"];
    document.getElementById('bonus_new').value = datamodel["new job"]["Bonus"];
    document.getElementById('bonus_old').value = datamodel["old job"]["Bonus"];
    document.getElementById('matchrate_new').value = datamodel["new job"]["MatchRate"];
    document.getElementById('matchrate_old').value = datamodel["old job"]["MatchRate"];
    document.getElementById('matchmax_new').value = datamodel["new job"]["MatchMax"];
    document.getElementById('matchmax_old').value = datamodel["old job"]["MatchMax"];
    document.getElementById('healthcare_new').value = datamodel["new job"]["Healthcare"];
    document.getElementById('healthcare_old').value = datamodel["old job"]["Healthcare"];
    document.getElementById('col_new').value = datamodel["new job"]["COL"];
    document.getElementById('col_old').value = datamodel["old job"]["COL"];
    document.getElementById('tax_new').value = datamodel["new job"]["Tax"];
    document.getElementById('tax_old').value = datamodel["old job"]["Tax"];
    document.getElementById('other_new').value = datamodel["new job"]["Other"];
    document.getElementById('other_old').value = datamodel["old job"]["Other"];

    /*
    calcContributions()
    calcSavings()
    */

    console.log('App Data loaded')


}

function calcContributions() {
    Tm = document.getElementById('years_opt').value * 1;
    r = document.getElementById('r_opt').value.replace('%', '') / 100;
    c = document.getElementById('cont_opt').value.replace('$', '').replace(/,/g, '') * 1;
    P0 = document.getElementById('p0_opt').value.replace('$', '').replace(/,/g, '') * 1;
    Pm = document.getElementById('pmax_opt').value.replace('$', '').replace(/,/g, '') * 1;
    t = Tm - 1 / r * Math.log((r / c * P0 + 1) * Math.exp(r * Tm) - r / c * Pm)
    t = Math.min(Math.max(0, t), Tm)
    time_opt = Math.round(t * 1000) / 1000;
    Tm = document.getElementById('years_pes').value * 1;
    r = document.getElementById('r_pes').value.replace('%', '') / 100;
    c = document.getElementById('cont_pes').value.replace('$', '').replace(/,/g, '') * 1;
    P0 = document.getElementById('p0_pes').value.replace('$', '').replace(/,/g, '') * 1;
    Pm = document.getElementById('pmax_pes').value.replace('$', '').replace(/,/g, '') * 1;
    t = Tm - 1 / r * Math.log((r / c * P0 + 1) * Math.exp(r * Tm) - r / c * Pm)
    t = Math.min(Math.max(0, t), Tm)
    time_pes = Math.round(t * 1000) / 1000;

    document.getElementById('time_opt').value = time_opt;
    document.getElementById('time_pes').value = time_pes;

    num2text(document.getElementById('time_opt'));
    num2text(document.getElementById('time_pes'));
    return { 'opt': time_opt, 'pes': time_pes }
}
function calcSavings() {
    Tm = document.getElementById('years_opt').value * 1;
    r = document.getElementById('r_opt').value.replace('%', '') / 100;
    P0 = document.getElementById('p0_opt').value.replace('$', '').replace(/,/g, '') * 1 * 1;
    Pm = document.getElementById('pmax_opt').value.replace('$', '').replace(/,/g, '') * 1 * 1;
    c = -r * (P0 * Math.exp(r * Tm) - Pm) / (Math.exp(r * Tm) - 1)
    lux_opt = Math.round(c * 100) / 100
    Tm = document.getElementById('years_pes').value * 1;
    r = document.getElementById('r_pes').value.replace('%', '') / 100;
    P0 = document.getElementById('p0_pes').value.replace('$', '').replace(/,/g, '') * 1 * 1;
    Pm = document.getElementById('pmax_pes').value.replace('$', '').replace(/,/g, '') * 1 * 1;
    c = -r * (P0 * Math.exp(r * Tm) - Pm) / (Math.exp(r * Tm) - 1)
    lux_pes = Math.round(c * 100) / 100

    document.getElementById('lux_opt').value = lux_opt;
    document.getElementById('lux_pes').value = lux_pes;

    num2text(document.getElementById('lux_opt'), '$ ');
    num2text(document.getElementById('lux_pes'), '$ ');

    return { 'opt': lux_opt, 'pes': lux_pes }
}

function updateData() {
    var currentTime = new Date()
    payload = JSON.parse(document.getElementById('savebox').value)

    plotload = []
    plotdiff = []


    sa = []
    bo = []
    mr = []
    mm = []
    hc = []
    cl = []
    tb = []
    ot = []

    for (plan of ['old', 'new']) {
        sa[plan] = document.getElementById('sal_' + plan).value
        bo[plan] = document.getElementById('bonus_' + plan).value
        mr[plan] = document.getElementById('matchrate_' + plan).value
        mm[plan] = document.getElementById('matchmax_' + plan).value
        hc[plan] = document.getElementById('healthcare_' + plan).value
        cl[plan] = document.getElementById('col_' + plan).value
        tb[plan] = document.getElementById('tax_' + plan).value
        ot[plan] = document.getElementById('other_' + plan).value

        payload[model][plan + ' job'] = {
            "Salary": sa[plan],
            "Bonus": bo[plan],
            "MatchRate": mr[plan],
            "MatchMax": mm[plan],
            "Healthcare": hc[plan],
            "COL": cl[plan],
            "Tax": tb[plan],
            "Other": ot[plan]
        }

        sa[plan] = strip(sa[plan]) * 1
        bo[plan] = strip(bo[plan]) * 1
        mr[plan] = strip(mr[plan]) * 1
        mm[plan] = strip(mm[plan]) * 1
        hc[plan] = strip(hc[plan]) * 1
        cl[plan] = strip(cl[plan]) * 1
        tb[plan] = strip(tb[plan]) * 1
        ot[plan] = strip(ot[plan]) * 1
    }

    plotload = [
        { x: ['Old', 'New'], y: [0, -cl['new'] + cl['old']], name: 'Cost of Living Change', type: 'bar' },
        {
            x: ['Old', 'New'], y: [0, -(sa['new'] - sa['old'] +
                bo['new'] - bo['old'] +
                ot['new'] - ot['old'] +
                hc['old'] - hc['new']
            ) * (tb['old']) / 100], name: 'Tax Change', type: 'bar'
        },
        { x: ['Old', 'New'], y: [-hc['old'], -hc['new']], name: 'Healthcare', type: 'bar' },
        { x: ['Old', 'New'], y: [sa['old'], sa['new']], name: 'Salary', type: 'bar' },
        { x: ['Old', 'New'], y: [bo['old'], bo['new']], name: 'Bonus', type: 'bar' },
        { x: ['Old', 'New'], y: [mm['old'] * sa['old'] / 100, mm['new'] * sa['new'] / 100], name: '401k Match', type: 'bar' },
        { x: ['Old', 'New'], y: [mr['old'] * sa['old'] / 100, mr['new'] * sa['new'] / 100], name: '401k Employer', type: 'bar' },
        { x: ['Old', 'New'], y: [ot['old'], ot['new']], name: 'Other', type: 'bar' }
    ]

    oldtot = 0
    newtot = 0
    plotload.forEach(function (x) { oldtot += x.y[0] })
    plotload.forEach(function (x) { newtot += x.y[1] })

    plotload.forEach(function (x) { x.text = [x.name + ': $' + x.y[0] + '<br>Old Job: $' + Math.round(oldtot * 100) / 100, x.name + ': $' + x.y[1] + '<br>New Job: $' + Math.round(newtot * 100) / 100]; x.hoverinfo = 'text' })


    payload[model].app_url = "https://asalimian.github.io/contributionreturns/switch.html"
    payload[model].last_update = currentTime
    document.getElementById('savebox').value = JSON.stringify(payload)

    if (localStorage['autosave'] == 'true') {
        localStorage['json_settings'] = document.getElementById('savebox').value
        localStorage['logplot'] = document.getElementById('logplot').checked
    }


    //update the layout and all the traces
    Plotly.react(TESTER, plotload, layout);
}

