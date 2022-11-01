import { addDoc, collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { useEffect } from 'react'
import db from '../firebase.config'
import data from '../wp_appoinments.json'

export default function Some(){
  const update = async ()=>{
    let docs = await getDocs(collection(db,'services'))
  docs.docs.map(d=>{
    updateDoc(doc(db,'services',d.id),{time:"9,10,11,12,1,2,3,4,5,6"})
  })
  }
  useEffect(() => {
    update()
  }, [])
  
  return(
    <div>
      hello

    </div>
  )
}