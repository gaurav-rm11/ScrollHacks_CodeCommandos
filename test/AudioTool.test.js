const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuditTool", function () {
    let auditTool;
    let owner;
    let auditor;

    beforeEach(async () => {
        // Deploy the contract before each test
        const AuditToolFactory = await ethers.getContractFactory("AuditTool");
        auditTool = await AuditToolFactory.deploy();
        await auditTool.waitForDeployment(); // Ensure the contract is deployed

        [owner, auditor] = await ethers.getSigners(); // Get signer addresses
    });

    describe("Deployment", () => {
        it("Should deploy the contract correctly", async () => {
            expect(await auditTool.auditCount()).to.equal(0);
            expect(await auditTool.owner()).to.equal(owner.address); // Use .address to get the address
        });
    });

    describe("Audit Management", () => {
        it("Should log an audit", async () => {
            const contractAddress = "0x1234567890abcdef1234567890abcdef12345678"; // Sample contract address
            await auditTool.connect(auditor).logAudit(contractAddress, 0); // 0 for AuditType.New

            const audit = await auditTool.getAudit(1);
            expect(audit.id).to.equal(1);
            expect(audit.auditor).to.equal(auditor.address); // Use .address to get the address
            expect(audit.contractAddress).to.equal(contractAddress);
            expect(audit.auditType).to.equal(0); // AuditType.New
            expect(audit.status).to.equal(0); // AuditStatus.Pending
            expect(audit.timestamp).to.be.gt(0);
        });

        it("Should update an audit", async () => {
            const contractAddress = "0x1234567890abcdef1234567890abcdef12345678"; // Sample contract address
            await auditTool.connect(auditor).logAudit(contractAddress, 0); // Log an audit

            const result = "Audit passed.";
            await auditTool.connect(auditor).updateAudit(1, result, 1); // Update audit to Completed

            const updatedAudit = await auditTool.getAudit(1);
            expect(updatedAudit.result).to.equal(result);
            expect(updatedAudit.status).to.equal(1); // AuditStatus.Completed
        });

        it("Should revert if getting an invalid audit ID", async () => {
            await expect(auditTool.getAudit(999)).to.be.revertedWith("Invalid audit ID");
        });
    });
});
