import React,{useEffect, useState} from 'react'
import { db } from '../firebase'

export default function NotificationPage() {
    const [list, setList] = useState([])
    useEffect(()=>{
        readData();
    },[])
    const readData = ()=>{
        db.collection('voucher').orderBy('timestamp','desc').onSnapshot(snapshot =>{
            const res = snapshot.docs.map(doc => ({id:doc.id,data:doc.data()}));
            // NotificationManager.info('Your have received a voucher discount ' + res[0].data.discount * 100 + ' % of the order', 'Notification for your');
            console.log(res)
            setList(res)
        })

    }
    return (
        <div style={{minHeight:'70vh', height:'70vh', overflow:'scroll'}}> 
            <h4 style={{textAlign:'center', margin:20}}>Notification for you</h4>
            {list?.map(l =>{
                return (
                    <div>
                        <div className="row text-left" style={{paddingLeft:30, paddingBottom: 10, paddingTop:10, background:'#e7e7e7', margin : 15, borderRadius:10}}>
                            <div className="col-2">
                                <img src="https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/000000/external-notification-delivery-kiranshastry-lineal-color-kiranshastry.png"/>
                            </div>
                            <div className="col-10">
                                <h4>You have just received a message</h4>
                                <p style={{margin:6}}>You've received a voucher discount {l?.data?.discount * 100} % of your order</p>
                                <p style={{margin:5}}>Code : {l?.data?.id}</p>
                                <p style={{color:'#808080', fontStyle:'italic'}}>Time valid : {new Date(l?.data?.startDate).toLocaleString("th-TH")} - {new Date(l?.data?.endDate).toLocaleString("th-TH")}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
