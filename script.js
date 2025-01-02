const server = process.env.backend || "http://localhost:3001";

let newCoins = [];
let initialList = [];
async function getData(dev, all = false) {
    if (!dev?.length) return;
    let len = 0;
    if (!all) len = initialList.length;
    let data = await fetch(server + "/getCoins?dev=" + dev + "&all=" + all + "&initialLength=" + len + "&phoneNum=")
    data = await data.json();
    return data;
}

async function StartButtonClicked() {
    const dev = document.getElementById('developer').value;
    initialList = await getData(dev, true);

    // hide the dev field
    document.getElementById('developer-wrapper').style.display = 'none';

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (true) {
        await timeout(3000);
        console.log("Getting the list again");
        const data = await getData(dev);
        if (data.length > 0 && newCoins.length !== data.length) {
            // new coin was added
            newCoins = data;
            displayNewCoins();
            alert('New coin has been created by this developer.');
        }
    }
}

function displayNewCoins() {
    var str = '<ul>'
    str += '<li>Here is the list of new coins:</li>';
    newCoins.forEach(function(coin) {
        str += '<li>'+ coin.name + "    :   " + coin.mint + '</li>';
    }); 
    str += '</ul>';
    document.getElementById("newCoins").innerHTML = str;
}

