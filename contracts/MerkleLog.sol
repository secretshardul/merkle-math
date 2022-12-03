// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

library MerkleLog {
  // The merkle root of log values from 0.100 to 9.999 in X64 format
  bytes32 constant root = 0x998add033af31411c96b8272b055b95b55d92f349c84111d5fac9e2cfcad7589;

  /**
   * Calculate base 10 logarithm of x with merkle proof.
   *
   * x is provided in scientific notation, i.e. for x = 110 = 10^1 * 1.10
   * characteristic = 2, mantissa = 110
   *
   * @param characteristic The characteristic of x
   * @param mantissa The mantissa of x
   * @param logX64 The log table value of the mantissa as 64.64-bit fixed point number
   * @param proof The merkle proof to show `logX64` corresponds to `mantissa`
   * @return signed 64.64-bit fixed point number
   */
  function log10 (
    int64 characteristic,
    uint16 mantissa,
    uint128 logX64,
    bytes32[] memory proof
  ) public pure returns (int128) {
    bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(mantissa, logX64))));
    require(MerkleProof.verify(proof, root, leaf), "Invalid proof");

    // Add characteristicX64
    return (int128(characteristic) << 64) + int128(logX64);
  }

  /**
   * Estimate the gas cost of merkle log
   */
  function log10GasCost(
    int64 characteristic,
    uint16 mantissa,
    uint128 logX64,
    bytes32[] memory proof
  ) public view returns (uint256) {
    uint256 gasBefore = gasleft();
    log10(characteristic, mantissa, logX64, proof);
    return gasBefore - gasleft();
  }
}
