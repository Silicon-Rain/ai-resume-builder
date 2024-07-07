import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from '../RichTextEditor'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import GlobalApi from '../../../../../service/GlobalApi';
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const formField = {
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    workSummary: ''
}

function Experience({enabledNext}) {
    const [loading, setLoading] = useState(false);
    const [experienceList, setExperienceList] = useState([{ ...formField }]);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();

    useEffect(() => {
        if (resumeInfo?.experience && experienceList.length === 1 && experienceList[0].title === '') {
            setExperienceList(resumeInfo.experience);
        }
    }, [resumeInfo]);

    const handleChange = (index, event) => {
        enabledNext(false);
        const newEntries = [...experienceList];
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperienceList(newEntries);
    }

    const AddNewExperience = () => {
        setExperienceList([...experienceList, { ...formField }]);
    }

    const RemoveExperience = () => {
        setExperienceList(experienceList => experienceList.slice(0, -1))
    }

    const handleRichTextEditor = (e, name, index) => {
        enabledNext(false);
        const newEntries = [...experienceList];
        newEntries[index][name] = e.target.value;
        setExperienceList(newEntries);
    }

    const onSave = () => {
        setLoading(true);
        const data = {
            data: {
                experience: experienceList.map(({id,...rest})=>rest)
            }
        }
        console.log(experienceList);
        GlobalApi.UpdateResumeDetail(params.resumeId, data).then(resp => {
            enabledNext(true);
            setLoading(false);
            toast('Details updated!')
        }, (error) => {
            setLoading(false);
            toast('Server Error, Please Try Again!')
        });
    }

    useEffect(() => {
        if (experienceList !== resumeInfo.experience) {
            setResumeInfo(prev => ({
                ...prev,
                experience: experienceList
            }));
        }
    }, [experienceList, resumeInfo.experience, setResumeInfo]);

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-round'>
                <h2 className='font-bold text-lg'>Professional Experience</h2>
                <p>Add your previous job experience</p>
                <div>
                    {experienceList.map((item, index) => (
                        <div key={index}>
                            <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                                <div>
                                    <label className='text-xs'>Position Title</label>
                                    <Input name="title" onChange={(event) => handleChange(index, event)} defaultValue={item?.title} />
                                </div>
                                <div>
                                    <label className='text-xs'>Company Name</label>
                                    <Input name="companyName" onChange={(event) => handleChange(index, event)} defaultValue={item?.companyName} />
                                </div>
                                <div>
                                    <label className='text-xs'>City</label>
                                    <Input name="city" onChange={(event) => handleChange(index, event)} defaultValue={item?.city} />
                                </div>
                                <div>
                                    <label className='text-xs'>State</label>
                                    <Input name="state" onChange={(event) => handleChange(index, event)} defaultValue={item?.state} />
                                </div>
                                <div>
                                    <label className='text-xs'>Start Date</label>
                                    <Input name="startDate" type="date" onChange={(event) => handleChange(index, event)} defaultValue={item?.startDate} />
                                </div>
                                <div>
                                    <label className='text-xs'>End Date</label>
                                    <Input name="endDate" type="date" onChange={(event) => handleChange(index, event)} defaultValue={item?.endDate} />
                                </div>
                                <div className='col-span-2'>
                                    <RichTextEditor
                                        index={index}
                                        onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummary', index)}
                                        defaultValue={item?.workSummary}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <Button variant="outline" className="text-primary" onClick={AddNewExperience}> + Add More Experience</Button>
                        <Button variant="outline" className="text-primary" onClick={RemoveExperience}>Remove</Button>
                    </div>
                    <Button disabled={loading} onClick={onSave}>
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Experience
