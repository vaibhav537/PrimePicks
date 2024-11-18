"use client"
import { Button } from '@nextui-org/react'
import React from 'react'
import { Helper } from '@/lib/utils/HelperClient';
import SLoader from '@/components/SLoader';
const page = () => {
  const helper = new Helper();
  const notify = () => helper.showSuccessMessage("DONE")
  return (
    <div>
      <Button onClick={notify}>Make me a toast</Button>
      <SLoader text='RUNNING'/>
    </div>
  )
}

export default page