import React, { useState } from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

import './IDE.css';

const IDE = ({onSuccess}) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(''); // To store the output
  const [error, setError] = useState(''); // To store any errors

  const runCode = async () => {
    // Send the code to the Flask server
    try {
      const response = await axios.post('http://127.0.0.1:50012/run_code', {
        code: code
      });
      console.log(response.data); // Log the response to see what you're getting fr
      setOutput(response.data.output); // Set the output in state
      setError(''); // Clear any previous errors
    
      if (response.data.success){ // if the code runs successfully
        console.log('Code ran successfully, increasing score.'); // This should 
        onSuccess(); // increse the score
      };
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred, check your code'); // Set error message
      setOutput(''); // Clear any previous output
    }
  };

  return (
    <div className="ide">
      <div className="run-container">
        <button onClick={runCode}>Run</button>
      </div>
      <div className="code-container">
        <AceEditor
          mode="python"
          theme="github"
          name="UNIQUE_ID_OF_DIV"
          onChange={setCode}
          value={code}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            showLineNumbers: true,
            tabSize: 2,
          }}
          width="100%"
          height="350px"
        />
      </div>
      {error && <div className="output error">{error}</div>}
      {output && <div className="output">{output}</div>}
    </div>
  );
};

export default IDE;
