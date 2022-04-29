import Node from './Node';
import BlockNode from './BlockNode';

export default class WhileNode {
    conditions: Node
    body: BlockNode

    constructor(conditions: Node, body: BlockNode) {
        this.conditions = conditions
        this.body = body
    }
}
