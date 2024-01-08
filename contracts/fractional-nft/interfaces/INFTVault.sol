pragma solidity 0.8.20;

interface INFTVault {
    function purchase(uint256 _amount) external;
    function redeem() external;
    function fractionalize(address _to, uint256 _supply) external;
    function configureSale(uint256 _price) external;


    /** ******* Struct & Enum ******* */
    enum State { inactive, fractionalized, live, redeemed, boughtOut }

    /** ******* Events ******* */
    event Purchased(address buyer, uint256 amount);
    event Redeemd(address sender, address collection, uint256 tokenId);
    event Fractionalized(address collection, address vault);


    /** ******* Errors ******* */
    error NotEnoughBalance(address sender, uint256 amount );

}
