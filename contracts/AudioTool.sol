// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract AuditTool {
    enum AuditType { New, Repeat, Fix } // Audit types
    enum AuditStatus { Pending, Completed, Failed } // Audit status

    struct Audit {
        uint256 id;
        address auditor;
        string contractAddress;
        AuditType auditType;
        string result; // Result of the audit
        AuditStatus status; // Status of the audit
        uint256 timestamp;
    }

    // State variables
    uint256 public auditCount; // Total number of audits
    mapping(uint256 => Audit) public audits; // Mapping of audit ID to audit details
    address public owner; // Contract owner

    // Events
    event AuditCreated(uint256 id, address indexed auditor, string contractAddress, AuditType auditType, AuditStatus status, uint256 timestamp);
    event AuditUpdated(uint256 id, string result, AuditStatus status);

    // Modifier to restrict functions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender; // Set contract deployer as the owner
    }

    // Function to log an audit result
    function logAudit(string memory contractAddress, AuditType auditType) public {
        auditCount++; // Increment audit count
        audits[auditCount] = Audit(auditCount, msg.sender, contractAddress, auditType, "", AuditStatus.Pending, block.timestamp);
        emit AuditCreated(auditCount, msg.sender, contractAddress, auditType, AuditStatus.Pending, block.timestamp);
    }

    // Function to update the audit result
    function updateAudit(uint256 id, string memory result, AuditStatus status) public {
        require(id > 0 && id <= auditCount, "Invalid audit ID");
        Audit storage audit = audits[id];
        require(msg.sender == audit.auditor || msg.sender == owner, "Not authorized to update");

        audit.result = result;
        audit.status = status;
        emit AuditUpdated(id, result, status);
    }

    // Function to retrieve audit details by ID
    function getAudit(uint256 id) public view returns (Audit memory) {
        require(id > 0 && id <= auditCount, "Invalid audit ID");
        return audits[id];
    }

    // Function to change the contract's owner (if necessary)
    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
