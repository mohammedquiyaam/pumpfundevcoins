const server = "https://pumpfundevcoinsbackend.onrender.com";

let allCoins = [];
let messages = [];
async function getData(dev, all = false, buy, key, amount, slippage, priorityFee) {
    let result = {};
    if (!dev?.length) {
        alert("developer field is required");
        result.Error = true;
        return result;
    }
    let params = "";
    params += "?dev=" + dev;
    params += "&all=" + all;
    params += "&lastCoinMint=" + allCoins[0]?.mint;
    params += "&phoneNum="
    if (buy) {
        if (!key?.length || !amount?.length || !slippage?.length || !priorityFee?.length) {
            alert("Please fill all details");
            result.Error = true;
            return result;
        }
        params += "&buy=" + buy;

        // get public key here

        params += "&key=" + key;

        params += "&amount=" + parseFloat(amount);
        params += "&slippage=" + parseFloat(slippage);
        params += "&priorityFee=" + parseFloat(priorityFee);
    }

    result = await fetch(server + "/getCoins" + params);
    result = await result.json();
    return result;
}

async function StartButtonClicked() {
    const dev = document.getElementById('developer').value;
    const buy = document.getElementById('buyCheckBox').checked;
    const key = document.getElementById('keyInput').value;
    const amount = document.getElementById('amountInput').value;
    const slippage = document.getElementById('slippageInput').value;
    const priorityFee = document.getElementById('priorityFeeInput').value;

    result = await getData(dev, true, buy, key, amount, slippage, priorityFee);
    if (result.Error) return;
    allCoins = result.data;

    displayCoins();

    // hide necessary fields
    document.getElementById('developer-wrapper').style.display = 'none';

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let count = 1;
    while (true) {
        await timeout(500);
        console.log("Getting the list again");
        const response = await getData(dev, false, buy, key, amount, slippage, priorityFee);
        displayRefreshTime();
        if (response.Error) continue;
        if (response && response.data.length > 0) {
            // new coin was added
            allCoins.unshift(...response.data);
            messages.unshift(...response.messages);
            
            // alert('New coin has been created by this developer.');
            displayMessages();
            displayCoins();
            count ++;
            if (count > 5) break;
        }
    }
}

function displayRefreshTime() {
    const now = new Date();
    const options = { hour12: true};
    const timeString = now.toLocaleTimeString('en-US', options);

    document.getElementById("refreshTime").innerHTML = "Last refreshed on:  " + timeString;
}

function displayCoins() {
    var str = 'Here is the list of coins:';
    str += '<ul>'
    allCoins.forEach(function(coin) {
        str += '<li>'+ coin.name + "    :   " + coin.mint + '</li>';
    }); 
    str += '</ul>';
    document.getElementById("allCoins").innerHTML = str;
}

function displayMessages() {
    var str = 'Messages in regards to new coins:';
    str += '<ul>'
    messages.forEach(function(message) {
        str += '<li>'+ message + '</li>';
    }); 
    str += '</ul>';
    document.getElementById("messages").innerHTML = str;
}
