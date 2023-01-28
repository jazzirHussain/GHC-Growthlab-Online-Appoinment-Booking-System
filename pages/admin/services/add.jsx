import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import db from "../../../firebase.config"
import { useRouter } from "next/router";
import Head from "next/head";

export default function Service(){
  const [name, setname] = useState('')
  const [desc, setdesc] = useState('')
  const [fees, setfees] = useState('')
  const [time, settime] = useState('9,10,11,12,1,2,3,4,5,6')
  const [days, setdays] = useState('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31')
  const router = useRouter();

  const handleAdd =async ()=>{
    let obj = {
      post_title:name,
      post_content:desc,
      fees,
      time,
      days,
      post_date:new Date().toISOString()
    }
    await addDoc(collection(db,'services'),obj)
    router.push('/admin/services')
    alert("Service Added!")
  }

  return(
    <div className="service-add-form-top">
      <Head>
        <title>Add | Services</title>
        <meta name="description" content="Growth starts here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="service-add-head">
        <h1>Add Services</h1> 
      </div>
      <div className="service-top-form">
        <label>
          Service Name
          <input type="text" value={name} onChange={e=>{setname(e.target.value)}} />
        </label>
        <label>
          Service Description
          <input type="text" value={desc} onChange={e=>{setdesc(e.target.value)}} />
        </label>
        <label>
          Service Fees
          <input type="text" value={fees} onChange={e=>{setfees(e.target.value)}} />
        </label>
        <label>
          Service Timings
          <input type="text" value={time} onChange={e=>{settime(e.target.value)}} />
        </label>
        <label>
          Service days
          <input type="text" value={days} onChange={e=>{setdays(e.target.value)}} />
        </label>
        <button className="add-service-but" onClick={handleAdd}>Add Service</button>
      </div>
    </div>
  )
}