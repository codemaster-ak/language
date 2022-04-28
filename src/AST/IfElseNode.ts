import BlockNode from './BlockNode';
import Node from './Node';

export default class IfElseNode {
    conditions: Node
    body: BlockNode
    alter?: BlockNode

    constructor(conditions: Node, body: BlockNode, alter?: BlockNode) {
        this.conditions = conditions
        this.body = body
        this.alter = alter
    }
}
