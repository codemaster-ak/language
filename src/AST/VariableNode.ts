import Token from '../Token';
import Node from './Node';
import {VariableType} from '../VariableType';

export default class VariableNode extends Node {
    value: number | boolean | string | undefined = undefined
    token: Token
    type: VariableType = VariableType.undefined

    constructor(token: Token, value?: string | number | boolean | undefined) {
        super()
        this.token = token
        this.value = value
    }
}
