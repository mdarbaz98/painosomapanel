
import React, { useContext, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import Axios from 'axios';
import { Toast } from "primereact/toast";
import { AuthContext } from '../context/authContext';


export const Login = (props) => {
    const {value, setValue} = useContext(AuthContext)
    console.log(value)
    const toast = useRef(null);

    const [login, setLogin] = useState({
        username: "",
        password: ""
    })

    const [register, setRegister] = useState({
        username: "",
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
        const value = await Axios.post('http://192.168.0.143:5000/api/login', login);
        if (value?.data.message) {
            toast.current.show({ severity: "error", summary: "Error", detail: `${value?.data.message}`, life: 3000 });
        }
        else {
            setLogin(value?.data[0])
            setValue(login)
        }
    }

    const handleRegister = async () => {
        const value = await Axios.post('http://192.168.0.143:5000/api/register', register);
        setIsRegister(false)
    }

    return (

        <div className='flex justify-content-center align-items-center h-screen'>
            <Toast ref={toast} />
            {!isregister ? <div className='card py-8 px-8' style={{ width: "600px" }}>
                <h1 className='mb-5 text-center font-bold text-blue-600'>Login Form</h1>
                <div className='p-fluid mb-5'>
                    <span className="p-float-label">
                        <InputText id="in" value={login.username} name='username' onChange={(e) => handleLoginFunction(e)} />
                        <label htmlFor="in">Username</label>
                    </span>
                </div>
                <div className='p-fluid'>
                    <span className="p-float-label">
                        <Password value={login.password} name='password' onChange={(e) => handleLoginFunction(e)} toggleMask />
                    </span>
                </div>
                <Button onClick={handleLogin} className='my-4 w-full' label='Login'></Button>
                <Button onClick={() => { setIsRegister(true) }} label="Register Here" className="p-button-secondary my-2" />
                {/* <h1>{loginstatus}</h1> */}
            </div>
                :
                <div className='card py-8 px-8' style={{ width: "600px" }}>
                    <h1 className='mb-5 text-center font-bold text-blue-600'>Register Form</h1>
                    <div className='p-fluid mb-5'>
                        <span className="p-float-label">
                            <InputText id="in" value={register.username} name='username' onChange={(e) => handleRegisterFunction(e)} />
                            <label htmlFor="in">Username</label>
                        </span>
                    </div>
                    <div className='p-fluid'>
                        <span className="p-float-label">
                            <Password value={register.password} name='password' onChange={(e) => handleRegisterFunction(e)} toggleMask />
                        </span>
                    </div>
                    <Button onClick={handleRegister} className='mt-4 w-full' label='Register'></Button>
                </div>}

        </div>


    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Login, comparisonFn);
