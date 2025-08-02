import React from 'react'
import UserDetailForm from '~/components/Users/user-detail-form'


export function meta(){
  return [
    {title: "Detalle del usuario"}
  ]
}
export default function detail() {
  return (
    <UserDetailForm />
  )
}
