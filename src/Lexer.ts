import Token from './Token';
import {tokenTypesList} from './TokenType';
import Tools from './Tools';

export default class Lexer {
    readonly tools: Tools
    code: string
    pos: number = 0

    constructor(tools: Tools, code: string) {
        this.tools = tools
        this.code = code
    }

    lexAnalysis(): void {
        while (this.nextToken()) {
        }
        this.tools.tokens = this.tools.tokens.filter(token => token.type.name !== tokenTypesList.spacing.name)
    }

    nextToken(): boolean {
        if (this.pos >= this.code.length) return false
        const tokenTypesListValues = Object.values(tokenTypesList)
        for (let i = 0; i < tokenTypesListValues.length; i++) {
            const tokenType = tokenTypesListValues[i]
            const regex = new RegExp('^' + tokenType.regex)
            const result = this.code.substring(this.pos).match(regex)
            if (result && result[0]) {
                const token = new Token(tokenType, result[0], this.pos)
                this.pos += result[0].length
                this.tools.tokens.push(token)
                return true
            }
        }
        throw new Error(`На позиции ${this.pos} обнаружена ошибка`)
    }
}