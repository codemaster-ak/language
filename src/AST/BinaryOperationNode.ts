import Node from "./Node";
import Token from "../Token";

export default class BinaryOperationNode extends Node {
    leftNode: Node
    operator: Token
    rightNode: Node

    constructor(leftNode: Node, operator: Token, rightNode: Node) {
        super()
        this.leftNode = leftNode
        this.operator = operator
        this.rightNode = rightNode
    }
}
