import React from 'react'
import RegisterForm from './_components/register-form'
import { Link } from '@/i18n/routing'


const Page = () => {
  return <>

    <section className='w-full' >

      <p className="text-[16px] font-[400] ">
        لديك حساب بالفعل؟{' '}
        <Link href="/auth/login" className=" text-normal text-[16px] font-[700] ">
          تسجيل الدخول
        </Link>
      </p>

      <RegisterForm />
    </section>

  </>
}

export default Page