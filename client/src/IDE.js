import React, { useState, useRef } from 'react';
import './IDE.css'; 

const IDE = () => {
  const [code, setCode] = useState('');
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    textareaRef.current.scrollTop = scrollPercentage * (textareaRef.current.scrollHeight - textareaRef.current.clientHeight);
  };
  
  const runCode = () => {
    // SOME CODE EXECUTION LOGIC
    console.log('Running code:', code);
  };
  
  const generateLineNumbers = () => {
    const codeLines = code.split('\n');
    return codeLines.map((_, index) => (
      <div className="line-number" key={index + 1}>
        {index + 1}
      </div>
    ));
  };
  
  return (
    <div className="ide">
      <button onClick={runCode}>Run</button>
      <div className="code-container">
        <div className="line-numbers" onScroll={handleScroll} ref={lineNumbersRef}>
          {generateLineNumbers()}
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={code}
          onChange={handleCodeChange}
          placeholder="Write your code here..."
          rows={10}
          cols={50}
          onScroll={handleScroll}
        />
      </div>
    </div>
  );
};

export default IDE;
