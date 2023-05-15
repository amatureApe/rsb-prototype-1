// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

library QuestionUtils {
    bytes constant Q = bytes("Q: ");

    bytes constant QSPECS =
        bytes(
            "? --- A:1 for yes. 0 for no. 2 for ambiguous/unknowable | -------- Specifications --------> "
        );

    bytes32 constant IDENTIFIER = bytes32("YES_OR_NO_QUERY"); // Use the yes no idetifier to ask arbitary questions, such as the weather on a particular day.

    function createAncillaryData(
        bytes memory _question,
        bytes memory _specifications
    ) public pure returns (bytes memory) {
        bytes memory question = abi.encodePacked(
            Q,
            _question,
            QSPECS,
            _specifications
        );
        return question;
    }
}
