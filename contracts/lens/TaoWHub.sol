pragma solidity 0.8.20;

import {ITaoWHub} from "./interfaces/ITaoWHub.sol";
import {Types} from "./constants/Types.sol";

contract TaoWHub is ITaoWHub {
    function createProfile(
        Types.CreateProfileParams calldata createProfileParams
    ) external returns (uint256) {
        
    }
}
