import React, { useContext, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Rating } from '@smastrom/react-rating'
import GlobalApi from '../../../../../service/GlobalApi';
import '@smastrom/react-rating/style.css'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const formField = {
    name: '',
    rating: 0
};

function Skills({enabledNext}) {
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [skillsList, setSkillsList] = useState([{ ...formField }]);
    const params = useParams();

    useEffect(() => {
        if (resumeInfo?.skills && skillsList.length === 1 && skillsList[0].name === '') {
            setSkillsList(resumeInfo.skills);
        }
    }, [resumeInfo]);

    const handleChange = (index, name, value) => {
        enabledNext(false);
        const newEntries = [...skillsList];
        newEntries[index][name] = value;
        setSkillsList(newEntries);
    }

    const AddNewSkill = () => {
        setSkillsList([...skillsList, { ...formField }]);
    }

    const RemoveSkill = () => {
        setSkillsList(skillsList => skillsList.slice(0, -1));
    }

    const onSave = () => {
        setLoading(true);
        const data = {
            data: {
                skills: skillsList.map(({ id, ...rest }) => rest)
            }
        }
        GlobalApi.UpdateResumeDetail(params.resumeId, data).then(resp => {
            enabledNext(true);
            setLoading(false);
            toast('Details updated!');
        }, (error) => {
            setLoading(false);
            toast('Server Error, Please Try Again!');
        });
    }

    useEffect(() => {
        if (skillsList !== resumeInfo.skills) {
            setResumeInfo(prev => ({
                ...prev,
                skills: skillsList
            }));
        }
    }, [skillsList, resumeInfo.skills, setResumeInfo]);

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-round'>
            <h2 className='font-bold text-lg'>Skills</h2>
            <p>Add your top skills</p>

            <div>
                {skillsList.map((item, index) => (
                    <div key={index} className='flex justify-between border rounded-lg p-3 mb-2'>
                        <div>
                            <label className='text-xs'>Name</label>
                            <Input className="w-full" onChange={(e) => handleChange(index, 'name', e.target.value)} defaultValue={item?.name} />
                        </div>
                        <Rating style={{ maxWidth: 120 }} value={item.rating} onChange={(v) => handleChange(index, 'rating', v)} />
                    </div>
                ))}
            </div>
            <div className='flex justify-between'>
                <div className='flex gap-2'>
                    <Button variant="outline" className="text-primary" onClick={AddNewSkill}> + Add More Skills</Button>
                    <Button variant="outline" className="text-primary" onClick={RemoveSkill}>Remove</Button>
                </div>
                <Button disabled={loading} onClick={onSave}>
                    {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                </Button>
            </div>
        </div>
    )
}

export default Skills
