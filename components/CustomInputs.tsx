import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from "@/components/ui/input"
import { Control, FieldPath, Form } from 'react-hook-form'
import { z } from 'zod'
import { authformSchema } from '@/lib/utils'

interface CustomInputs {
    control: Control<z.infer<typeof authformSchema>>,
    name: FieldPath<z.infer<typeof authformSchema>>,
    label: string,
    placeholder: string
}

const CustomInputs = ({ control, name, label, placeholder }: CustomInputs) => {
  return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <div className='form-item'>
                        <FormLabel className='form-label'>
                            {label}
                        </FormLabel>
                    <div className=' flex w-full flex-col'>
                        <FormControl>
                            <Input 
                                placeholder={placeholder}
                                className='input-class'
                                type={name === 'password' ? 'password' : 'text'}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage className='form-message mt-2' />
                    </div>
                  </div>
                )}
            />
  )
}

export default CustomInputs