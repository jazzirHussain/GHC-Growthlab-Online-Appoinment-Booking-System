import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import db from "../../../../firebase.config"

const fetchData = async (name)=>{
  return await getDocs(query(collection(db,'services'),where('post_title','==',name)))
}

export async function getServerSideProps(q) {
  if(q.query.name !== 'add'){
    const services = await fetchData(q.query.name)
    const service = services.docs[0].data()
    return {
      props:{service:{...service,id:services.docs[0].id}}
    }
  }else{
    return{
      props:{}
    }
  }
}

export default function Service({service}){
  const [name, setname] = useState(service.post_title)
  const [desc, setdesc] = useState(service.post_content)
  const [fees, setfees] = useState(service.fees)
  const [time, settime] = useState(service.time)
  const [days, setdays] = useState(service.days)
  const [link, setlink] = useState(service.link || '')
  const router = useRouter()

  const handleEdit =async ()=>{
    let obj = {
      post_title:name,
      post_content:desc,
      fees,
      time,
      days,
      link
    }
    await updateDoc(doc(db,'services',service.id),obj)
    router.push('/admin/services')
    alert("Service Updated!")
  }
  const handleDelete =async ()=>{
    if(window.confirm('Are you sure you want to delete?')){
      await deleteDoc(doc(db,'services',service.id))
      router.push('/admin/services')
    }
  }
  return(
    <div className="service-add-form-top">
      <Head>
        <title>Edit | Services</title>
        <meta name="description" content="Growth starts here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="service-add-head">
        <h1>Edit Services</h1> 
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
        <label>
          Link
          <input type="text" value={link} onChange={e=>{setlink(e.target.value)}} />
        </label>
        <div className="but-grp">
        <button className="add-service-but" onClick={handleEdit}>Save</button>
        <button className="add-service-but-2" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  )
}