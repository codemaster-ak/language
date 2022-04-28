import Node from './Node';

export default class BlockNode extends Node {
    body: Node[]

    constructor(body: Node[]) {
        super()
        this.body = body
    }
}
