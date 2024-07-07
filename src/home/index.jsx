import Header from '@/components/custom/Header'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Link } from 'react-router-dom'

export const Home = () => {
  const {user, isSignedIn} = useUser();
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: '75vh'
  }
  const handleLinkClick = (event) => {
    event.preventDefault();
    window.open(event.currentTarget.href, '_blank', 'noopener,noreferrer');
  };
  return (
    <div style={{ backgroundImage: `url("/background.jpg")` }}>
      <Header />
      <div className='flex-col' style={style}>
        <div className='text-white text-6xl'>Build your resume <span className='font-bold'>with AI</span></div>
        <div className='text-fuchsia-300 text-xl'>Effortlessly craft a standout resume with our AI-Powered builder</div>
        <Link to={isSignedIn?'/dashboard':'/auth/sign-in'}><Button>Get Started</Button></Link>
      </div>
      <div className=' bg-black text-white p-4'>
        <div className='my-2 flex justify-center'>
          <span>Created By:</span>
          <span style={{ color: 'gray', paddingLeft: '5px' }}>Abheshek Kumar Singh</span>
        </div>
        <div className='flex justify-evenly'>
          <Link to= 'https://github.com/Silicon-Rain' onClick={handleLinkClick}>
            <span style={{ width: '33%', alignItems: 'center' }} className='flex justify-center'>
              <img src='/github.png' className='h-10 w-10 bg-white rounded-full' />
              <span className='px-2'>Github</span>
            </span>
          </Link>
          <Link to='https://www.linkedin.com/in/abheshek-kumar-singh-a3691923a/' onClick={handleLinkClick}>
            <span style={{ width: '33%', alignItems: 'center' }} className='flex justify-center'>
              <img src='/linkedin.png' className='h-10 w-10 bg-white rounded-full' />
              <span className='px-2'>LinkedIn</span>
            </span>
          </Link>
          <Link to='https://x.com/snoop_mercenary?t=dyGKgRZ2G1AaLOMyDpeI5g&s=08' onClick={handleLinkClick}>
            <span style={{ width: '33%', alignItems: 'center' }} className='flex justify-center'>
              <img src='/twitter.png' className='h-10 w-10 bg-white rounded-full' />
              <span className='px-2'>Twitter</span>
            </span>
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Home