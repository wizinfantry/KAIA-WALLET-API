-----

# KAIA Wallet API

This repository provides a convenient JavaScript utility for interacting with the Klaytn network, where **KAIA** is the native coin. It simplifies common blockchain operations like wallet management, balance inquiries, and sending both native KAIA and ERC20 tokens. This utility is built on top of the robust `ethers.js` library.

-----

### Features

  * **Wallet Creation & Management**:
      * Generate brand new random wallets.
      * Load existing wallets securely using a private key.
      * Display essential wallet details: address, private key, and mnemonic phrase (if available).
  * **Balance Retrieval**:
      * Effortlessly check the native KAIA balance of any wallet.
      * Retrieve the balance of any ERC20 token.
  * **Transaction Handling**:
      * Send native KAIA to any recipient address.
      * Transfer ERC20 tokens to any address.
      * Fetch transaction receipts using a transaction hash.

-----

### Installation

To get started with this utility, you'll need **Node.js** and **npm** (Node Package Manager) installed on your system.

1.  **Clone the repository (or simply copy the code):**

    ```bash
    git clone https://github.com/wizinfantry/KAIA-WALLET-API.git
    cd KAIA-WALLET-API
    ```

2.  **Install the necessary dependencies:**

    ```bash
    npm install ethers
    ```

-----

### Usage

The core functionality of this API is encapsulated within the **`KAIAWallet`** class.

#### 1\. Setup

First, you'll need your Klaytn RPC URL. You can either provide an existing private key to load a wallet or let the utility generate a new random one for you.

```javascript
import { KAIAWallet } from "./KAIAWallet.js"; // Adjust path as needed

// Your Klaytn RPC URL (e.g., Baobab Testnet, Cypress Mainnet)
const providerUrl = "https://public-en-baobab.klaytn.net"; // Example Baobab Testnet RPC

// !!! IMPORTANT: Replace this with your actual private key for an existing wallet.
// For security reasons, never hardcode private keys in production environments.
const privateKey = 'YOUR_PRIVATE_KEY_HERE'; // e.g., '0x123...abc'

// To create a brand new random wallet:
// const wallet = new KAIAWallet(null, providerUrl);
// To use an existing wallet:
const wallet = new KAIAWallet(privateKey, providerUrl);
```

#### 2\. Examples

Here's how you can use the methods provided by the **`KAIAWallet`** class:

```javascript
const main = async () => {
    // Get the wallet's public address
    console.log("Wallet Address:", wallet.getAddress());

    // Get the native KAIA balance
    const kaiaBalance = await wallet.getBalance();
    console.log("KAIA Balance:", kaiaBalance, "KAIA");

    // --- ERC20 Token Operations ---
    // Make sure to replace this with the actual address of the ERC20 token you wish to interact with
    const tokenAddress = "0xYOUR_ERC20_TOKEN_ADDRESS_HERE"; // e.g., "0xAbc...123"

    // Get ERC20 token balance
    try {
        const tokenBalance = await wallet.getTokenBalance(tokenAddress);
        console.log("Token Balance:", tokenBalance);
    } catch (error) {
        console.error("Error getting token balance. Ensure the token address is correct and the network is accessible:", error.message);
    }

    // Send ERC20 tokens
    // Replace 'RECIPIENT_TOKEN_ADDRESS_HERE' with the intended recipient's address
    // Replace 'AMOUNT_TO_SEND' with the desired token amount (e.g., "5.5" for 5.5 tokens)
    try {
        console.log("\nAttempting to send tokens...");
        const tokenRecipient = 'RECIPIENT_TOKEN_ADDRESS_HERE';
        const tokenAmount = "10";
        const tokenTx = await wallet.sendToken(tokenAddress, tokenRecipient, tokenAmount);
        console.log("Token Transaction Hash:", tokenTx.hash);
        console.log("Waiting for token transaction to be confirmed...");
        await tokenTx.wait(); // It's good practice to wait for the transaction to be mined
        console.log("Token transaction confirmed!");
    } catch (error) {
        console.error("Error sending tokens:", error.message);
    }

    // --- Native KAIA Operations ---
    // Send native KAIA
    // Replace 'RECIPIENT_KAIA_ADDRESS_HERE' with the intended recipient's address
    // Replace 'AMOUNT_TO_SEND_KAIA' with the desired KAIA amount (e.g., "0.005")
    try {
        console.log("\nAttempting to send native KAIA...");
        const kaiaRecipient = 'RECIPIENT_KAIA_ADDRESS_HERE';
        const kaiaAmount = "0.001";
        const kaiaTx = await wallet.sendTransaction(kaiaRecipient, kaiaAmount);
        console.log("KAIA Transaction Hash:", kaiaTx.hash);
        console.log("Waiting for KAIA transaction to be confirmed...");
        await kaiaTx.wait(); // Wait for the transaction to be mined
        console.log("KAIA transaction confirmed!");
    } catch (error) {
        console.error("Error sending KAIA:", error.message);
    }
};

main();
```

-----

### Important Security Notes

  * **Private Keys**: **Never expose your private keys in client-side code or commit them directly to your repository.** For production applications, always use secure methods like environment variables, dedicated key management services, or hardware security modules (HSMs). The example above includes a private key directly for demonstration purposes only.
  * **Network Selection**: The provided `providerUrl` is an example for the Klaytn Baobab testnet. For interactions with the Klaytn Cypress Mainnet, you must update this URL to the appropriate mainnet RPC endpoint.
  * **Error Handling**: The examples include basic `try-catch` blocks for demonstration. In a production environment, comprehensive error handling, logging, and user feedback mechanisms are essential for a robust application.

-----

### Contributing

Contributions are welcome\! Feel free to fork this repository, open issues, or submit pull requests to enhance this utility.
