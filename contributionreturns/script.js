
    function cur2text(el) {
        value = '$ '+Number(el.value.replace('$','').replace(',','')).toLocaleString();
        el.type = "text"
        el.value = value
    }
    function text2cur(el) {
        value = el.value.replace('$','').replace(',','') * 1
        el.type = "number"
        el.value = value
    }

    function per2text(el) {
        value = Number(el.value.replace('$','').replace(',','')).toLocaleString()+'%';
        el.type = "text"
        el.value = value
    }
    function text2per(el) {
        value = el.value.replace('%','').replace(',','') * 1
        el.type = "number"
        el.value = value
    }

    function loadDefaults() {
        payload = "[{\"Optimistic Scenario\":{\"Principle\":\"$ 100\",\"Goal\":\"$ 2,000\",\"Rate\":\"7\",\"Years\":\"30\",\"Contribution\":\"$ 25\"},\"Pessimistic Scenario\":{\"Principle\":\"$ 200\",\"Goal\":\"$ 2,000\",\"Rate\":\"4\",\"Years\":\"30\",\"Contribution\":\"$ 25\"}}]"
        document.getElementById("savebox").value = payload
        loaddata()
    }
    function init() {
        if (localStorage.autosave == null || !(localStorage.autosave == "true")) {
            loadDefaults()
            updateData()
        } else {
            document.getElementById("savebox").value = localStorage.json_settings
            document.getElementById("autosave").checked = true
            loaddata()
            updateData()
        }

    }
    function reloadValue() {

        document.getElementById("text").value = getValue("text");    // set the value to this input
        document.getElementById("textarea").value = getValue("textarea");   // set the value to this input
    }
    /* Here you can add more inputs to set value. if it's saved */

    //Save the value function - save it to localStorage as (ID, VALUE)
    function setValue(e) {
        var id = e.id;  // get the sender's id to save it . 
        var val = e.value; // get the value. 
        localStorage[id] = val;// Every time user writing something, the localStorage's value will override . 
    }

    //get the saved value function - return the value of "v" from localStorage. 
    function getValue(v) {
        if (!localStorage.getItem(v)) {
            return "";// You can change this to your defualt value. 
        }
        return localStorage.getItem(v);
    }
    function loaddata() {
        if (localStorage.logplot == "true") {
            document.getElementById('logplot').checked = localStorage.logplot
            layout.yaxis.type = 'log'
        } else {
            layout.yaxis.type = null

        }

        datamodel = JSON.parse(document.getElementById("savebox").value)
        document.getElementById('pmax_opt').value = datamodel[0]["Optimistic Scenario"]["Goal"];
        document.getElementById('pmax_pes').value = datamodel[0]["Pessimistic Scenario"]["Goal"];
        document.getElementById('p0_opt').value = datamodel[0]["Optimistic Scenario"]["Principle"];
        document.getElementById('p0_pes').value = datamodel[0]["Pessimistic Scenario"]["Principle"];
        document.getElementById('r_opt').value = datamodel[0]["Optimistic Scenario"]["Rate"];
        document.getElementById('r_pes').value = datamodel[0]["Pessimistic Scenario"]["Rate"];
        document.getElementById('years_opt').value = datamodel[0]["Optimistic Scenario"]["Years"];
        document.getElementById('years_pes').value = datamodel[0]["Pessimistic Scenario"]["Years"];
        document.getElementById('cont_opt').value = datamodel[0]["Optimistic Scenario"]["Contribution"];
        document.getElementById('cont_pes').value = datamodel[0]["Pessimistic Scenario"]["Contribution"];

        calcContributions()
        calcSavings()

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
    function calcContributions() {
        Tm = document.getElementById('years_opt').value * 1;
        r = document.getElementById('r_opt').value.replace('%','') / 100;
        c = document.getElementById('cont_opt').value * 1;
        P0 = document.getElementById('p0_opt').value.replace('$','').replace(',','') * 1;
        Pm = document.getElementById('pmax_opt').value.replace('$','').replace(',','') * 1;
        t = Math.min(Math.max(0, Tm - 1 / r * Math.log((r / c * P0 + 1) * Math.exp(r * Tm) - r / c * Pm)), Tm)
        time_opt = Math.round(t * 1000) / 1000;
        Tm = document.getElementById('years_pes').value * 1;
        r = document.getElementById('r_pes').value.replace('%','') / 100;
        c = document.getElementById('cont_pes').value * 1;
        P0 = document.getElementById('p0_pes').value.replace('$','').replace(',','')*1;
        Pm = document.getElementById('pmax_pes').value.replace('$','').replace(',','')*1;
        t = Math.min(Math.max(0, Tm - 1 / r * Math.log((r / c * P0 + 1) * Math.exp(r * Tm) - r / c * Pm)), Tm)
        time_pes = Math.round(t * 1000) / 1000;

        document.getElementById('time_opt').value = time_opt;
        document.getElementById('time_pes').value = time_pes;
        return { 'opt': time_opt, 'pes': time_pes }
    }
    function calcSavings() {
        Tm = document.getElementById('years_opt').value * 1;
        r = document.getElementById('r_opt').value.replace('%','') / 100;
        P0 = document.getElementById('p0_opt').value.replace('$','').replace(',','')*1 * 1;
        Pm = document.getElementById('pmax_opt').value.replace('$','').replace(',','')*1 * 1;
        c = -r * (P0 * Math.exp(r * Tm) - Pm) / (Math.exp(r * Tm) - 1)
        lux_opt = Math.round(c * 100) / 100
        Tm = document.getElementById('years_pes').value * 1;
        r = document.getElementById('r_pes').value.replace('%','') / 100;
        P0 = document.getElementById('p0_pes').value.replace('$','').replace(',','')*1 * 1;
        Pm = document.getElementById('pmax_pes').value.replace('$','').replace(',','')*1 * 1;
        c = -r * (P0 * Math.exp(r * Tm) - Pm) / (Math.exp(r * Tm) - 1)
        lux_pes = Math.round(c * 100) / 100

        document.getElementById('lux_opt').value = lux_opt;
        document.getElementById('lux_pes').value = lux_pes;

        return { 'opt': lux_opt, 'pes': lux_pes }
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
    function updateData() {
        if (getValue('autosave') == 'true') {
            document.getElementById('autosave').checked = true
            document.getElementById('savebox').value = localStorage['json_settings']
        }
        time = calcContributions()
        lux = calcSavings()
        pmax_opt = document.getElementById('pmax_opt').value.replace('$','').replace(',','')*1;
        pmax_pes = document.getElementById('pmax_pes').value.replace('$','').replace(',','')*1;
        p0_opt = document.getElementById('p0_opt').value.replace('$','').replace(',','')*1;
        p0_pes = document.getElementById('p0_pes').value.replace('$','').replace(',','')*1;
        r_opt = document.getElementById('r_opt').value.replace('%','');
        r_pes = document.getElementById('r_pes').value.replace('%','');
        years_opt = document.getElementById('years_opt').value;
        years_pes = document.getElementById('years_pes').value;
        cont_opt = document.getElementById('cont_opt').value;
        cont_pes = document.getElementById('cont_pes').value;

        document.getElementById('savebox').value = JSON.stringify([{ "Optimistic Scenario": { "Principle": p0_opt, "Goal": pmax_opt, "Rate": r_opt, "Years": years_opt, "Contribution": cont_opt }, "Pessimistic Scenario": { "Principle": p0_pes, "Goal": pmax_pes, "Rate": r_pes, "Years": years_pes, "Contribution": cont_pes } }])
        if (localStorage['autosave'] == 'true') {
            localStorage['json_settings'] = document.getElementById('savebox').value
            localStorage['logplot'] = document.getElementById('logplot').checked
        }

        if (lux.opt * 1 > cont_opt * 1) {
            document.getElementById('status_opt').value = "off-track"
            document.getElementById('status_opt').style["background-color"] = "#FF2B3F"
        } else if (time.opt * 1 <= 0) {
            document.getElementById('status_opt').value = "over-saved"
            document.getElementById('status_opt').style["background-color"] = "gold"
        } else {
            document.getElementById('status_opt').value = "on-track"
            document.getElementById('status_opt').style["background-color"] = "#25DA6F"

        }

        if (lux.pes * 1 > cont_pes * 1) {
            document.getElementById('status_pes').value = "off-track"
            document.getElementById('status_pes').style["background-color"] = "#FF2B3F"
        } else if (time.pes * 1 <= 0) {
            document.getElementById('status_pes').value = "over-saved"
            document.getElementById('status_pes').style["background-color"] = "gold"
        } else {
            document.getElementById('status_pes').value = "on-track"
            document.getElementById('status_pes').style["background-color"] = "#25DA6F"
        }


        var currentTime = new Date()

        optcoast = expgrowth(pmax_opt / Math.exp(r_opt / 100 * (years_opt - time_opt)),
            r_opt,
            (document.getElementById('years_opt').value * 1 - document.getElementById('time_opt').value * 1),
            (currentTime.getFullYear() + currentTime.getMonth() / 12 + document.getElementById('time_opt').value * 1))
        pescoast = expgrowth(pmax_pes / Math.exp(r_pes / 100 * (years_pes - time_pes)),
            r_pes,
            years_pes - time_pes,
            currentTime.getFullYear() + currentTime.getMonth() / 12 + time_pes);
        if (document.getElementById('time_opt').value == 0) {
            ylen = (document.getElementById('years_opt').value);
        } else {
            ylen = (document.getElementById('time_opt').value)
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
