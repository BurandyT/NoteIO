import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from './firebase';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import ParticlesBG from './components/ParticlesBg.tsx'
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext.tsx';

const RegisterLoginComponent = () => {

  const [showRegisterForm, setShowRegisterForm] = useState(true);
  const navigate = useNavigate()

  const toggleForm = () => {
    setShowRegisterForm(prevState => !prevState);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();

  const signIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log(userCredential);
      const loggedInUser = userCredential.user;
      setUser(loggedInUser);
      navigate('/home')
      
    }).catch((error) => {
      console.log(error)
    })
  }

  const [username, setUsername] = useState("");
  const [regisEmail, setRegisEmail] = useState("");
  const [regisPassword, setRegisPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    if (regisPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    createUserWithEmailAndPassword(auth, regisEmail, regisPassword)
      .then((userCredential) => {
        
        const user = userCredential.user;
        const uid = user.uid; 

        const userAttributes = {
          email: regisEmail,
          username: username,
          gender: gender,
          birthday: birthday
        };

        const db = getFirestore();
        setDoc(doc(db, 'users', uid), userAttributes)
          .then(() => {
            console.log("User information stored successfully.");
          })
          .catch((error) => {
            console.error("Error storing user information:", error);
          });
      })
      .catch((error) => {
        console.error("Registration error:", error);
      });
  
  };

  
  return (
    <>
    <section className="flex justify-center items-center h-screen  bg-[#F3EDC8] shadow-inner">
        <div className="rounded-2xl bg-[#EAD196] w-[40vw] z-10 shadow-2xl flex flex-col overflow-hidden max-lg:w-[80%] max-sm:w-11/12 transition-all duration-300 ease-in-out">
          <div className="bg-[#BF3131] h-20 w-full rounded-t-2xl flex items-center justify-around text-white font-RobotoMono text-4xl shadow-2xl overflow-x-hidden max-md:h-16">
            <div className='flex justify-center h-full w-[200vw]'>
              <div className={`flex justify-center items-center bg-[#7D0A0A] rounded-t-2xl transition-all duration-300 ${showRegisterForm ? 'translate-x-0' : '-translate-x-full '} w-full`}>
                Register
              </div>
              <div className={`flex justify-center items-center bg-[#7D0A0A] rounded-t-2xl h-full transition-all duration-300 ${showRegisterForm ? 'translate-x-full' : 'translate-x-0'} w-full`}>
                Login
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full h-full my-8 max-md:my-2" id='switch'>
              <form onSubmit={handleRegister} className={`flex justify-center items-start flex-col w-full p-10 max-md:p-[2%] max-md:text-sm transition-all duration-300 ease-in-out ${showRegisterForm ? 'translate-x-0' : 'translate-x-full hidden'}`}>
                <label htmlFor="username" className='text-2xl font-Poetsen'>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} id="username" className='border-b-4 border-stone-700 w-full bg-[#d6bc7d] text-xl mb-3' required/>

                <label htmlFor="email" className='text-2xl font-Poetsen'>Email</label>
                <input type="email" value={regisEmail} onChange={(e) => setRegisEmail(e.target.value)} id="email" className='border-b-4 border-stone-700 w-full bg-[#d6bc7d] text-xl mb-3' required />
                
                <div className="flex w-full justify-between max-xl:flex-col">
                  <div className="flex flex-col w-[49%] max-xl:w-full">
                    <label htmlFor="password" className='text-2xl font-Poetsen'>Password</label>
                    <input type="password" value={regisPassword} onChange={(e) => setRegisPassword(e.target.value)} id="password" className='border-b-4 border-stone-700 w-full bg-[#d6bc7d] text-xl mb-3'/>
                  </div>

                  <div className="flex flex-col w-[49%] max-xl:w-full">
                    <label htmlFor="confirmPassword" className='text-2xl font-Poetsen'>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id="confirmPassword" className='border-b-4 border-stone-700 w-full bg-[#d6bc7d] text-xl mb-3'/>
                  </div>
                </div>

                <label className='text-2xl font-Poetsen'>Gender</label>
                <div className="flex items-center gap-4 border-b-4 border-stone-700 w-full bg-[#d6bc7d] mb-3">

                  <label htmlFor="male" className='text-2xl font-Poetsen'>Male</label>
                  <input type="radio" name="gender" id="male" value="male" onChange={(e) => setGender(e.target.value)} required/>

                  <label htmlFor="female" className='text-2xl font-Poetsen'>Female</label>
                  <input type="radio" name="gender" id="female" value="female" onChange={(e) => setGender(e.target.value)} required/>
                </div>

                <label htmlFor="birthday" className='text-2xl font-Poetsen'>Birth Date</label>
                <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} name="birthday" id="birthday" className='border-b-4 border-stone-700 w-full bg-[#d6bc7d] text-xl mb-3' required/>
                
                <div className="flex justify-center items-center w-full">
                  <button className='bg-[#d6bc7d] w-60 h-16 border-4 border-b-black border-r-black font-RobotoMono hover:bg-[#b49c64] max-md:h-10'>Register!</button>
                </div>
              </form>
              <form onSubmit={signIn} className={`flex justify-center items-start flex-col w-full p-10 max-md:py-[7%] max-md:px-[2%] max-md:text-sm transition-all duration-300 ease-in-out ${showRegisterForm ? '-translate-x-full hidden' : 'translate-x-0'}`}>
                <label htmlFor="email" className='text-2xl font-Poetsen'>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" className='border-b-4 border-stone-700 w-full bg-[#d6bc7d] text-xl mb-3' required />
                
                <label htmlFor="password" className='text-2xl font-Poetsen'>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" className='border-b-4 border-stone-700 w-full bg-[#d6bc7d] text-xl mb-3'/>

                <div className="flex justify-center items-center w-full">
                  <button className='bg-[#d6bc7d] w-60 h-16 border-4 border-b-black border-r-black font-RobotoMono hover:bg-[#b49c64] max-md:h-10'>Login!</button>
                </div>
              </form>
          </div>
          <div className='flex w-full justify-center'>
            {showRegisterForm ? (
              <span>Already have an account? <button onClick={toggleForm}>click here!</button></span>
            ) : (
              <span>Don't have an account? <button onClick={toggleForm}>click here!</button></span>
            )}
          </div>
        </div>
            <ParticlesBG />
      </section>
    </>
  )
}

export default RegisterLoginComponent