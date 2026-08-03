import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useDropzone } from 'react-dropzone';
import { obfuscateScript } from './services/api';
import Options from './components/Options';
import Stats from './components/Stats';
import Header from './components/Header';

function App() {
  const [code, setCode] = useState('-- Paste your Lua code here\nprint("Hello, World!")');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [options, setOptions] = useState({
    level: 'medium',
    stringEncryption: true,
    numberEncryption: true,
    renameVariables: true,
    renameFunctions: true,
    removeComments: true,
    junkCode: false,
    controlFlow: false,
    antiDump: false,
    watermark: ''
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target.result);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.lua', '.luau'] }
  });

  const handleObfuscate = async () => {
    setLoading(true);
    try {
      const result = await obfuscateScript(code, options);
      if (result.success) {
        setOutput(result.output);
        setStats(result.stats);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obfuscated.lua';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Options Panel */}
          <div className="lg:col-span-1">
            <Options options={options} setOptions={setOptions} />
            
            <button
              onClick={handleObfuscate}
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Obfuscating...' : '🚀 Obfuscate'}
            </button>
          </div>

          {/* Editor Panel */}
          <div className="lg:col-span-3 space-y-4">
            <div {...getRootProps()} className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-center text-blue-400">Drop your .lua file here...</p>
              ) : (
                <p className="text-center text-gray-400">Drag & drop a .lua file, or paste below</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[500px] border border-gray-700 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="lua"
                  theme="vs-dark"
                  value={code}
                  onChange={setCode}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on'
                  }}
                />
              </div>
              
              <div className="h-[500px] border border-gray-700 rounded-lg overflow-hidden relative">
                <Editor
                  height="100%"
                  defaultLanguage="lua"
                  theme="vs-dark"
                  value={output || '// Obfuscated output will appear here'}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on'
                  }}
                />
                
                {output && (
                  <div className="absolute top-2 right-2 space-x-2">
                    <button
                      onClick={handleCopy}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Copy
                    </button>
                    <button
                      onClick={handleDownload}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Download
                    </button>
                  </div>
                )}
              </div>
            </div>

            {stats && <Stats stats={stats} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
