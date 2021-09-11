

    


    function loaddata() {
        if (localStorage.logplot == "true") {
            document.getElementById('logplot').checked = localStorage.logplot
            layout.yaxis.type = 'log'
        } else {
            layout.yaxis.type = null

        }

        datamodel = JSON.parse(document.getElementById("savebox").value).LoanPayoffCalculator
        document.getElementById('p0_loan').value = datamodel["Loan"]["Principle"];
        document.getElementById('p0_save').value = datamodel["Savings"]["Principle"];
        document.getElementById('pay_loan').value = datamodel["Loan"]["MinPay"];
        document.getElementById('r_loan').value = datamodel["Loan"]["Rate"];
        document.getElementById('r_save').value = datamodel["Savings"]["Rate"];
        document.getElementById('income').value = datamodel["Budget"]["Income"];
        document.getElementById('income_split').value = datamodel["Budget"]["Split"];

        calcSplit()
        calcYears()

    }
    
    function calcYears() {
        p0_loan = -Math.abs(document.getElementById('p0_loan').value.replace('$','').replace(/,/g,''))
        r_loan = document.getElementById('r_loan').value.replace('$','').replace(/,/g,'').replace('%','')/100
        p_loan = document.getElementById('pay_loan').value.replace('$','').replace(/,/g,'')

        c_loan = document.getElementById('cont_loan').value.replace('$','').replace(/,/g,'')

        years_sch = 1/r_loan*Math.log(12*p_loan/(r_loan*p0_loan+12*p_loan))
        years_loan = 1/r_loan*Math.log(12*c_loan/(r_loan*p0_loan+12*c_loan))
        years_save = years_sch-years_loan

        document.getElementById('years_sch').value = years_sch;
        document.getElementById('years_loan').value = years_loan;
        document.getElementById('years_save').value = years_save;

        num2text(document.getElementById('years_sch'));
        num2text(document.getElementById('years_loan'));
        num2text(document.getElementById('years_save'));
        
        return { 'sch':  years_sch, 
                 'loan': years_loan, 
                 'save': years_save }
    }
    function calcSplit() {
        income = document.getElementById('income').value.replace('$','').replace(/,/g,'')
        split = document.getElementById('income_split').value
        if (split>0.99){split=1}

        p0_loan = -Math.abs(document.getElementById('p0_loan').value.replace('$','').replace(/,/g,''))
        p_loan = -Math.abs(document.getElementById('pay_loan').value.replace('$','').replace(/,/g,''))
        r_loan = document.getElementById('r_loan').value.replace('$','').replace(/,/g,'').replace('%','')/100
        

        document.getElementById('income_split').max = 1 + r_loan*p0_loan/(12*income)
        document.getElementById('income_split').max = 1 + p_loan/(income)
        //document.getElementById('income_split').min = 1 + r_loan*p0_loan/(12*income)

        cont_loan = income*(1-split)
        cont_save = income*(split)

        document.getElementById('cont_loan').value = cont_loan;
        document.getElementById('cont_save').value = cont_save;

        num2text(document.getElementById('cont_loan'),'$ ');
        num2text(document.getElementById('cont_save'),'$ ');

        return { 'loan': cont_loan, 
                 'save': cont_save,
                 'income':income}
    }
    
    function updateData() {
        if (localStorage['autosave'] == 'true') {
            document.getElementById('autosave').checked = true
            document.getElementById('savebox').value = localStorage['json_settings']
        }

        cont = calcSplit()
        year = calcYears()
        
        p0_loan = document.getElementById('p0_loan').value
        p_loan = document.getElementById('pay_loan').value
        r_loan = document.getElementById('r_loan').value
        r_save = document.getElementById('r_save').value
        
        var currentTime = new Date()

        payload = JSON.parse(document.getElementById('savebox').value)
        payload.LoanPayoffCalculator = {"Loan":{"Principle":p0_loan,"Rate":r_loan,"MinPay":p_loan},"Savings":{"Principle":"$ 200","Rate":"4 %"},"Budget":{"Income":"$ 2100","Split":"0.60"},"app_url":"https://asalimian.github.io/contributionreturns/loan.html","last_update":currentTime}
        
        document.getElementById('savebox').value = JSON.stringify(payload)
        
        p0_loan = -Math.abs(p0_loan.replace('$','').replace(/,/g,'')*1);
        p_loan = p_loan.replace('$','').replace(/,/g,'')*1;
        r_loan    = r_loan.replace('%','')/100;
        r_save    = r_save.replace('%','')/100;
        if (localStorage['autosave'] == 'true') {
            localStorage['json_settings'] = document.getElementById('savebox').value
            localStorage['logplot'] = document.getElementById('logplot').checked
        }

        
        //optcoast = expgrowth(pmax_opt / Math.exp(r_opt / 100 * (years_opt - time_opt)),
        //    r_opt,
        //    (years_opt * 1 - time.opt * 1),
        //    (currentTime.getFullYear() + currentTime.getMonth() / 12 + time.opt))
        //pescoast = expgrowth(pmax_pes / Math.exp(r_pes / 100 * (years_pes - time_pes)),
        //    r_pes,
        //    years_pes - time_pes,
        //    currentTime.getFullYear() + currentTime.getMonth() / 12 + time_pes);
        //if (time.opt == 0) {
        //    ylen = (years_opt);
        //} else {
        //    ylen = (time.opt)
        //}
        optcontrib = expcont(0,
            cont.income*12,
            r_save*100,
            year.loan,
            currentTime.getFullYear() + currentTime.getMonth() / 12)
        
        optsave = expcont(optcontrib[1].slice(-1),
            cont.save*12,
            r_save*100,
            Math.min(years_sch,years_sch-years_loan),
            optcontrib[0].slice(-1) / ( 1000 * 3600 * 24 * 365.24 ) + 1970)    
        //if (time_pes == 0) {
        //    ylen = (years_pes);
        //} else {
        //    ylen = (time_pes)
        //}
        pescontrib = expcont(p0_loan,
            cont.loan*12,
            r_loan*100,
            year.loan,
            currentTime.getFullYear() + currentTime.getMonth() / 12)

        graphDiv = document.getElementById('tester')

        //update the layout and all the traces
        Plotly.react(TESTER, [
            {
                x: pescontrib[0],
                y: pescontrib[1],
                name: 'Loan Repayment',
                marker: {
                    color: '#d62728',
                }
            },
            {
                x: optcontrib[0],
                y: optcontrib[1],
                name: 'Saving Partial Income',
                marker: {
                    color: '#2ca02c',
                }
            },
            {
                x: optsave[0],
                y: optsave[1],
                name: 'Saving Full Income',
                marker: {
                    color: '#17becf',
                }
            },
    ], layout);
    }
