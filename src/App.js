import './App.css';
import React,{useEffect, useState} from 'react';
import Router from './router'
import { UserProvider } from './context/UserContext';
import {NotificationManager} from 'react-notifications'
import { db } from './firebase';
function App() {
  const [message, setMessage] = useState()
  const [start, setStart] = useState(false)
  const readData = ()=>{
    db.collection('voucher').orderBy('timestamp','desc').onSnapshot(snapshot =>{
    //   let num = 0;
         const res = snapshot.docs.map(doc => ({id:doc.id,data:doc.data()}));
        NotificationManager.info('Your have received a voucher discount ' + res[0].data.discount * 100 + ' % of the order', 'Notification for your');
    //     console.log(num++)
        
       })
    

}
  useEffect(()=>{
    readData()
  },[])
  useEffect(()=>{

  })
  return (
    <div className="App">
      <UserProvider>
        <Router />
      </UserProvider>
    </div>
  );
}

export default App;
