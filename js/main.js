let gameData = {
    data: 0,
    upgrades: { clickUpOne: {level : 1} , passiveUpOne: {level : 0} , passiveUpTwo: {level : 0} , passiveUpThree: {level : 0} },
    lastTick: Date.now()
}

let dataUpgrades = {
    clickUpOne: {
        baseCost: 10, scaling: 1.5,
        cost(level) { return this.baseCost * this.scaling ** level }
    },
    passiveUpOne: {
        baseCost: 50, scaling: 1.1,
        cost(level) { return this.baseCost * this.scaling ** level }
    },
    passiveUpTwo: {
        baseCost: 300, scaling: 1.1,
        cost(level) { return this.baseCost * this.scaling ** level }
    },
    passiveUpThree: {
        baseCost: 1700, scaling: 1.1,
        cost(level) { return this.baseCost * this.scaling ** level }
    }
}

function update(id, content) {
    document.getElementById(id).innerHTML = content;
}

function format(number, type) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / Math.pow(10, exponent)
	if (exponent < 3) return number.toFixed(1)
	if (type == "scientific") return mantissa.toFixed(2) + "e" + exponent
	if (type == "engineering") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
}

function tab(tab) {
    document.getElementById("dataTab").style.display = "none"
    document.getElementById("upgradeTab").style.display = "none"
    document.getElementById(tab).style.display = "inline-block"
}
tab("dataTab")

function collectData() {
    gameData.data += getDataPerClick()
}

function buyUpgrade(gameDataUpgrade, dataUpgradesUpgrade){
    let cost = dataUpgradesUpgrade.cost(gameDataUpgrade.level)
    if (gameData.data >= cost) {
        gameData.data -= cost
        gameDataUpgrade.level++
    }
}

function getDataPerSecond() {
    var result = 0

    result += gameData.upgrades.passiveUpOne.level
    result += gameData.upgrades.passiveUpTwo.level*3
    result += gameData.upgrades.passiveUpThree.level*10

    return result
}

function getDataPerClick(){
    var result = 0
    
    result += gameData.upgrades.clickUpOne.level

    return result
}

function updateElements() {
    update("collectedData", "Training Data: " + format(gameData.data,scientific) + " bits")
    update("clickUpgradeOne", "Increase Data Collection (level: " + format(gameData.upgrades.clickUpOne.level,scientific) + ") (Cost: "+ format(dataUpgrades.clickUpOne.cost(gameData.upgrades.clickUpOne.level),scientific) +")(Increases Data Per Click by 1)")
    update("passiveUpgradeOne", "Upgrade your Automation (level: " + format(gameData.upgrades.passiveUpOne.level,scientific) + ") (Cost: "+ format(dataUpgrades.passiveUpOne.cost(gameData.upgrades.passiveUpOne.level),scientific) +")(Increases Data Per Second by 1)")
    update("passiveUpgradeTwo", "Upgrade your Automation (level: " + format(gameData.upgrades.passiveUpTwo.level,scientific) + ") (Cost: "+ format(dataUpgrades.passiveUpTwo.cost(gameData.upgrades.passiveUpTwo.level),scientific) +")(Increases Data Per Second by 3)")
    update("passiveUpgradeThree", "Upgrade your Automation (level: " + format(gameData.upgrades.passiveUpThree.level,scientific) + ") (Cost: "+ format(dataUpgrades.passiveUpThree.cost(gameData.upgrades.passiveUpThree.level),scientific) +")(Increases Data Per Second by 10)")
}


let mainGameLoop = window.setInterval(function() {
    diff = Date.now() - gameData.lastTick;
    gameData.lastTick = Date.now()
    gameData.data += getDataPerSecond() * (diff/1000)
    updateElements()
}, 50)

function saveGame(){
    localStorage.setItem("singularitySave", JSON.stringify(gameData))
}

function loadGame(){
    let savegame = JSON.parse(localStorage.getItem("singularitySave"))
    if (savegame !== null) {
        merge(gameData,saveGame)
    }
}

let saveGameLoop = window.setInterval(saveGame, 15000)
loadGame()

function merge(a,b) {
    for (k in a) {
        if (typeof a[k] === 'object') {
            merge(a[k], b?.[k])
        }
        else {
            a[k] = b?.[k] ?? a[k]
        }
    }
}
