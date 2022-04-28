import VariableNode from "./VariableNode";
import Token from "../Token";
import Node from "./Node";

export default class ExpressionNode extends Node {
    variable: VariableNode
    assignment: Token
    operation: Node

    constructor(variable: VariableNode, assignment: Token, operation: Node) {
        super()
        this.variable = variable
        this.assignment = assignment
        this.operation = operation
    }
}
