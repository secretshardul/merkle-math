// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleLog {
  bytes32 constant root = 0x998add033af31411c96b8272b055b95b55d92f349c84111d5fac9e2cfcad7589;

  function log10 (
    uint16 x,
    uint128 logX64,
    bytes32[] memory proof
  ) public pure returns (uint128) {
    bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(x, logX64))));
    require(MerkleProof.verify(proof, root, leaf), "Invalid proof");
    return logX64;
  }

  function log10GasCost(
    uint16 x,
    uint128 logX64,
    bytes32[] memory proof
  ) public view returns (uint256) {
    uint256 gasBefore = gasleft();
    log10(x, logX64, proof);
    return gasBefore - gasleft();
  }
}