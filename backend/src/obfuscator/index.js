import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Transformer } from './transformer.js';
import { Generator } from './generator.js';
import { VMObfuscator } from './vm-obfuscator.js';

export class Obfuscator {
  constructor(options = {}) {
    this.options = {
      level: 'medium', // low, medium, high, extreme
      stringEncryption: true,
      numberEncryption: true,
      renameVariables: true,
      renameFunctions: true,
      removeComments: true,
      removeWhitespace: false,
      junkCode: false,
      deadCode: false,
      controlFlow: false,
      antiDump: false,
      antiDebug: false,
      vmObfuscation: false,
      watermark: '',
      randomSeed: Date.now(),
      preserveGlobals: [],
      ...options
    };
    
    this.lexer = new Lexer();
    this.parser = new Parser();
    this.transformer = new Transformer(this.options);
    this.generator = new Generator();
    this.vmObfuscator = new VMObfuscator();
  }

  obfuscate(code) {
    try {
      // 1. Lexical Analysis
      const tokens = this.lexer.tokenize(code);
      
      // 2. Parse to AST
      let ast = this.parser.parse(code);
      
      // 3. Transform AST
      ast = this.transformer.transform(ast);
      
      // 4. Apply VM obfuscation if extreme
      if (this.options.level === 'extreme' || this.options.vmObfuscation) {
        ast = this.vmObfuscator.obfuscate(ast);
      }
      
      // 5. Generate code
      let output = this.generator.generate(ast);
      
      // 6. Post-processing
      if (this.options.removeWhitespace) {
        output = output.replace(/\s+/g, ' ').trim();
      }
      
      // 7. Add watermark
      if (this.options.watermark) {
        output = `-- ${this.options.watermark}\n${output}`;
      }
      
      return {
        success: true,
        output,
        stats: {
          originalLines: code.split('\n').length,
          originalSize: code.length,
          obfuscatedLines: output.split('\n').length,
          obfuscatedSize: output.length,
          compressionRatio: ((1 - output.length / code.length) * 100).toFixed(2)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
