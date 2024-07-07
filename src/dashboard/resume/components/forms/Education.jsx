import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

const formField = {
    universityName: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: '',
    description: ''
}

function Education({enabledNext}) {
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();
    const [educationList, setEducationList] = useState([{ ...formField }]);

    useEffect(() => {
        if (resumeInfo?.education && educationList.length === 1 && educationList[0].universityName === '') {
            setEducationList(resumeInfo.education);
        }
    }, [resumeInfo]);

    const handleChange = (event, index) => {
        enabledNext(false);
        const newEntries = [...educationList];
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setEducationList(newEntries);
    }

    const AddNewEducation = () => {
        setEducationList([...educationList, { ...formField }]);
    }

    const RemoveEducation = () => {
        setEducationList(educationList => educationList.slice(0, -1));
    }

    const onSave = () => {
        setLoading(true);
        const data = {
            data: {
                education: educationList.map(({ id, ...rest }) => rest)
            }
        }
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
        if (educationList !== resumeInfo.education) {
            setResumeInfo(prev => ({
                ...prev,
                education: educationList
            }));
        }
    }, [educationList, resumeInfo.education, setResumeInfo]);

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-round'>
                <h2 className='font-bold text-lg'>Education</h2>
                <p>Add your educational details</p>
                <div>
                    {educationList.map((item, index) => (
                        <div key={index}>
                            <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                                <div>
                                    <label className='text-xs'>University Name</label>
                                    <Input name="universityName" onChange={(e) => handleChange(e, index)} defaultValue={item?.universityName} />
                                </div>
                                <div>
                                    <label className='text-xs'>Degree</label>
                                    <Input name="degree" onChange={(e) => handleChange(e, index)} defaultValue={item?.degree} />
                                </div>
                                <div>
                                    <label className='text-xs'>Major</label>
                                    <Input name="major" onChange={(e) => handleChange(e, index)} defaultValue={item?.major} />
                                </div>
                                <div>
                                    <label className='text-xs'>Start Date</label>
                                    <Input name="startDate" type="date" onChange={(e) => handleChange(e, index)} defaultValue={item?.startDate} />
                                </div>
                                <div>
                                    <label className='text-xs'>End Date</label>
                                    <Input name="endDate" type="date" onChange={(e) => handleChange(e, index)} defaultValue={item?.endDate} />
                                </div>
                                <div>
                                    <label className='text-xs'>Description</label>
                                    <Textarea name="description" onChange={(e) => handleChange(e, index)} defaultValue={item?.description} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <Button variant="outline" className="text-primary" onClick={AddNewEducation}> + Add More Education</Button>
                        <Button variant="outline" className="text-primary" onClick={RemoveEducation}>Remove</Button>
                    </div>
                    <Button disabled={loading} onClick={onSave}>
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Education
