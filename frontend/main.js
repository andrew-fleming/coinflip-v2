Moralis.initialize("<INSERT_API_KEY_HERE")
Moralis.serverURL = "<INSERT_SERVER_URL_HERE"
const CONTRACT_ADDRESS = "<INSERT_CONTRACT_ADDRESS_HERE>"

function fromWei(num){
    return num / (10 ** 18)
}

function toWei(num){
    return num * (10 ** 18)
}

async function renderApp() {
    /**
     * Instantiates Web3 and contract. This is called by the login function.
     */
    window.web3 = await Moralis.Web3.enable();
    window.contract = new web3.eth.Contract(window.abi, CONTRACT_ADDRESS);
    console.log(window.contract)
}


async function login() {
    /**
     * Opens the application upon connecting to MetaMask.
     */
    try {
        user = await Moralis.User.current();
        if(!user) {
            user = await Moralis.Web3.authenticate();
        }

        console.log(user);
        document.getElementById("login_button").style.display = "none";
        document.getElementById("game").style.display = "block";
        renderApp()

    } catch(error) {
        console.log(error);
    }
}

async function flip(choice) {
    /**
     * @notice Core function of this dApp. 
     * @param {*} choice Heads or tails where heads is zero and tails is one. 
     */
    let amount = document.getElementById("amount").value
    window.web3 = await Moralis.Web3.enable()
    let config = {
        value: toWei(amount),
        from: ethereum.selectedAddress
    }
    window.contract.methods.flip(choice).send(config)
    .on('receipt', function(receipt){
        console.log(receipt)
    })
}

async function withdrawPlayerWinnings(){
    /**
     * @notice
     */
    let config = {
        from: ethereum.selectedAddress,
    }
    window.contract.methods.withdrawPlayerWinnings().send(config)
    .on("receipt", function(receipt){
        console.log(receipt)
    })
}


/// ***** GETTERS ***** ///

async function getContract(){
    /**
     * @notice
     */
    let bal = await window.contract.methods.contractBalance().call()
    console.log(`Contract Balance: ${fromWei(bal)} ETH`)
}

async function getWinningsBalance(){
    /**
     * @notice Fetches the caller's balance.
     */
    config = {
        from: ethereum.selectedAddress
    }
    let bal = await window.contract.methods.getWinningsBalance().call(config)
    console.log(`Winnings balance: ${fromWei(bal)} ETH`)
}

async function getTotalValue(){
    /**
     * @notice Owner function. Fetches both the total balance of the contract as well as
     * the combined player winning's balances.
     */
    config = {
        from: ethereum.selectedAddress
    }
    let bal = await window.contract.methods.getTotalValue().call(config)
    console.log(`Total value: ${fromWei(bal)} ETH`)
}

async function getLinkBalance(){
    /**
     * Owner function
     */
    config = {
        from: ethereum.selectedAddress
    }
    let bal = await window.contract.methods.getLinkBalance().call(config)
    console.log(`Link balance: ${fromWei(bal)} LINK`)
}

document.getElementById("login_button").onclick = login;
document.getElementById("heads_button").onclick = function(){flip(0)};
document.getElementById("tails_button").onclick = function(){flip(1)};
document.getElementById("withdraw_player_winnings").onclick = function(){withdrawPlayerWinnings()}
document.getElementById("contract_balance").onclick = function(){getContract()}
document.getElementById("player_winnings").onclick = function(){getWinningsBalance()};
document.getElementById("link_balance").onclick = function(){getLinkBalance()};
document.getElementById("total_value").onclick = function(){getTotalValue()}