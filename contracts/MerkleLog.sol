// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MerkleLog {

  function log10 (int128 x) public pure returns (int128) {
    return 0;
  }

  function log10GasCost(int128 x) public view returns (uint256) {
    uint256 gasBefore = gasleft();
    log10(x);
    return gasBefore - gasleft();
  }
}