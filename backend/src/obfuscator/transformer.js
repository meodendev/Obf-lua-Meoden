import crypto from 'crypto';

export class Transformer {
  constructor(options) {
    this.options = options;
    this.variableMap = new Map();
    this.functionMap = new Map();
    this.stringMap = new Map();
    this.globalVars = new Set(['print', 'table', 'string', 'math', 'os', 'io', 'coroutine', 'debug']);
    this.counter = 0;
    
    // Roblox specific globals
    this.robloxGlobals = new Set([
      'game', 'workspace', 'script', 'Instance', 'Color3', 'Vector3',
      'CFrame', 'TweenService', 'RunService', 'Players', 'ReplicatedStorage'
    ]);
  }

  transform(ast) {
    // Generate random names for variables
    this.generateNameMap(ast);
    
    // Apply transformations
    this.visit(ast);
    
    return ast;
  }

  generateNameMap(ast) {
    // Collect all identifiers
    const identifiers = this.collectIdentifiers(ast);
    
    for (const id of identifiers) {
      if (this.shouldRename(id)) {
        const newName = this.generateRandomName();
        if (!this.variableMap.has(id)) {
          this.variableMap.set(id, newName);
        }
      }
    }
  }

  shouldRename(name) {
    // Don't rename globals
    if (this.globalVars.has(name)) return false;
    if (this.robloxGlobals.has(name)) return false;
    if (this.options.preserveGlobals.includes(name)) return false;
    
    // Don't rename Lua keywords
    const keywords = ['if', 'then', 'else', 'elseif', 'while', 'do', 'for', 'in',
                     'break', 'return', 'function', 'local', 'true', 'false', 'nil'];
    if (keywords.includes(name)) return false;
    
    return true;
  }

  generateRandomName() {
    const prefixes = ['_', '__', 'a', 'b', 'c', 'd', 'e', 'f'];
    const suffix = crypto.randomBytes(4).toString('hex');
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffix}`;
  }

  collectIdentifiers(node) {
    const identifiers = [];
    
    const collect = (n) => {
      if (!n) return;
      
      if (n.type === 'Identifier') {
        identifiers.push(n.name);
      }
      
      // Recursively collect
      for (const key in n) {
        if (n[key] && typeof n[key] === 'object') {
          if (Array.isArray(n[key])) {
            n[key].forEach(item => collect(item));
          } else {
            collect(n[key]);
          }
        }
      }
    };
    
    collect(node);
    return identifiers;
  }

  visit(node) {
    if (!node) return;
    
    switch (node.type) {
      case 'Identifier':
        this.visitIdentifier(node);
        break;
      case 'StringLiteral':
        this.visitStringLiteral(node);
        break;
      case 'NumericLiteral':
        this.visitNumericLiteral(node);
        break;
      case 'FunctionDeclaration':
        this.visitFunctionDeclaration(node);
        break;
      case 'AssignmentStatement':
        this.visitAssignmentStatement(node);
        break;
      case 'LocalStatement':
        this.visitLocalStatement(node);
        break;
      // ... other node types
    }
  }

  visitIdentifier(node) {
    if (this.variableMap.has(node.name)) {
      node.name = this.variableMap.get(node.name);
    }
  }

  visitStringLiteral(node) {
    if (this.options.stringEncryption && node.value.length > 2) {
      const encrypted = this.encryptString(node.value);
      node.value = encrypted;
      node.raw = `"${encrypted}"`;
    }
  }

  visitNumericLiteral(node) {
    if (this.options.numberEncryption) {
      node.value = this.encryptNumber(node.value);
    }
  }

  encryptString(value) {
    // Simple XOR encryption with random key
    const key = Math.floor(Math.random() * 255);
    let result = '';
    for (let i = 0; i < value.length; i++) {
      result += String.fromCharCode(value.charCodeAt(i) ^ key);
    }
    return result;
  }

  encryptNumber(value) {
    // Encrypt number using mathematical operations
    const salt = Math.random() * 1000;
    return `(function() return ${value} + ${salt} - ${salt} end)()`;
  }
}
