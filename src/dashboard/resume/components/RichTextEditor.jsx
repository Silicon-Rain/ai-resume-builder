import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState, useEffect } from 'react';
import {
    BtnBold,
    BtnBulletList,
    BtnClearFormatting,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnRedo,
    BtnStrikeThrough,
    BtnStyles,
    BtnUnderline,
    BtnUndo,
    Editor,
    EditorProvider,
    HtmlButton,
    Separator,
    Toolbar,
} from 'react-simple-wysiwyg';
import { AIChatSession } from '../../../../service/AIModel';
import { toast } from 'sonner';

const PROMPT = '{positionTitle}, depending on position title give me 3-4 bullet points for my experience in resume, give me result in the form {[exp1, exp2, exp3]}. No need for any categorty(fresher, intermediate, expert). Just give me a single list.';

function RichTextEditor({ index, onRichTextEditorChange, defaultValue }) {
    const [value, setValue] = useState(defaultValue);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    const GenerateSummaryFromAI = async () => {
        setLoading(true);
        if (!resumeInfo.experience[index].title) {
            toast('Please Add Position Title');
            setLoading(false);
            return;
        }
        const prompt = PROMPT.replace('{positionTitle}', resumeInfo.experience[index].title);
        const result = await AIChatSession.sendMessage(prompt);
        const resp = await result.response.text();
        setValue(resp.replace('[', '').replace(']', '').replace(/",/g, '<br>').replace(/"/g, ''));
        setLoading(false);
    };

    return (
        <div>
            <div className='flex justify-between my-2'>
                <label className='text-xs'>Summary<br/><label className='text-xs text-primary font-bold'>(if you are using AI, please hit a space bar for the summary to render in your resume)</label></label>
                
                <Button variant="outline" size="sm" onClick={GenerateSummaryFromAI}
                    className="flex gap-2 border-primary text-primary">
                    {
                        loading ?
                            <LoaderCircle className='animate-spin' /> :
                            <>
                                <Brain className='h-4 w-4' /> Generate from AI
                            </>
                    }
                </Button>
            </div>
            <EditorProvider>
                <Editor value={value} onChange={(e) => {
                    setValue(e.target.value);
                    onRichTextEditorChange(e);
                }}>
                    <Toolbar>
                        <BtnUndo />
                        <BtnRedo />
                        <Separator />
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
}

export default RichTextEditor;
