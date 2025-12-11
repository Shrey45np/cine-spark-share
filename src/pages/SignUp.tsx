import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import "@/App.css";

const SignUp = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const submitLoginCheck = async (e) => {
        e.preventDefault();
        
        try {
            console.log(name,email,password,username);
            const response = await fetch("http://localhost:3000/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name ,email,password,username  }),
            });

            console.log(response);
            
            if (!response.ok) {
                setError('Could not create user');
                return;
            }
            
            navigate('/index');
        } catch (err) {
            setError('Could not create user ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <form onSubmit={submitLoginCheck}>
                {error && <div className="text-red-500">{error}</div>}
                <input 
                    type="text" 
                    placeholder="Email ID" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                />
                
                <button type="submit" className="homePageButtons">Submit</button>
            </form>
        </div>
    );
};

export default SignUp;