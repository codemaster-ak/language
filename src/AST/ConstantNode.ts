import Token from '../Token';
import {VariableType} from '../VariableType';
import VariableNode from './VariableNode';
import {tokenTypesList} from '../TokenType';

export default class ConstantNode extends VariableNode {
    readonly value: number | boolean | string | undefined
    type: VariableType = VariableType.undefined

    constructor(token: Token, valueToken: Token) {
        super(token)
        switch (valueToken.type) {
            case tokenTypesList.number:
                this.value = Number(valueToken.text)
                this.type = VariableType.number
                break
            case tokenTypesList.true:
                this.value = true
                this.type = VariableType.boolean
                break
            case tokenTypesList.false:
                this.value = false
                this.type = VariableType.boolean
                break
        }
    }
}