// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./MerkleLog.sol";

contract LogStorage {
  int64 public storedCharacteristic = 0;
  uint16 public storedMantissa = 100;
  int128 public storedLogX64 = 0;

  function updateLog (
    int64 characteristic,
    uint16 mantissa,
    uint128 logX64,
    bytes32[] memory proof
  ) public {
    int128 log = MerkleLog.log10(characteristic, mantissa, logX64, proof);

    storedCharacteristic = characteristic;
    storedMantissa = mantissa;
    storedLogX64 = log;
  }
}