export default class TokenType {
    name: string
    regex: string

    constructor(name: string, regex: string) {
        this.name = name
        this.regex = regex
    }
}

export const tokenTypesList = {
    'let': new TokenType('let', 'let'),
    'const': new TokenType('const', 'const'),
    'begin': new TokenType('begin', 'begin'),
    'end': new TokenType('end', 'end'),
    'if': new TokenType('if', 'if'),
    'while': new TokenType('while', 'while'),
    'else': new TokenType('else', 'else'),
    'booleanToken': new TokenType('booleanToken', 'boolean'),
    'numberToken': new TokenType('numberToken', 'number'),
    'stringToken': new TokenType('stringToken', 'string'),
    'true': new TokenType('true', 'true'),
    'false': new TokenType('false', 'false'),
    'equals': new TokenType('equals', '=='),
    'notEquals': new TokenType('notEquals', '!='),
    'lessEquals': new TokenType('lessEquals', '<='),
    'moreEquals': new TokenType('moreEquals', '>='),
    'less': new TokenType('less', '<'),
    'more': new TokenType('more', '>'),
    'or': new TokenType('or', '\\|\\|'),
    'and': new TokenType('and', '&&'),
    'not': new TokenType('and', '!'),
    'assign': new TokenType('assign', '='),
    'spacing': new TokenType('spacing', '[ \\n\\t\\r]'),
    'semicolon': new TokenType('semicolon', ';'),
    'comma': new TokenType('comma', ','),
    'colon': new TokenType('colon', ':'),
    'point': new TokenType('point', '\\.'),
    'number': new TokenType('number', '[0-9]+'),
    'plus': new TokenType('plus', '\\+'),
    'minus': new TokenType('minus', '-'),
    'multiply': new TokenType('multiply', '\\*'),
    'divide': new TokenType('divide', '\\/'),
    'leftParenthese': new TokenType('leftParenthese', '\\('),
    'rightParenthese': new TokenType('rightParenthese', '\\)'),
    'variableName': new TokenType('variableName', '[a-z]{1,11}'),
    'string': new TokenType('stringToken', '.*'),
}