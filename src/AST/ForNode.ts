import Node from './Node';
import BlockNode from './BlockNode';
import ExpressionNode from './ExpressionNode';
import VariableNode from './VariableNode';

export default class ForNode {
    body: BlockNode
    conditions?: Node
    final?: ExpressionNode | null | undefined
    scope: VariableNode[] = []

    constructor(body: BlockNode, conditions?: Node, final?: ExpressionNode | null) {
        this.body = body
        this.conditions = conditions
        this.final = final
    }
}
