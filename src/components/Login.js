
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';


export const Login = (props) => {

const [user, setUser]= useState({
    name:"",
    password:""
})

    const handleFunction = (e)=> {
        let _user = { ...user };

        _user[e.target.name] = e.target.value;

        setUser(_user)
    }

    const handleSubmit = () => {
        props.onSubmit(user);
    }

    return (

        <div className='flex justify-content-center align-items-center h-screen'>
            <div className='card py-8 px-8' style={{width: "600px"}}>
                <h1 className='mb-5 text-center font-bold text-blue-600'>Login Form</h1>
               <div className='p-fluid mb-5'>
               <span className="p-float-label">
                    <InputText id="in" value={user.name} name='name' onChange={(e) => handleFunction(e)} />
                    <label htmlFor="in">Username</label>
                </span>
               </div>
               <div className='p-fluid'>
                <span className="p-float-label">
                <Password value={user.password} name='password' onChange={(e) => handleFunction(e)} toggleMask />
                </span>
                </div>
                <Button onClick={handleSubmit} className='mt-4 w-full' label='Submit'></Button>
            </div>
        </div>


    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Login, comparisonFn);
