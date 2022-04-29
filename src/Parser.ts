import Token from './Token';
import TokenType, {tokenTypesList} from './TokenType';
import BlockNode from './AST/BlockNode';
import VariableNode from './AST/VariableNode';
import ExpressionNode from './AST/ExpressionNode';
import Node from './AST/Node';
import BinaryOperationNode from './AST/BinaryOperationNode';
import NumberNode from './AST/NumberNode';
import StringNode from './AST/StringNode';
import BooleanNode from './AST/BooleanNode';
import UnaryOperationNode from './AST/UnaryOperationNode';
import Tools from './Tools';
import {VariableType} from './VariableType';
import IfElseNode from './AST/IfElseNode';
import ConstantNode from './AST/ConstantNode';
import WhileNode from './AST/WhileNode';

export default class Parser {
    readonly tools: Tools
    pos: number = 0

    constructor(tools: Tools) {
        this.tools = tools
    }

    findWithExclusions(...exclusion: TokenType[]): Token | null {
        if (this.pos < this.tools.tokens.length) {
            const currentToken: Token = this.tools.tokens[this.pos]
            if (exclusion.find(type => type.name === currentToken.type.name)) return null
            else {
                this.pos++
                return currentToken
            }
        }
        return null
    }

    match(...expected: TokenType[]): Token | null {
        if (this.pos < this.tools.tokens.length) {
            const currentToken: Token = this.tools.tokens[this.pos]
            if (expected.find(type => type.name === currentToken.type.name)) {
                this.pos++
                return currentToken
            }
        }
        return null
    }

    require(...expected: TokenType[]): Token {
        const token = this.match(...expected)
        if (!token) {
            throw new Error(`На позиции ${this.pos} ожидается ${expected[0].name}`)
        }
        return token
    }

    parseVariableOrValue(): VariableNode | NumberNode | StringNode | BooleanNode {
        let not = this.match(tokenTypesList.not)
        while (not) {
            not = this.match(tokenTypesList.not)
        }
        const number = this.match(tokenTypesList.number)
        const string = this.match(tokenTypesList.string)
        const boolean = this.match(tokenTypesList.true, tokenTypesList.false)
        if (number != null) {
            return new NumberNode(number)
        }
        if (string != null) {
            return new StringNode(string)
        }
        if (boolean != null) {
            return new BooleanNode(boolean)
        }
        const variableName = this.match(tokenTypesList.variableName)
        if (variableName) {
            const variable = this.tools.findVariable(variableName.text)
            if (variable) return variable
            const constant = this.tools.findConstant(variableName.text)
            if (constant) {
                return constant
            } else throw new Error(`Переменная ${variableName.text} не инициализирована`)
        }
        throw new Error(`Ожидается переменная или значение на позиции ${this.pos}`)
    }

    parseOperation(): Node {
        let leftNode = this.parseNot()
        let operator = this.match(
            tokenTypesList.plus,
            tokenTypesList.minus,
            tokenTypesList.multiply,
            tokenTypesList.divide,
            tokenTypesList.equals,
            tokenTypesList.notEquals,
            tokenTypesList.more,
            tokenTypesList.less,
            tokenTypesList.moreEquals,
            tokenTypesList.lessEquals,
            tokenTypesList.and,
            tokenTypesList.or,
        )
        while (operator != null) {
            const rightNode = this.parseNot()
            leftNode = new BinaryOperationNode(leftNode, operator, rightNode)
            operator = this.match(
                tokenTypesList.plus,
                tokenTypesList.minus,
                tokenTypesList.multiply,
                tokenTypesList.divide,
                tokenTypesList.equals,
                tokenTypesList.notEquals,
                tokenTypesList.more,
                tokenTypesList.less,
                tokenTypesList.moreEquals,
                tokenTypesList.lessEquals,
                tokenTypesList.and,
                tokenTypesList.or,
            )
        }
        return leftNode
    }

    parseCompare(): Node {
        let leftNode = this.parseNot()
        let operator = this.match(
            tokenTypesList.equals,
            tokenTypesList.notEquals,
            tokenTypesList.more,
            tokenTypesList.less,
            tokenTypesList.moreEquals,
            tokenTypesList.lessEquals,
        )
        while (operator != null) {
            const rightNode = this.parseNot()
            leftNode = new BinaryOperationNode(leftNode, operator, rightNode)
            operator = this.match(
                tokenTypesList.equals,
                tokenTypesList.notEquals,
                tokenTypesList.more,
                tokenTypesList.less,
                tokenTypesList.moreEquals,
                tokenTypesList.lessEquals,
            )
        }
        return leftNode
    }

    parseLogical(): Node {
        let leftNode = this.parseNot()
        let operator = this.match(
            tokenTypesList.and,
            tokenTypesList.or,
        )
        while (operator != null) {
            const rightNode = this.parseNot()
            leftNode = new BinaryOperationNode(leftNode, operator, rightNode)
            operator = this.match(
                tokenTypesList.and,
                tokenTypesList.or,
            )
        }
        return leftNode
    }

    parseParentheses(): Node {
        if (this.match(tokenTypesList.not) != null) {
            this.pos--
            return this.parseNot()
        } else {
            if (this.match(tokenTypesList.leftParenthese) != null) {
                const operation = this.parseOperation()
                if (operation) {
                    this.require(tokenTypesList.rightParenthese)
                    return operation
                }
                const compare = this.parseCompare()
                if (compare) {
                    this.require(tokenTypesList.rightParenthese)
                    return compare
                }
                const logical = this.parseLogical()
                if (logical) {
                    this.require(tokenTypesList.rightParenthese)
                    return logical
                }
                throw new Error(`Ожидается операция на позиции ${this.pos}`)
            } else return this.parseVariableOrValue()
        }
    }

    parseNot(): Node {
        const not = this.match(tokenTypesList.not)
        const operand = this.parseParentheses()
        if (not) return new UnaryOperationNode(not, operand)
        return operand
    }

    parseExpression(): ExpressionNode | null {
        if (this.match(tokenTypesList.end)) {
            this.pos--
            return null
        }
        const variableName = this.require(tokenTypesList.variableName)
        const variable = this.tools.findVariable(variableName.text)
        if (this.tools.findConstant(variableName.text)) {
            throw new Error(`Ошибка присвоения ${variableName.text} - переменная является константой`)
        }
        if (variable) {
            const assignment = this.require(tokenTypesList.assign)
            const operation = this.parseOperation()
            return new ExpressionNode(variable, assignment, operation)
        }
        throw new Error(`Переменная ${variableName.text} не инициализирована`)
    }

    parseConstants(): void {
        let constantName = this.match(tokenTypesList.variableName, tokenTypesList.let)
        while (constantName?.type == tokenTypesList.variableName) {
            this.require(tokenTypesList.assign)
            let constantValueToken = this.require(tokenTypesList.number, tokenTypesList.true, tokenTypesList.false)
            let constant = new ConstantNode(constantName, constantValueToken)
            this.require(tokenTypesList.semicolon)
            this.tools.constants.push(constant)
            constantName = this.match(tokenTypesList.variableName, tokenTypesList.let)
        }
        if (constantName?.type == tokenTypesList.let) this.pos--
        else throw new Error(`Недопустимый токен на позиции ${this.pos}`)
    }

    parseAllVariables(): void {
        let variableName = this.match(tokenTypesList.variableName, tokenTypesList.begin)
        while (variableName?.type == tokenTypesList.variableName) {
            this.pos--
            const variables: VariableNode[] = this.parseVariables()
            this.require(tokenTypesList.colon)
            const type = this.parseVariablesType()
            this.require(tokenTypesList.semicolon)
            this.tools.setVariablesType(variables, type)
            variableName = this.match(tokenTypesList.variableName, tokenTypesList.begin)
        }
        if (variableName?.type == tokenTypesList.begin) this.pos--
    }

    parseVariables(): VariableNode[] {
        let variables: VariableNode[] = []
        let comma: Token | null = new Token(tokenTypesList.comma, tokenTypesList.comma.name, this.pos)
        while (comma) {
            const variable = new VariableNode(this.require(tokenTypesList.variableName))
            this.tools.variables.push(variable)
            variables.push(variable)
            comma = this.match(tokenTypesList.comma)
        }
        return variables
    }

    parseVariablesType(): VariableType {
        const typeToken = this.require(tokenTypesList.numberToken, tokenTypesList.stringToken, tokenTypesList.booleanToken)
        let type = VariableType.undefined
        switch (typeToken.type) {
            case tokenTypesList.numberToken:
                type = VariableType.number
                break
            case tokenTypesList.stringToken:
                type = VariableType.string
                break
            case tokenTypesList.booleanToken:
                type = VariableType.boolean
                break
        }
        return type
    }

    parseBody(): Node[] {
        let body: Node[] = []
        let semicolon: Token | null = new Token(tokenTypesList.semicolon, tokenTypesList.semicolon.name, this.pos)
        while (semicolon) {
            if (this.match(tokenTypesList.variableName)) {
                this.pos--
                let expression = this.parseExpression()
                if (expression) body.push(expression)
            } else if (this.match(tokenTypesList.if)) {
                body.push(this.parseIfElse())
            } else if (this.match(tokenTypesList.while)) {
                body.push(this.parseWhile())
            } else if (this.match(tokenTypesList.end)) {
                this.pos--
                break
            } else throw new Error(`Недопустимый токен на позиции ${this.pos}`)
            semicolon = this.match(tokenTypesList.semicolon)
            if (!semicolon) break
        }
        return body
    }

    parseDeclaration(): void {
        if (this.match(tokenTypesList.const)) this.parseConstants()
        if (this.match(tokenTypesList.let)) this.parseAllVariables()
    }

    parseIfElse(): IfElseNode {
        this.require(tokenTypesList.leftParenthese)
        const conditions = this.parseOperation()
        this.require(tokenTypesList.rightParenthese)
        const body = this.parseBlock()
        if (this.match(tokenTypesList.else)) {
            const alter = this.parseBlock()
            return new IfElseNode(conditions, body, alter)
        }
        return new IfElseNode(conditions, body)
    }

    parseWhile(): WhileNode {
        this.require(tokenTypesList.leftParenthese)
        const conditions = this.parseOperation()
        this.require(tokenTypesList.rightParenthese)
        const body = this.parseBlock()
        return new WhileNode(conditions, body)
    }

    parseBlock(): BlockNode {
        this.require(tokenTypesList.begin)
        const body = this.parseBody()
        this.require(tokenTypesList.end)
        return new BlockNode(body)
    }

    parseProgram(): BlockNode {
        this.parseDeclaration()
        const main = this.parseBlock()
        if (this.findWithExclusions(tokenTypesList.spacing, tokenTypesList.point)) {
            throw new Error('После end программа должна заканчиваться!')
        }
        return main
    }
}