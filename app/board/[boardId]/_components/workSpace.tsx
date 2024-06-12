"use client";

import { useEffect, useState, useCallback } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView, lightDefaultTheme, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import * as Y from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { useRoom, useSelf } from "@/liveblocks.config";

import { Info } from "./info";
import { Participants } from "./participants";
import { connectionIdToColor } from "@/lib/utils";
import { WhiteBoard } from "./whiteBoard";
import { CodeEditor } from "./CodeEditor/codeEditor";
import { Hint } from '@/components/hint';
import { jsPDF } from "jspdf";

import { Presentation, FileText, Columns2, FileDown, Code2 } from 'lucide-react';

interface WorkSpaceProps {
    doc: Y.Doc,
    provider: any;
    boardId: string;
};

const TabSeparator = () => {
    return (
        <div className="text-neutral-300">
            |
        </div>
    );
};

export default function WorkSpace({ boardId }: WorkSpaceProps) {
    const room = useRoom();
    const [mode, setMode] = useState('both');
    const [doc, setDoc] = useState<Y.Doc>();
    const [provider, setProvider] = useState<any>();

    const handleWhiteboardClick = useCallback(() => {
        setMode('whiteboard');
    }, []);
    const handleEditorClick = useCallback(() => {
        setMode('editor');
    }, []);
    const handleBothClick = useCallback(() => {
        setMode('both');
    }, []);
    const handleCodeEditorClick = useCallback(() => {
        setMode('CodeEditor');
    }, []);

    // Set up Liveblocks Yjs provider
    useEffect(() => {
        const yDoc = new Y.Doc();
        const yProvider = new LiveblocksProvider(room, yDoc);
        setDoc(yDoc);
        setProvider(yProvider);

        return () => {
            yDoc?.destroy();
            yProvider?.destroy();
        };
    }, [room]);

    if (!doc || !provider) {
        return null;
    }

    return (
        <div className="h-full w-full flex justify-center">
            <Participants />

            <div className='absolute z-50 flex gap-4 top-[2%] bg-white p-2 rounded shadow-md'>
                <Hint label='WhiteBoard' side="bottom" sideOffset={15}>
                    <button onClick={handleWhiteboardClick}><Presentation /></button>
                </Hint>
                <TabSeparator />
                <Hint label='Both' side="bottom" sideOffset={15}>
                    <button onClick={handleBothClick}><Columns2 /></button>
                </Hint>
                <TabSeparator />
                <Hint label='Text-Editor' side="bottom" sideOffset={15}>
                    <button onClick={handleEditorClick}><FileText /></button>
                </Hint>
                <TabSeparator />
                <Hint label='Editor' side="bottom" sideOffset={15}>
                    <button onClick={handleCodeEditorClick}><Code2 /></button>
                </Hint>
            </div>

            <div className="w-full">
                {mode === 'whiteboard' && <WhiteBoard boardId={boardId} />}
                {mode === 'editor' && <>
                    <Info boardId={boardId} />
                    <BlockNote boardId={boardId} doc={doc} provider={provider} />
                </>}
                {mode === 'CodeEditor' && <>
                    <Info boardId={boardId} />
                    <CodeEditor />
                </>}
                {mode === 'both' && (
                    <div className="flex">
                        <div className="w-1/2">
                            <WhiteBoard boardId={boardId} />
                        </div>
                        <div className="w-1/2">
                            <BlockNote boardId={boardId} doc={doc} provider={provider} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);

    const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: body,
    });
    return (await ret.json()).data.url.replace(
        "tmpfiles.org/",
        "tmpfiles.org/dl/"
    );
}

function BlockNote({ doc, provider }: WorkSpaceProps) {

    const currentUser = useSelf();
    const editor: BlockNoteEditor = useCreateBlockNote({
        collaboration: {
            provider,

            // Where to store BlockNote data in the Y.Doc:
            fragment: doc.getXmlFragment("document-store"),

            // Information for this user:
            user: {
                name: currentUser?.info?.name || "Anonymous",
                color: connectionIdToColor(currentUser?.connectionId),
            },
        },
        uploadFile,
    });

    const handleDownloadPDF = useCallback(async () => {

        const htmlData = await editor.blocksToHTMLLossy(editor.document);

        // Create a new jsPDF instance
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'letter',
            putOnlyUsedFonts: true,
            precision: 16
        });

        pdf.html(htmlData, {
            callback: (pdf) => {
                pdf.save("document.pdf");
            },
            x: 12,
            y: 12,
            html2canvas: {
                allowTaint: true,
                useCORS: true,
                logging: true,
                canvas: htmlData,
            },
        });

    }, [editor]);

    return (
        <>
            <BlockNoteView
                className="pt-[4rem] w-full h-screen overflow-scroll"
                theme={lightDefaultTheme}
                editor={editor}
            />;
            <Hint label='Download PDF' side="bottom" sideOffset={10}>
                <button
                    className="absolute bottom-4 right-[1%] p-2 rounded-md shadow-md"
                    onClick={handleDownloadPDF}
                >
                    <FileDown />
                </button>
            </Hint>
        </>
    )
}
