
import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Axios from 'axios';


export const Login = (props) => {

    const [login, setLogin] = useState({
        name: "",
        password: ""
    })

    const [register, setRegister] = useState({
        name: "",
        password: ""
    })

    const [isregister, setIsRegister] = useState(false)

    const handleLoginFunction = (e) => {

        let _user = { ...login };

        _user[e.target.name] = e.target.value;

        setLogin(_user)
    }

    const handleRegisterFunction = (e) => {
        let _user = { ...register };

        _user[e.target.name] = e.target.value;

        setRegister(_user)
    }

    const handleLogin = async () => {
        const value = await Axios.post('http://localhost:5000/api/login', login);
        console.log(value)
        // props.onSubmit(login);
    }

    const handleRegister = async () => {
        const value = await Axios.post('http://localhost:5000/api/register', register);
        setIsRegister(false)
        // props.onSubmit(register);
    }

    return (

        <div className='flex justify-content-center align-items-center h-screen'>
            {!isregister ? <div className='card py-8 px-8' style={{ width: "600px" }}>
                <h1 className='mb-5 text-center font-bold text-blue-600'>Login Form</h1>
                <div className='p-fluid mb-5'>
                    <span className="p-float-label">
                        <InputText id="in" value={login.name} name='name' onChange={(e) => handleLoginFunction(e)} />
                        <label htmlFor="in">Username</label>
                    </span>
                </div>
                <div className='p-fluid'>
                    <span className="p-float-label">
                        <Password value={login.password} name='password' onChange={(e) => handleLoginFunction(e)} toggleMask />
                    </span>
                </div>
                <Button onClick={handleLogin} className='my-4 w-full' label='Submit'></Button>
                <Button onClick={() => { setIsRegister(true) }} label="Register Here" className="p-button-secondary my-2" />
            </div>
                :
                <div className='card py-8 px-8' style={{ width: "600px" }}>
                    <h1 className='mb-5 text-center font-bold text-blue-600'>Register Form</h1>
                    <div className='p-fluid mb-5'>
                        <span className="p-float-label">
                            <InputText id="in" value={register.name} name='name' onChange={(e) => handleRegisterFunction(e)} />
                            <label htmlFor="in">Username</label>
                        </span>
                    </div>
                    <div className='p-fluid'>
                        <span className="p-float-label">
                            <Password value={register.password} name='password' onChange={(e) => handleRegisterFunction(e)} toggleMask />
                        </span>
                    </div>
                    <Button onClick={handleRegister} className='mt-4 w-full' label='Submit'></Button>
                </div>}

        </div>


    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Login, comparisonFn);
