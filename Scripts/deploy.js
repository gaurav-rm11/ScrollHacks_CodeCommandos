// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    const AuditToolFactory = await ethers.getContractFactory("AuditTool");

    try {
        // Deploy the contract
        console.log("Attempting to deploy AuditTool...");
        const auditTool = await AuditToolFactory.deploy();
        console.log("Deploying complete.");

        // Check if the auditTool instance has deployTransaction
        if (!auditTool.deployTransaction) {
            throw new Error("Deployment transaction is undefined. The contract may not have deployed successfully.");
        }

        // Wait for the deployment to be confirmed
        const txReceipt = await auditTool.deployTransaction.wait();
        
        console.log("AuditTool deployed to:", auditTool.address);
        console.log("Transaction Receipt:", txReceipt);
    } catch (error) {
        console.error("Deployment failed:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
