import Node from './AST/Node';
import BlockNode from './AST/BlockNode';
import ExpressionNode from './AST/ExpressionNode';
import BinaryOperationNode from './AST/BinaryOperationNode';
import {tokenTypesList} from './TokenType';
import VariableNode from './AST/VariableNode';
import NumberNode from './AST/NumberNode';
import StringNode from './AST/StringNode';
import BooleanNode from './AST/BooleanNode';
import UnaryOperationNode from './AST/UnaryOperationNode';
import Tools from './Tools';
import IfElseNode from './AST/IfElseNode';
import ConstantNode from './AST/ConstantNode';
import WhileNode from './AST/WhileNode';


export default class Executor {
    readonly tools: Tools

    constructor(tools: Tools) {
        this.tools = tools
    }

    run(node: Node): any {
        if (node instanceof BlockNode) {
            node.body.forEach(expression => {
                this.run(expression)
            })
            return
        }
        if (node instanceof WhileNode) {
            let conditionResult = this.run(node.conditions)
            while (conditionResult) {
                this.run(node.body)
                conditionResult = this.run(node.conditions)
            }
            return
        }
        if (node instanceof IfElseNode) {
            const conditionResult = this.run(node.conditions)
            if (conditionResult) this.run(node.body)
            else {
                if (node.alter) this.run(node.alter)
            }
            return
        }
        if (node instanceof ExpressionNode) {
            const result = this.run(node.operation)
            const variable = this.tools.findVariable(node.variable.token.text)
            if (variable) {
                if (typeof result === variable.type) {
                    variable.value = result
                } else throw new Error(`Ошибка присвоения ${variable.token.text} - несоответствие типов`)
            }
            return
        }
        if (node instanceof UnaryOperationNode) {
            switch (node.operator.type) {
                case tokenTypesList.not:
                    return !this.run(node.operand)
            }
        }
        if (node instanceof BinaryOperationNode) {
            switch (node.operator.type) {
                case tokenTypesList.plus:
                    return this.run(node.leftNode) + this.run(node.rightNode)
                case tokenTypesList.minus:
                    return this.run(node.leftNode) - this.run(node.rightNode)
                case tokenTypesList.multiply:
                    return this.run(node.leftNode) * this.run(node.rightNode)
                case tokenTypesList.divide:
                    return this.run(node.leftNode) / this.run(node.rightNode)
                case tokenTypesList.and:
                    return this.run(node.leftNode) && this.run(node.rightNode)
                case tokenTypesList.or:
                    return this.run(node.leftNode) || this.run(node.rightNode)
                case tokenTypesList.equals:
                    return this.run(node.leftNode) == this.run(node.rightNode)
                case tokenTypesList.notEquals:
                    return this.run(node.leftNode) != this.run(node.rightNode)
                case tokenTypesList.more:
                    return this.run(node.leftNode) > this.run(node.rightNode)
                case tokenTypesList.less:
                    return this.run(node.leftNode) < this.run(node.rightNode)
                case tokenTypesList.moreEquals:
                    return this.run(node.leftNode) >= this.run(node.rightNode)
                case tokenTypesList.lessEquals:
                    return this.run(node.leftNode) <= this.run(node.rightNode)
            }
        }
        /** Порядок имеет значение, так как вначале должна быть проверка на ConstantNode */
        if (node instanceof ConstantNode) {
            return this.tools.findConstant(node.token.text)?.value
        }
        if (node instanceof VariableNode) {
            return this.tools.findVariable(node.token.text)?.value
        }
        if (node instanceof NumberNode) {
            return Number(node.number.text)
        }
        if (node instanceof StringNode) {
            return String(node.string.text)
        }
        if (node instanceof BooleanNode) {
            return node.boolean.text === tokenTypesList.true.name
        }
        throw new Error('Ошибка выполнения программы!')
    }
}