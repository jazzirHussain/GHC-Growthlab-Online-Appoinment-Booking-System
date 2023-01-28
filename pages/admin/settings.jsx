import { collection, doc, getDoc, updateDoc } from "firebase/firestore"
import Head from "next/head"
import { useState } from "react"
import db from "../../firebase.config"

export async function getServerSideProps() {
  const config_doc = await getDoc(doc(db,'config','H5IECtArT7Ngo9r5rdj6'))
  return{
    props:{config:config_doc.data()}
  }
}
export default function Services_settings({config}){
  const [configVal, setconfigVal] = useState(config)

  const handleFormSubmit = async ()=>{
   await updateDoc(doc(db,'config','H5IECtArT7Ngo9r5rdj6'),configVal)
   alert('Values Updated')
  }
  return(
    <div className='a-top ss-top'>
      <Head>
    <title>Settings | GHC</title>
    <meta name="description" content="Growth starts here" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
    <h1>Settings</h1>
    <form>
      <label for="email">Admin Mail</label>
      <input type="email" name="email" id="" placeholder="email" onChange={e=>{setconfigVal({...configVal,email:e.target.value})}} value={configVal.email} />
      <br />
      <label for="meeting_url">Meeting URL</label>
      <input type="text" name="meeting_url" id="" placeholder="Meeting URL" onChange={e=>{setconfigVal({...configVal,meetUrl:e.target.value})}} value={configVal.meetUrl} />
      <br />
      <label for="meeting_url">Phone</label>
      <input type="text" name="phone" id="" placeholder="Phone" value={configVal.phone} onChange={e=>{setconfigVal({...configVal,phone:e.target.value})}} />
      <br />
      <label for="meeting_url">Address</label>
      <input type="text" name="address" id="" placeholder="Address" value={configVal.address} onChange={e=>{setconfigVal({...configVal,address:e.target.value})}} />
      <p onClick={handleFormSubmit}>Submit</p>
    </form>
    </div>
  )
}