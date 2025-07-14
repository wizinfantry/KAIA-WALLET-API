import { ethers } from "ethers";

// ABI (Application Binary Interface) for standard ERC20 token functions.
// This minimal ABI includes functions to check balance, transfer tokens, and get decimal places.
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)",
    "function decimals() view returns (uint8)",
];

/**
 * @class KAIAWallet
 * @description A utility class for interacting with the Klaytn network (which uses KAIA as its native coin).
 * It provides functionalities for wallet creation/loading, checking balances of native coin and ERC20 tokens,
 * and performing transfers for both.
 */
export class KAIAWallet {
    /**
     * @constructor
     * @param {string | null} privateKey - The private key string for an existing wallet. If `null` or empty, a new random wallet will be generated.
     * @param {string} providerUrl - The RPC URL for the Klaytn network (e.g., Klaytn Mainnet, Baobab Testnet).
     */
    constructor(privateKey, providerUrl) {
        // Initialize the JSON RPC provider to connect to the Klaytn network.
        this.provider = new ethers.JsonRpcProvider(providerUrl);

        // Check if a private key is provided to load an existing wallet.
        if (privateKey) {
            // Create a wallet instance using the provided private key and connect it to the provider.
            this.wallet = new ethers.Wallet(privateKey, this.provider);
            console.log("Address:", this.wallet.address);
            console.log("Private Key:", this.wallet.privateKey);
            console.log("Mnemonic:", this.wallet.mnemonic?.phrase || "Not available");
        } else {
            // If no private key is provided, create a new random wallet and connect it to the provider.
            this.wallet = ethers.Wallet.createRandom().connect(this.provider);
            console.log("📌 New wallet has been generated:");
            console.log("Address:", this.wallet.address);
            console.log("Private Key:", this.wallet.privateKey);
            console.log("Mnemonic:", this.wallet.mnemonic?.phrase || "Not available");
        }
    }

    /**
     * Retrieves the public address of the wallet.
     * @returns {string} The wallet's public address.
     */
    getAddress() {
        return this.wallet.address;
    }

    /**
     * Retrieves the private key associated with the wallet.
     * @returns {string} The wallet's private key.
     */
    getPrivateKey() {
        return this.wallet.privateKey;
    }

    /**
     * Asynchronously fetches the native coin (KAIA) balance of the wallet.
     * @returns {Promise<string>} A promise that resolves to the balance in Ether units (KAIA), formatted as a string.
     */
    async getBalance() {
        const balance = await this.provider.getBalance(this.wallet.address);
        return ethers.formatEther(balance); // Convert balance from Wei (BigInt) to Ether (string)
    }

    /**
     * Asynchronously sends a native coin (KAIA) transaction to a specified recipient address.
     * @param {string} to - The recipient's address.
     * @param {string} amountInEther - The amount of KAIA to send, specified in Ether units (e.g., "0.05").
     * @returns {Promise<ethers.TransactionResponse>} A promise that resolves to the transaction response object.
     */
    async sendTransaction(to, amountInEther) {
        const tx = {
            to,
            value: ethers.parseEther(amountInEther), // Convert the amount from Ether string to Wei BigInt
        };
        const transaction = await this.wallet.sendTransaction(tx);
        return transaction;
    }

    /**
     * Asynchronously retrieves the transaction receipt for a given transaction hash.
     * This is useful to confirm if a transaction has been mined and its status.
     * @param {string} txHash - The hash of the transaction.
     * @returns {Promise<ethers.TransactionReceipt | null>} A promise that resolves to the transaction receipt object, or `null` if not found.
     */
    async getTransactionReceipt(txHash) {
        return await this.provider.getTransactionReceipt(txHash);
    }

    /**
     * Asynchronously retrieves the balance of a specific ERC20 token for the wallet.
     * @param {string} tokenAddress - The contract address of the ERC20 token.
     * @returns {Promise<string>} A promise that resolves to the token balance, formatted as a string,
     * taking into account the token's decimals.
     */
    async getTokenBalance(tokenAddress) {
        // Create an ERC20 contract instance. This instance is connected to the provider for read-only operations.
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
        const balance = await contract.balanceOf(this.wallet.address);
        const decimals = await contract.decimals(); // Get the number of decimal places defined for this ERC20 token
        return ethers.formatUnits(balance, decimals); // Format the raw balance using the token's decimals
    }

    /**
     * Asynchronously sends ERC20 tokens to a specified recipient address.
     * @param {string} tokenAddress - The contract address of the ERC20 token to send.
     * @param {string} to - The recipient's address.
     * @param {string} amount - The amount of tokens to send, specified in the token's standard units (e.g., "10.5").
     * @returns {Promise<ethers.TransactionResponse>} A promise that resolves to the transaction response object.
     */
    async sendToken(tokenAddress, to, amount) {
        // Create an ERC20 contract instance. This instance is connected to the wallet
        // itself, allowing for signed transactions (like `transfer`).
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.wallet);
        const decimals = await contract.decimals(); // Get the token's decimal places
        // Parse the human-readable amount into the token's smallest unit (BigInt) before sending.
        const tx = await contract.transfer(to, ethers.parseUnits(amount, decimals));
        return tx;
    }
}
