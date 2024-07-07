import { Loader2Icon, MoreVertical, Notebook } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import GlobalApi from '../../../service/GlobalApi'
import { toast } from 'sonner'



function ResumeCardItem({ resume, refreshData }) {
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const onDelete = () => {
    setLoading(true);
    GlobalApi.DeleteResumeById(resume.id).then(resp=>{
      console.log(resp);
      toast('Resume Deleted!');
      refreshData();
      setLoading(false);
      setOpenAlert(false);
    },(errot)=>{
      setLoading(false);
    })
  }
  return (
    <div>
      <Link to={`/dashboard/resume/${resume.id}/edit`}>
        <div className='p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200
        flex
        items-center justify-center h-[280px]
        rounded-lg border-t-4
        hover:scale-105 transition-all
        hover:shadow-md shadow-primary'
          style={{
            borderBlockColor: resume?.themeColor
          }}
        >
          {/* <Notebook/> */}
          <img src='/cv.png' width={150} height={150} />
        </div>


      </Link>
      <h2 className='text-center my-1'>{resume.attributes.title}</h2>
      <div className='flex justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className='h-5 w-5 cursor-pointer rounded-full hover:bg-gray-300 transition duration-200' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link to={`/dashboard/resume/${resume.id}/edit`}><DropdownMenuItem>Edit</DropdownMenuItem></Link>

            <Link to={`/my-resume/${resume.id}/view`}><DropdownMenuItem>View</DropdownMenuItem></Link>

            <Link to={`/my-resume/${resume.id}/view`}><DropdownMenuItem>Download</DropdownMenuItem></Link>

            <DropdownMenuItem onClick={() => { setOpenAlert(true) }}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your resume from your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => { setOpenAlert(false) }}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading}>
              {loading? <Loader2Icon className='animate-spin'/>:'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default ResumeCardItem