





    function loaddata() {
        if (localStorage.logplot == "true") {
            document.getElementById('logplot').checked = localStorage.logplot
            layout.yaxis.type = 'log'
        } else {
            layout.yaxis.type = null

        }

        datamodel = JSON.parse(document.getElementById("savebox").value).ContributionCalculator
        document.getElementById('pmax_opt').value = datamodel["Optimistic Scenario"]["Goal"];
        document.getElementById('pmax_pes').value = datamodel["Pessimistic Scenario"]["Goal"];
        document.getElementById('p0_opt').value = datamodel["Optimistic Scenario"]["Principle"];
        document.getElementById('p0_pes').value = datamodel["Pessimistic Scenario"]["Principle"];
        document.getElementById('r_opt').value = datamodel["Optimistic Scenario"]["Rate"];
        document.getElementById('r_pes').value = datamodel["Pessimistic Scenario"]["Rate"];
        document.getElementById('years_opt').value = datamodel["Optimistic Scenario"]["Years"];
        document.getElementById('years_pes').value = datamodel["Pessimistic Scenario"]["Years"];
        document.getElementById('cont_opt').value = datamodel["Optimistic Scenario"]["Contribution"];
        document.getElementById('cont_pes').value = datamodel["Pessimistic Scenario"]["Contribution"];

        calcContributions()
        calcSavings()

    }
    
    function calcContributions() {
        Tm = document.getElementById('years_opt').value * 1;
        r = document.getElementById('r_opt').value.replace('%','') / 100;
        c = document.getElementById('cont_opt').value.replace('$','').replace(/,/g,'') * 1;
        P0 = document.getElementById('p0_opt').value.replace('$','').replace(/,/g,'') * 1;
        Pm = document.getElementById('pmax_opt').value.replace('$','').replace(/,/g,'') * 1;
        t = Tm - 1 / r * Math.log((r / c * P0 + 1) * Math.exp(r * Tm) - r / c * Pm)
        t = Math.min(Math.max(0, t), Tm)
        time_opt = Math.round(t * 1000) / 1000;
        Tm = document.getElementById('years_pes').value * 1;
        r = document.getElementById('r_pes').value.replace('%','') / 100;
        c = document.getElementById('cont_pes').value.replace('$','').replace(/,/g,'') * 1;
        P0 = document.getElementById('p0_pes').value.replace('$','').replace(/,/g,'')*1;
        Pm = document.getElementById('pmax_pes').value.replace('$','').replace(/,/g,'')*1;
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
        r = document.getElementById('r_opt').value.replace('%','') / 100;
        P0 = document.getElementById('p0_opt').value.replace('$','').replace(/,/g,'')*1 * 1;
        Pm = document.getElementById('pmax_opt').value.replace('$','').replace(/,/g,'')*1 * 1;
        c = -r * (P0 * Math.exp(r * Tm) - Pm) / (Math.exp(r * Tm) - 1)
        lux_opt = Math.round(c * 100) / 100
        Tm = document.getElementById('years_pes').value * 1;
        r = document.getElementById('r_pes').value.replace('%','') / 100;
        P0 = document.getElementById('p0_pes').value.replace('$','').replace(/,/g,'')*1 * 1;
        Pm = document.getElementById('pmax_pes').value.replace('$','').replace(/,/g,'')*1 * 1;
        c = -r * (P0 * Math.exp(r * Tm) - Pm) / (Math.exp(r * Tm) - 1)
        lux_pes = Math.round(c * 100) / 100

        document.getElementById('lux_opt').value = lux_opt;
        document.getElementById('lux_pes').value = lux_pes;

        num2text(document.getElementById('lux_opt'),'$ ');
        num2text(document.getElementById('lux_pes'),'$ ');

        return { 'opt': lux_opt, 'pes': lux_pes }
    }
    
    function updateData() {
        if (localStorage['autosave'] == 'true') {
            document.getElementById('autosave').checked = true
            document.getElementById('savebox').value = localStorage['json_settings']
        }
        time = calcContributions()
        lux = calcSavings()
        pmax_opt = document.getElementById('pmax_opt').value;
        pmax_pes = document.getElementById('pmax_pes').value;
        p0_opt = document.getElementById('p0_opt').value;
        p0_pes = document.getElementById('p0_pes').value;
        r_opt = document.getElementById('r_opt').value;
        r_pes = document.getElementById('r_pes').value;
        years_opt = document.getElementById('years_opt').value;
        years_pes = document.getElementById('years_pes').value;
        cont_opt = document.getElementById('cont_opt').value;
        cont_pes = document.getElementById('cont_pes').value;
        
        var currentTime = new Date()

        payload = JSON.parse(document.getElementById('savebox').value)
        payload.ContributionCalculator = {"Optimistic Scenario": { "Principle": p0_opt, "Goal": pmax_opt, "Rate": r_opt, "Years": years_opt, "Contribution": cont_opt }, "Pessimistic Scenario": { "Principle": p0_pes, "Goal": pmax_pes, "Rate": r_pes, "Years": years_pes, "Contribution": cont_pes },"app_url":"https://asalimian.github.io/contributionreturns/test.html","last_update":currentTime}
        document.getElementById('savebox').value = JSON.stringify(payload)
        
        pmax_opt = pmax_opt.replace('$','').replace(/,/g,'')*1;
        pmax_pes = pmax_pes.replace('$','').replace(/,/g,'')*1;
        p0_opt   = p0_opt.replace('$','').replace(/,/g,'')*1;
        p0_pes   = p0_pes.replace('$','').replace(/,/g,'')*1;
        r_opt    = r_opt.replace('%','');
        r_pes    = r_pes.replace('%','');
        years_opt= years_opt;
        years_pes= years_pes;
        cont_opt = cont_opt.replace('$','').replace(/,/g,'')*1;
        cont_pes = cont_pes.replace('$','').replace(/,/g,'')*1;
        if (localStorage['autosave'] == 'true') {
            localStorage['json_settings'] = document.getElementById('savebox').value
            localStorage['logplot'] = document.getElementById('logplot').checked
        }

        if (lux.opt * 1 > cont_opt * 1) {
            document.getElementById('status_opt').value = "❌off-track"
            document.getElementById('status_opt').className = "offtrack"
        } else if (time.opt * 1 <= 0) {
            document.getElementById('status_opt').value = "⚠️oversaved"
            document.getElementById('status_opt').className = "oversaved"
        } else {
            document.getElementById('status_opt').value = "✔️on-track"
            document.getElementById('status_opt').className = "ontrack"
        }

        if (lux.pes * 1 > cont_pes * 1) {
            document.getElementById('status_pes').value = "❌off-track"
            document.getElementById('status_pes').className = "offtrack"
        } else if (time.pes * 1 <= 0) {
            document.getElementById('status_pes').value = "⚠️oversaved"
            document.getElementById('status_pes').className = "oversaved"
        } else {
            document.getElementById('status_pes').value = "✔️on-track"
            document.getElementById('status_pes').className = "ontrack"
        }



        optcoast = expgrowth(pmax_opt / Math.exp(r_opt / 100 * (years_opt - time_opt)),
            r_opt,
            (years_opt * 1 - time.opt * 1),
            (currentTime.getFullYear() + currentTime.getMonth() / 12 + time.opt))
        pescoast = expgrowth(pmax_pes / Math.exp(r_pes / 100 * (years_pes - time_pes)),
            r_pes,
            years_pes - time_pes,
            currentTime.getFullYear() + currentTime.getMonth() / 12 + time_pes);
        if (time.opt == 0) {
            ylen = (years_opt);
        } else {
            ylen = (time.opt)
        }
        optcontrib = expcont(p0_opt,
            cont_opt,
            r_opt,
            ylen,
            currentTime.getFullYear() + currentTime.getMonth() / 12)
        if (time_pes == 0) {
            ylen = (years_pes);
        } else {
            ylen = (time_pes)
        }
        pescontrib = expcont(p0_pes,
            cont_pes,
            r_pes,
            ylen,
            currentTime.getFullYear() + currentTime.getMonth() / 12)

        graphDiv = document.getElementById('tester')

        //update the layout and all the traces
        Plotly.react(TESTER, [{
            x: pescontrib[0],
            y: pescontrib[1],
            name: 'Contribution Period Pessimistic',
            marker: {
                color: '#951b1c',
            }
        }, {
            x: pescoast[0],
            y: pescoast[1],
            name: 'Returns Pessimistic',
            marker: {
                color: '#e36667',
            }
        }, {
            x: optcontrib[0],
            y: optcontrib[1],
            name: 'Contribution Period Optimistic',
            marker: {
                color: '#144c73',
            }
        }, {
            x: optcoast[0],
            y: optcoast[1],
            name: 'Returns Optimistic',
            marker: {
                color: '#419ede',
            }
        }], layout);
    }

