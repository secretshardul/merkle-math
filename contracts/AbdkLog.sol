// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "abdk-libraries-solidity/ABDKMath64x64.sol";

contract AbdkLog {

  /**
   * Calculate base 10 logarithm of x.  Revert if x <= 0.
   *
   * @param x signed 64.64-bit fixed point number
   * @return signed 64.64-bit fixed point number
   */
  function log10 (int128 x) public pure returns (int128) {
    unchecked {
      require (x > 0);

      // Change of base rule- log10(x) = log2(x) / log2(10)
      // Magic number- 2^128 / log2(10) = 0x4d104d427de7fbcc47c4acd605be48bc
      return int128 (int256 (
          uint256 (int256 (ABDKMath64x64.log_2 (x))) * 0x4d104d427de7fbcc47c4acd605be48bc >> 128));
    }
  }

  /**
   * Estimate gas to calculate base 10 logarithm with ABDK math.  Revert if x <= 0.
   *
   * @param x signed 64.64-bit fixed point number
   * @return unsigned gas used
   */
  function log10GasCost(int128 x) public view returns (uint256) {
    uint256 gasBefore = gasleft();
    log10(x);
    return gasBefore - gasleft();
  }
}