import VariableNode from './AST/VariableNode';
import Token from './Token';
import {VariableType} from './VariableType';
import ConstantNode from './AST/ConstantNode';

export default class Tools {
    private static instance: Tools | undefined = undefined
    tokens: Token[] = []
    variables: VariableNode[] = []
    constants: ConstantNode[] = []

    private constructor() {
    }

    static getInstance(): Tools {
        if (!Tools.instance) {
            Tools.instance = new Tools()
        }
        return Tools.instance
    }

    findVariable(name: string): VariableNode | undefined {
        return this.variables.find(variable => variable.token.text === name)
    }

    findConstant(name: string): ConstantNode | undefined {
        return this.constants.find(constant=> constant.token.text === name)
    }

    setVariablesType(type: VariableType): void {
        this.variables.forEach(variable => variable.type = type)
    }
}