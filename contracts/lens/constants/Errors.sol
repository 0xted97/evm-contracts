// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

library HandlesErrors {
    error HandleLengthInvalid();
    error HandleContainsInvalidCharacters();
    error HandleFirstCharInvalid();
    error NotOwnerNorWhitelisted();
    error NotOwner();
    error NotHub();
    error DoesNotExist();
    error NotEOA();
    error DisablingAlreadyTriggered();
    error GuardianEnabled();
    error AlreadyEnabled();
}
