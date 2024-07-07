import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { AIChatSession } from '../../../../../service/AIModel';
import { toast } from 'sonner';

const prompt = 'Job Title: {jobTitle}, depending on the job title give me summary for my resume within 4-5 lines in JSON format with field experience level and summary with experience level for fresher, mid-level, experienced. Do it in the form {"experienceLevel":abc, "summary": xyz}'

function Summary({enabledNext}) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  // const [summary, setSummary] = useState();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [aiGeneratedSummaryList, setAiGeneratedSummaryList] = useState([]);
  const [formData,setFormData]=useState();

  const handleInputChange=(e)=>{
    enabledNext(false);
    const {name,value}=e.target;

    setFormData({
        ...formData,
        [name]:value
    })
    setResumeInfo({
        ...resumeInfo,
        [name]:value
    })
}

  const GenerateSummaryFromAI = async() => {
    setLoading(true);
    const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle)
    const result = await AIChatSession.sendMessage(PROMPT);
    setAiGeneratedSummaryList(JSON.parse('[' + result.response.text() + ']'));
    setLoading(false);
  }

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      data: formData
    }
    GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(resp => {
      console.log(resp);
      enabledNext(true);
      setLoading(false);
      toast("Details Updated")
    }, (error) => {
      setLoading(false);
    })
  }

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-round'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add Summary for your job title</p>

        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label>Add Summary</label>
            <Button variant="outline" onClick={()=>GenerateSummaryFromAI()} size="sm" type="button" className="border-primary text-primary flex gap-2">
            <Brain className='h-4 w-4'/> Generate from AI</Button>
          </div>
          <Textarea name="summary" className="mt-5" required
            onChange={handleInputChange} defaultValue={resumeInfo?.summary}
          />
          <div className="mt-2 flex justify-end">
          <Button type='Submit'
                disabled={loading}>
                {loading? <LoaderCircle className='animate-spin'/>:'Save'}
                </Button>
          </div>
        </form>
      </div>

      {
        aiGeneratedSummaryList&&<div className='mt-3'>
          <h2 className='font-bold text-lg'>Suggestions</h2>
          {
            aiGeneratedSummaryList.map((item,index)=>(
              <div key={index}>
                <h2 className='font-bold my-1'>Level: {item?.experienceLevel}</h2>
                <p>{item?.summary}</p>
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}

export default Summary