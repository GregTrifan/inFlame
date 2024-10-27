// contracts/utils/Counter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Counter {
	struct Value {
		uint256 _value;
	}

	function current(Value storage counter) internal view returns (uint256) {
		return counter._value;
	}

	function increment(Value storage counter) internal {
		counter._value += 1;
	}

	function decrement(Value storage counter) internal {
		require(counter._value > 0, "Counter: decrement overflow");
		counter._value -= 1;
	}

	function reset(Value storage counter) internal {
		counter._value = 0;
	}
}
