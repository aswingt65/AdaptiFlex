"use client";

import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { TypedLiveblocksProvider, useRoom } from "@/liveblocks.config";
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import { CodeEditorCursor } from "./codeEditorCursor";

import LanguageSelector from "./langSelector";
import { CODE_SNIPPETS } from "./constants";
import Output from "./output";

export function CodeEditor() {
    const [editorRef, setEditorRef] = useState<editor.IStandaloneCodeEditor>();
    const [provider, setProvider] = useState<TypedLiveblocksProvider>();
    const room = useRoom();

    const [value, setValue] = useState<string>("");
    const [language, setLanguage] = useState<string>("javascript");

    // Set up Liveblocks Yjs provider and attach Monaco editor
    useEffect(() => {
        let yProvider: any;
        let yDoc: Y.Doc;
        let binding: MonacoBinding;

        if (editorRef) {
            yDoc = new Y.Doc();
            const yText = yDoc.getText("monaco");
            yProvider = new LiveblocksProvider(room, yDoc);
            setProvider(yProvider);
            // Attach Yjs to Monaco
            binding = new MonacoBinding(
                yText,
                editorRef.getModel() as editor.ITextModel,
                new Set([editorRef]),
                yProvider.awareness as Awareness
            );
        }

        return () => {
            yDoc?.destroy();
            yProvider?.destroy();
            binding?.destroy();
        };
    }, [editorRef, room]);

    const handleOnMount = useCallback((e: editor.IStandaloneCodeEditor) => {
        setEditorRef(e);
    }, []);

    const onSelect = (language: string) => {
        setLanguage(language);
        setValue(CODE_SNIPPETS[language]);
    };

    return (
        <div className="bg-[#1E1E1E] pt-[4rem] overflow-hidden ">
            {provider ? <CodeEditorCursor yProvider={provider} /> : null}
            <div className="flex overflow-hidden">
                <div>
                    <LanguageSelector language={language} onSelect={onSelect} />
                    <Editor
                        onMount={handleOnMount}
                        height="100vh"
                        width="100vw"
                        theme="vs-dark"
                        language={language}
                        defaultValue={CODE_SNIPPETS[language]}
                        options={{
                            tabSize: 4,
                        }}
                        value={value}
                        onChange={(value) => setValue(value ?? "")}
                    />
                </div>
                {/* <div className="bg-red-200 w-full">
                    <Output editorRef={editorRef} language={language} />
                </div> */}
            </div>
        </div>
    );
}