// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0;

import {Types} from './../constants/Types.sol';

/**
 * @title ITaoWHub Protocol
 * @author TaoWHub Protocol
 *
 * @notice This is the interface for Lens Protocol's core functions. It contains all the entry points for performing
 * social operations.
 */
interface ITaoWHub {
    /**
     * @notice Creates a profile with the specified parameters, minting a Profile NFT to the given recipient.
     * @custom:permissions Any whitelisted profile creator.
     *
     * @param createProfileParams A CreateProfileParams struct containing the needed params.
     */
    function createProfile(Types.CreateProfileParams calldata createProfileParams) external returns (uint256);
}
