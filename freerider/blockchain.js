const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ecde = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey) {
        // You can only send a transaction from the wallet that is linked to your
        // key. So here we check if the fromAddress matches your publicKey
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error("You cannot sign transactios for other wallets!");
        }
        // Calculate the hash of this transaction, sign it with the key
        // and store it inside the transaction obect
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error("No signature in this transaction");
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex') //from addrees is a public key.
        return publicKey.verify(this.calculateHash(), this.signature);//verify the has of this has been signed by 
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined:" + this.hash);
    }

    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }

        return true;
    }
}


class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = []; //
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatesBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
        //reset the transaction
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatesBlock().hash);
        block.mineBlock(this.difficulty);   //make difficult to mining

        console.log("Block successfully minned");
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransaction(transaction) {
        // Prevent people from adding a fake mining reward transaction
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("Transaction must incude from and to address");
        }

        // Verify the transactiion
        if (!transaction.isValid()) {
            throw new Error("Cannot add in valid trascation to chain")
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance
    }
    isChainValid() {
        // Check if the Genesis block hasn't been tampered with by comparing
        // the output of createGenesisBlock with the first block on our chain
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }
        for (let i = 1; 1 < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (!currentBlock.hasValidTransactions()) {
                console.log("wrong preious Block")
                return false
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log("wrong current Hash")
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log("currentBlock:" + currentBlock.previousHash)
                console.log("previousBlock:" + previousBlock.hash)
                console.log("wrong preious Hash")
                return false;
            }
        }

        return true
    }
}
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
