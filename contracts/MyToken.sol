// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IERC20.sol";

contract MyToken is IERC20 {    
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowance;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        decimals = 18;
        owner = msg.sender;
        _mint(msg.sender, 10 ether); // 10 * 10^18
    }

    function mint(address recipient, uint256 amount) public {
        require(msg.sender == owner, "MyToken: you are not an owner");
        _mint(recipient, amount);
    }

    function _mint(address recipient, uint256 amount) internal {
        totalSupply += amount;
        _balances[recipient] += amount;

        emit Transfer(address(0), recipient, amount);
    }

    function balanceOf(address account) public view override returns(uint256 balance) {
        balance = _balances[account];
    }

    function transfer(address to, uint256 amount) public override returns(bool) {
        require(_balances[msg.sender] >= amount, "MyToken: Not enough balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        emit Transfer(msg.sender, to, amount);

        return true;
    }

    function allowance(address _owner, address spender) public view override returns(uint256) {
        return _allowance[_owner][spender];
    }

    function approve(address spender, uint256 value) public override returns(bool) {
        _allowance[msg.sender][spender] = value;

        emit Approval(msg.sender, spender, value);

        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns(bool) {
        require(_balances[from] >= amount, "MyToken: Insufficient balance");
        require(_allowance[from][msg.sender] >= amount, "MyToken: Insufficient allowance");

        _balances[from] -= amount;
        _balances[to] += amount;

        _allowance[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);

        return true;
    }

    function burn(uint256 amount) public {
        require(_balances[msg.sender] >= amount, "MyToken: Insufficient balance");

        totalSupply -= amount;
        _balances[msg.sender] -= amount;

        emit Transfer(msg.sender, address(0), amount);
    }
}