import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import "@/App.css";

const Login = () => {
    const navigate = useNavigate();
    const [email_id, setEmail_id] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submitLoginCheck = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email_id, password }),
            });
            const res = await response.json();
            console.log(res);
            if (!response.ok) {
                alert('Incorrect username or password');
                return;
            }

            document.cookie = "email_id="+email_id+"; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
            document.cookie="name="+res.login.name+"; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
            
            document.cookie="user_id="+res.login.id+"; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
            
            navigate('/index');
        } catch (err) {
            alert('Login failed: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <form onSubmit={submitLoginCheck}>
                {error && <div className="text-red-500">{error}</div>}
                <div>
                    <input 
                    type="text" 
                    placeholder="Username" 
                    value={email_id} 
                    onChange={e => setEmail_id(e.target.value)}
                    className = "formFields"
                />
                </div>
                <div>
                    <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className = "formFields"
                />
                </div>
                
                
                <button type="submit" className="homePageButtons">Submit</button>
            </form>
        </div>
    );
};

export default Login;