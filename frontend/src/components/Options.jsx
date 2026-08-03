import React from 'react';

const Options = ({ options, setOptions }) => {
  const levels = ['low', 'medium', 'high', 'extreme'];

  const handleChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Obfuscation Options</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Level</label>
        <select
          value={options.level}
          onChange={(e) => handleChange('level', e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2"
        >
          {levels.map(level => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.stringEncryption}
            onChange={() => toggleOption('stringEncryption')}
            className="mr-2"
          />
          Encrypt Strings
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.numberEncryption}
            onChange={() => toggleOption('numberEncryption')}
            className="mr-2"
          />
          Encrypt Numbers
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.renameVariables}
            onChange={() => toggleOption('renameVariables')}
            className="mr-2"
          />
          Rename Variables
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.renameFunctions}
            onChange={() => toggleOption('renameFunctions')}
            className="mr-2"
          />
          Rename Functions
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.removeComments}
            onChange={() => toggleOption('removeComments')}
            className="mr-2"
          />
          Remove Comments
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.junkCode}
            onChange={() => toggleOption('junkCode')}
            className="mr-2"
          />
          Insert Junk Code
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.controlFlow}
            onChange={() => toggleOption('controlFlow')}
            className="mr-2"
          />
          Control Flow Flattening
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={options.antiDump}
            onChange={() => toggleOption('antiDump')}
            className="mr-2"
          />
          Anti-Dump Protection
        </label>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Watermark</label>
        <input
          type="text"
          value={options.watermark}
          onChange={(e) => handleChange('watermark', e.target.value)}
          placeholder="Enter watermark"
          className="w-full bg-gray-700 text-white rounded px-3 py-2"
        />
      </div>
    </div>
  );
};

export default Options;
