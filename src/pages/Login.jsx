import { useState } from 'react';
import MyButton from '../components/MyButton';
import MyInput from '../components/MyInput';

const Login = ({ setUser, setHash }) => {
  const [tempUser, setTempUser] = useState('');
  const [tempHash, setTempHash] = useState('');

  const onSubmit = () => {
    setUser(tempUser);
    setTempUser('');
    setHash(tempHash);
    setTempHash('');
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2>login</h2>
        <div className='m-2'>
          <MyInput
            placeholder="username"
            autoFocus="autofocus" 
            f={setTempUser}
          />
        </div>
        <div className='mb-2'>
        <MyInput
            placeholder="password"
            f={setTempHash}
          />
        </div>
        <MyButton onClick = {onSubmit} text_true = 'login' text_false = 'login'></MyButton>
    </div>
  );
};

export default Login;