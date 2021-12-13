const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const mykey = ec.keyFromPrivate('1e38be3429136f405e4353e1d798113a714fd8637158d70ef102afbacfe2e631')
const myWalletAddress = mykey.getPublic('hex');


let freeriderCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10);
tx1.signTransaction(mykey);
freeriderCoin.addTransaction(tx1);

console.log("\n Start the miner...");
freeriderCoin.minePendingTransactions(myWalletAddress);

console.log('\n Balance of xavier is', freeriderCoin.getBalanceOfAddress(myWalletAddress));

console.log('Is chain valid?',freeriderCoin.isChainValid());

