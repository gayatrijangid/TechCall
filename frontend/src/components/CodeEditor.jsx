import React from "react";
import Editor from "@monaco-editor/react";
import styles from "../styles/videoComponent.module.css";
const CodeEditor = ({
    code,
    setCode,
    socketRef,
    runCode,
    output 
}) => {

    return (

        <div className={styles.editorContainer}>

            <Editor
                height="400px"
                language="javascript"
                theme="vs-dark"
                value={code}

                onChange={(value) => {

                    setCode(value);

                    socketRef.current.emit(
                        "code-change",
                        value
                    );

                }}
            />

            <button
               className={styles.runBtn}
                onClick={runCode}
            >
                Run Code
            </button>
<div className={styles.outputBox}>
    <pre>{output}</pre>
</div>
        </div>

    );

};

export default React.memo(CodeEditor);