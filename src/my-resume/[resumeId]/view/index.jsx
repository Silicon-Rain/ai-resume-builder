import Header from '@/components/custom/Header'
import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import ResumePreview from '@/dashboard/resume/components/ResumePreview'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from '../../../../service/GlobalApi'

function ViewResume() {
    const [resumeInfo, setResumeInfo] = useState();
    const { resumeId } = useParams();

    useEffect(() => {
        GetResumeInfo();
    }, [])

    const GetResumeInfo = () => {
        GlobalApi.GetResumeById(resumeId).then(resp => {
            console.log(resp.data.data);
            setResumeInfo(resp.data.data.attributes);
        })
    }
    const HandleDownload = () => {
        window.print();
    }
    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div id='no-print'>
                <Header />
                <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
                    <h2 className='text-center text-2xl font-medium'>Congrats! Your resume is ready.</h2>
                    <div className='flex justify-center my-5'>
                        <Button onClick={HandleDownload}>Download</Button>
                    </div>
                </div>
            </div>
            <div id='print-area' className='printable-area my-10 mx-10 md:mx-20 lg:mx-36'>
                {resumeInfo ? <ResumePreview/> : <p>Loading...</p>}
            </div>
        </ResumeInfoContext.Provider>
    )
}

export default ViewResume