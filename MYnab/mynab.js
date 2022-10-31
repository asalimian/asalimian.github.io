const DB_NAME = 'MYnab';
const DB_VERSION = 2; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = 'data';

var db;

// Used to keep track of which view is displayed to avoid uselessly reloading it
var current_view_pub_key;

function showAuth() {
    document.getElementById('ynabauth').hidden=false;
}

function openDb() {
    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
        // Equal to: db = req.result;
        db = this.result;
        console.log("openDb DONE");
    };
    req.onerror = function (evt) {
        console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
        console.log("openDb.onupgradeneeded");
        var store = evt.currentTarget.result.createObjectStore(
            DB_STORE_NAME + DB_VERSION, { keyPath: 'id' });

        store.createIndex('date', 'date', { unique: false });
        store.createIndex('amount', 'amount', { unique: false });
        store.createIndex('payee_name', 'payee_name', { unique: false });
    };
};

function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function plotthisdata() {
    var x = [];
    var y = [];
    
    groups = JSON.parse(localStorage.getItem('groups'))
    accounts = JSON.parse(sessionStorage.getItem('accounts'))

    tablestring = '<tr>'
    tablestring += '<colgroup><col id=\'col1\'><col id=\'col2\'>'
    i = 3
    headerstring = '';
    for (acct of Object.keys(accounts).sort()) {
        tablestring += '<col id=\'col'+i+'\'>'
        headerstring += '<th onclick="document.getElementById(\'col'+i+'\').style.visibility=\'collapse\'">'+ acct +'</th>'
        i += 1
    }
    j=3
    tablestring += '</colgroup><th onclick="for (let j=3;j<=i;j++) {document.getElementById(\'col\'+j).style.visibility=\'\'}">Category</th><th>Row Total</th>'
    tablestring += headerstring
    tablestring += '</tr>'



    
    if (groups!=null) {
        TESTER = document.getElementById('tester');
        
        for (cat in groups) {
            x.push(cat)
            y.push(groups[cat]['value'])
            
        }
        
        for (cat of Object.keys(groups).sort()) {
            
            tablestring += '<tr><td>' + cat + '</td><td>$' + Math.round(groups[cat]['value'])+ '</td>'
                for (acct of Object.keys(accounts).sort()) {
                    try {
                        text = Math.round(groups[cat]['accounts'][acct])
                        if (text>0) {
                            text='$'+text;
                        } else {
                            text='';
                        }
                        tablestring += '<td>'+ text +'</td>'
                    }
                    catch {
                        tablestring += '<td>0</td>'
                    }
                }
            tablestring += '</tr>'
        }
        tablestring = tablestring + '<tr style="font-weight:bold"><td>Total</td><td>$' + Math.round(localStorage.getItem('total'))+ '</td></tr>'
        var data = [{y:x,x:y,
            'type':'bar','orientation':'h'}];
            Plotly.react(TESTER, data);
            
            document.getElementById('tablearea').innerHTML = "<table>" +tablestring+ "</table>"
    }
};

function sumthisdata() {
    var objectStore = getObjectStore(DB_STORE_NAME + DB_VERSION, 'readonly');
    const index = objectStore.index("date");

    // Match anything between "Bill" and "Donna", but not including "Donna"
    const boundKeyRange = IDBKeyRange.bound("2000-01-10", "2099-10-01", false, false);

    // To use one of the key ranges, pass it in as the first argument of openCursor()/openKeyCursor()
    var total = 0;
    var groups = {};
    index.openCursor(boundKeyRange).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            // Do something with the matches.
            if (cursor.value.item.account_name.substring(0,2)=='\uD83D\uDCB2') {
                if (cursor.value.item.payee_name.substring(0,13) == 'Transfer : \uD83D\uDCC8' ) {
                    if (cursor.value.item.category_name!='Inflow: Ready to Assign') {
                        if (cursor.value.item.subtransactions.length>0) {
                            for (sub of cursor.value.item.subtransactions) {
                                if (groups[sub.category_name]==null) 
                                    {
                                        groups[sub.category_name] = {'value':0,'accounts':{}}
                                    }
                                amount = sub.amount / 1000;
                                total -= amount;      
                                catname = sub.category_name;
                                acctname = cursor.value.item.payee_name.substring(11,);
                                
                                // Sum the total for the category
                                if (groups[catname]['value']) {
                                    groups[catname]['value'] = groups[catname]['value'] - amount;    
                                } else {
                                    groups[catname]['value'] = - amount;    
                                }
                                
                                // Add account to the accounts list
                                accounts = JSON.parse(sessionStorage.getItem('accounts'))
                                if (accounts==null){accounts={}}    
                                accounts[acctname] = true
                                sessionStorage.setItem('accounts',JSON.stringify(accounts))

                                // Sum the account total for the category
                                if (groups[catname]['accounts'][acctname]) {
                                    groups[sub.category_name]['accounts'][acctname] = groups[catname]['accounts'][acctname] - amount;
                                } else {
                                    groups[sub.category_name]['accounts'][acctname] = -amount;
                                }                                                    
                            }
                        } else {
                            if (groups[cursor.value.item.category_name]==null) 
                                {
                                    groups[cursor.value.item.category_name] = {'value':0,'accounts':{}}
                                }
                            amount = cursor.value.amount / 1000;
                            total -= amount;   
                            catname = cursor.value.item.category_name;
                            acctname = cursor.value.item.payee_name.substring(11,);
                            
                            // Sum the total for the category
                            if (groups[catname]['value']) {
                                groups[catname]['value'] = groups[catname]['value'] - amount;    
                            } else {
                                groups[catname]['value'] = -amount;
                            }
                            
                            
                            // Add account to accounts list
                            accounts = JSON.parse(sessionStorage.getItem('accounts'))
                            if (accounts==null){accounts={}}    
                            accounts[acctname] = true
                            sessionStorage.setItem('accounts',JSON.stringify(accounts))

                            // Sum the account total for the category
                            //if (prevalue==null){prevalue=0}
                            if (groups[catname]['accounts'][acctname]) {
                                groups[catname]['accounts'][acctname] = groups[catname]['accounts'][acctname] - amount;
                            } else {
                                groups[catname]['accounts'][acctname] = -amount;    
                            }
                            
                        }
                    }
                }
                
            }
            cursor.continue();
        } else {
            console.log('summing done ' + total);
            localStorage.setItem('total', total);
            document.getElementById('result').value = JSON.stringify(groups);
            const sorted = Object.fromEntries(
                Object.entries(groups).sort(([,a],[,b]) => a-b)
            );
            localStorage.setItem('groups',JSON.stringify(sorted))
            plotthisdata(sorted);
        }
    };



}
function findlastdata() {
    var objectStore = getObjectStore(DB_STORE_NAME + DB_VERSION, 'readonly');
    const index = objectStore.index("date");

    // Match anything between "Bill" and "Donna", but not including "Donna"
    const boundKeyRange = IDBKeyRange.bound("2000-01-10", "2099-10-01", false, false);

    // To use one of the key ranges, pass it in as the first argument of openCursor()/openKeyCursor()
    var lastrefresh
    try {
        index.openCursor(boundKeyRange, "prev").onsuccess = event => {
            const cursor = event.target.result;
            lastrefresh = cursor.value.item.date
            localStorage.setItem('lastrefresh',lastrefresh)
            document.getElementById('load').innerHTML = 'Acquire new data since ' + lastrefresh
        };
    } catch {
        lastrefresh = "2000-01-10";
    }
    return lastrefresh
}

function addItem(item) {
    console.log("addPublication arguments:", arguments);
    var obj = { id: item.id, date: item.date, amount: item.amount, payee_name: item.payee_name, item: item };

    var store = getObjectStore(DB_STORE_NAME + DB_VERSION, 'readwrite');
    var req;
    try {
        req = store.add(obj);
    } catch (e) {
        if (e.name == 'DataCloneError')
            displayActionFailure("This engine doesn't know how to clone a Blob, " +
                "use Firefox");
        throw e;
    }
    req.onsuccess = function (evt) {
        console.log("Insertion in DB successful");
        //displayActionSuccess();
        //displayPubList(store);
    };
    req.onerror = function () {
        //console.error("addPublication error", this.error);
        //displayActionFailure(this.error);
    };
};

function adddata(data) {
    for (item of data.transactions) {
        addItem(item)
    };
    document.getElementById('load').innerText = 'Refresh';
}


function getdata() {
    document.getElementById('load').disabled = true;
    document.getElementById('spinner').style.visibility = 'visible';
    document.getElementById('spinner').hidden = false;

    lastrefresh = localStorage.getItem('lastrefresh')
    if (lastrefresh==null) {lastrefresh = '2000-01-01'}
    if (sessionStorage.getItem('api')!=null) {
        qry = 'https://api.youneedabudget.com/v1/budgets/default/transactions?since_date='+lastrefresh
        console.log(qry)
        fetch(qry, { headers: { Accept: "application/json", Authorization: "Bearer " + sessionStorage.getItem('api') } })
            .then(response => response.json())
            .then(data => adddata(data.data));
    } else {
        console.log('No valid token, please login.')
        document.getElementById('load').disabled = true;
    }
    
    document.getElementById('load').disabled = true;
    document.getElementById('spinner').style.visibility = 'hidden';
    document.getElementById('spinner').hidden = true;
    lastrefresh = findlastdata()
    document.getElementById('load').innerHTML = 'Acquired data till ' + lastrefresh
}


(function () {


    openDb();



})(); // Immediately-Invoked Function Expression (IIFE)