import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { useState } from 'react';
const auth = getAuth(app)
function App() {
  const [email , setEmail] = useState ('')
  const [password , setPassword] = useState ('')
  const [validated, setValidated] = useState(false);
  const [registered ,setRegitered] = useState (false);

  const [error , setError] = useState ('') ;

  const handleRegisteredChange = event => {
   
    console.log (event.target.checked)
    setRegitered (event.target.checked)
  }
  
  const handleEmailBlur = event => {
    setEmail(event.target.value)
  }
  const handlePasswordBlur = event => {
    setPassword(event.target.value)

  }
  const handleFormsubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
   
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return ;
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError ('password should contain at lest one special character')
      return ;
    }

    setValidated(true);
    setError ('') ;
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
      .then((result) => { 
        console.log (password , email)
        const user = result.user;
       console.log (user) ;
      })
      .catch((error) => {
        setError (error.massage)
      });
    }
    else {
      createUserWithEmailAndPassword (auth , email , password )
     .then (result => {
       const user = result.user ;
       console.log (user) ;
       setEmail ('')
       setPassword ('')
       verifyEmail ()
     })
     .catch (error => {
       console.log (error) ;
       console.log (error.massage) ;
     })
  }
  event.preventDefault()
}
     
const verifyEmail = () => {
  sendEmailVerification (auth.currentUser)
  .then (()=> {
    console.log ('email verification')
  })
}
  return (
    <div className="App container px-5">
      <h2 className='text-primary '>Please {registered ? 'LogIn' : 'Register' }</h2>
      <Form noValidate validated={validated} onSubmit={handleFormsubmit} >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={handleEmailBlur} type="email" required placeholder="Enter email" />
          <Form.Control.Feedback>Please provide a valid state.</Form.Control.Feedback>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={handlePasswordBlur} type="password" required placeholder="Password" />
          <Form.Control.Feedback>Please provide a valid state.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check  onChange={handleRegisteredChange} type="checkbox" label="Already register" />
        </Form.Group>
        <p className='text-danger'>{error}</p>
        <Button variant='link'>Forgot Password</Button>
        <Button variant="primary" type="submit">
        {registered ? 'LogIn' : ' Register' }
        </Button>
      </Form>
    </div>
  );
}

export default App;
