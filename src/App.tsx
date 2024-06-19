import React, { useState } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java'; 

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  const [output, setOutput] = useState<string>('');
  const [outputlist, setOutputlist] = useState<string[]>([]);

  const handleRun = async () => {
    try {
      const response = await axios.post('http://192.168.178.59:5001/run', { code, language });
      const now = new Date();
      setOutput(response.data.output || response.data.error);
      const outputWithTime = `${now}\n${response.data.output || response.data.error}`;
      setOutputlist([...outputlist,outputWithTime]);
    } catch (error) {
      setOutput('Error: ' + (error as Error).message);
    }
  };

  const getExtensions = () => {
    switch (language) {
      case 'python':
        return [python()];
      case 'javascript':
        return [javascript()];
      case 'typescript':
        return [javascript({ typescript: true })];
      case 'java':
        return [java()];
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <div className='flex justify-items-start'>
        <div className='flex flex-row items-center m-4 mr-auto'>
          <h1 className='mr-2'>Language:</h1>
          <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
            </select>
        </div>

          <button
            onClick={handleRun}
            className="px-10 py-2  text-white bg-green-500 rounded-md hover:bg-green-600 m-4 mr-auto flex items-center"
            >
            Run
          </button>
      </div>
      <div className='flex flex-col md:flex-row'>
        <CodeMirror
            value={code}
            height="400px"
            extensions={getExtensions()}
            theme={oneDark}
            onChange={(value) => setCode(value)}
            className="border border-gray-300 rounded-md font-mono text-lg w-full"
          />
          <div className="w-full overflow-y-auto bg-white border border-gray-300 rounded-md m-2 p-2 md:p-0 md:m-0" style={{ height: 'calc(72vh - 200px)' }}>
            <h2>Output:</h2>
            <pre className="font-mono text-lg whitespace-pre-wrap">{output}</pre>
          </div>
      </div>
      <h2 className='ml-2 mt-2'>History:</h2>
      <div className="overflow-y-auto mt-4" style={{ height: 'calc(100vh - 200px)' }}>
      <ul>
        {outputlist.slice().reverse().map((val, index) => 
          <li key={index} className="border border-gray-400 rounded-md my-2 p-2 m-2">
            <pre className="font-mono text-lg whitespace-pre-wrap">{val}</pre>
          </li>
        )}
      </ul>
      </div>
    </div>
  );
};

export default App;