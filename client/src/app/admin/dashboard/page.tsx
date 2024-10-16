"use client"
import { Button } from '@nextui-org/react'
import React from 'react'
import { Toaster } from 'react-hot-toast';
import { Helper } from '@/lib/utils/HelperClient';
const page = () => {
  const helper = new Helper();
  const notify = () => helper.showSuccessMessage("DONE")
  return (
    <div>
      <Button onClick={notify}>Make me a toast</Button>
      <Toaster  />
    </div>
  )
}

export default page