import Lexer from './Lexer';
import Parser from './Parser';
import path from 'path';
import * as fs from 'fs';
import Executor from './Executor';
import Tools from './Tools';

fs.readFile(path.resolve(__dirname, '..', 'public', 'program.txt'), 'utf8', (error, program) => {
    if (error) {
        console.error(error)
        return
    }
    try {
        const tools = Tools.getInstance()

        const lexer = new Lexer(tools, program)
        lexer.lexAnalysis()

        const parser = new Parser(tools)
        const mainNode = parser.parseProgram()

        const executor = new Executor(tools)
        // console.log(mainNode)
        executor.run(mainNode)
        console.log(tools.variables)
    } catch (e) {
        console.error(e)
    }
})