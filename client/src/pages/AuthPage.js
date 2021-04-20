import React, { useState } from 'react'
import {useHttp} from '../hooks/http.hook'

export const AuthPage = () =>  {
    const {loading, request} = useHttp()
    const [form, setForm] = useState({
        email:'', password:''

    })
    const chengeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})

    }
    const registerHandler = async () => {
        try{
            const data = await request('/api/auth/register', 'POST', {...form})
            console.log("Data", data)
        }catch(e){

        }
    }
    return(
        <div className="row">
            <div className=".col.s6.offset-s3">
                <h1>Сократи ссылку</h1>
            <div className="card blue darken-4">
                <div className="white-text">
                    <span className="card-title">Авторизация</span>
                     <div>
                     <div className="input-field">
                        <input
                         placeholder="Введите Email"
                          id="email" 
                          type="text"
                           class="validate"
                           name="email"
                           className="yellow-input"
                           onChange={chengeHandler}/>
                           
                        <label htmlfor="email">Email</label>
                    </div>
                    </div>
                    <div>
                     <div className="input-field">
                        <input
                         placeholder="Введите пароль"
                          id="password" 
                          type="password"
                           class="validate"
                           name="password"
                           className="yellow-input"
                           onChange={chengeHandler}/>
                           
                        <label htmlfor="password">Password</label>
                    </div>
                    </div>
                 </div>
                    <div className="card-action">
                        <button
                        className="btn yellow darken-4"
                        style={{marginRight: 10}}
                        disabled = {loading}
                        >
                            Войти 
                            </button>
                        <button 
                        className="btn grey lighten-1 black-text"
                        onclick={registerHandler}
                        disabled = {loading}
                        >
                            Регистрация 
                            
                            </button>
                    </div>
                </div>
            </div>
        </div>
        )
}