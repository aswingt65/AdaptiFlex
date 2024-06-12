'use client';

import { useState } from "react";
import { executeCode } from "./api";
import { toast } from "sonner";

interface OutputProps {
    editorRef: any;
    language: string;
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
    const [output, setOutput] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const runCode = async () => {
        const sourceCode = editorRef;
        if (!sourceCode) return;
        try {
            setIsLoading(true);
            const { run: result } = await executeCode(language, sourceCode);
            setOutput(result.output.split("\n"));
            result.stderr ? setIsError(true) : setIsError(false);
            toast.success("Code executed successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to run code");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-[50%] h-fit">
            <button onClick={runCode}>Run Code</button>
            <div className="h-fit rounded-md border-2 border-gray-300 p-2">
                {output ? (
                    output.map((line, i) => <p key={i}>{line}</p>)
                ) : (
                    <p>Click "Run Code" to see the output here</p>
                )}
            </div>
        </div>
    );
};

export default Output;
