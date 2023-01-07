import { onAuthStateChanged} from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import db, { auth } from "../../firebase.config";
import { getSignedInUserEmail, googleOauthURL, initClient, publishTheCalenderEvent, signOut } from "../../gcalender.config";
import emailjs from '@emailjs/browser'
import Head from "next/head";



export async function getServerSideProps() {
  const appoinments_doc = await getDocs(query(collection(db,'appoinments'),where('status','==','pending')))
  const approved_appoinments_doc = await getDocs(query(collection(db,'appoinments'),where('status','==','approved')))
  let appoinments=[];
  let approved_appoinments = []
  appoinments_doc.docs.map(appoinment=>{
    appoinments.push({...appoinment.data(),id:appoinment.id})
  })
  approved_appoinments_doc.docs.map(appoinment=>{
    approved_appoinments.push({...appoinment.data(),id:appoinment.id})
  })
  return{
    props:{appoinments:appoinments,
    approved_appoinments:approved_appoinments
    }
  }
}
export default function Appoinments({appoinments,approved_appoinments}){
  const router = useRouter();
  const [loader, setLoader] = useState(false)
  const [config, setconfig] = useState({})

  const fetchConfig = async ()=>{
    const config_doc = await getDoc(doc(db,'config','H5IECtArT7Ngo9r5rdj6'))
    setconfig(config_doc.data())
  }

  useEffect(() => {
    fetchConfig()
    if(window.location.pathname!=='/login'){
      console.log('auth chck')  
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/admin/login')
        }
      })
    }
  },[router])

  const refreshData = () => {
    router.replace(router.asPath);
  }

  const correct_time = (time)=>{
    if(time<=8){
      return time+12
    }else{
      return time
    }
  }
  
  const handleApprove = (event)=>{
    console.log('handleApprove');
    setLoader(true)
    event.date_slot = event.date_slot.split("-").reverse().join("-")
    let loc;
    if(event.con_type=='physical'){
      loc = 'offline'
    }else if(event.con_type=='phone'){
      loc='phone'
    }else{
      loc=config.meetUrl
    }
    var evnt = {
      'summary': event.post_title,
      'location': loc,
      'description': `${event.name}, ${event.phone}, GHC Consultation`,
      'start': {
        'dateTime': `${event.date_slot}T${correct_time(event.time_slot)}:00:00`,
        'timeZone': 'Asia/Kolkata'
      },
      'end': {
        'dateTime': `${event.date_slot}T${correct_time(event.time_slot)}:30:00`,
        'timeZone': 'Asia/Kolkata'
      }
    };
    initClient((success)=>{
      if (success){
          getGoogleAuthorizedEmail(evnt,event);
      }
    });

  }
  const sendEmail = async (appoinment)=>{
    
    var templateParams = {
      to_name: appoinment.name,
      from_name:"GHC Growth Lab",
      service:appoinment.post_title,
      date:appoinment.date_slot,
      time: appoinment.time_slot<=8 ? `${appoinment.time_slot} PM` :`${appoinment.time_slot} AM`,
      to_email:appoinment.email
    };
    if(appoinment.con_type=='physical'){
      templateParams.message = `Please visit us at ${config.address}`
    }else if(appoinment.con_type=='phone'){
      templateParams.message = `Please ring us on ${config.phone}`
    }else{
      templateParams.message = `Please join google met using the link ${config.meetUrl}`
    }
    console.log(templateParams);
    emailjs.send('service_fymwt6q','template_88lnyo2',templateParams,'KbGLQS0YcIzoUFKiy').then(()=>{
      console.log('succes');
    }).catch(e=>{
      console.log(e);
    })
  }
  const getGoogleAuthorizedEmail =async (evnt,full_event)=>{
    console.log('getAuthEmail');
      let email = await getSignedInUserEmail();
      if (email){
        console.log(evnt);
          publishTheCalenderEvent(evnt,async (err)=>{
            if(err){
              alert('Couldnt add event to calender please try again!')
            }else{
              await changeAppoimentStatus(full_event)
              await sendEmail(full_event)
              refreshData()
              setLoader(false)
            }
          });
          // setSignedIn(true)
          // setgoogleAuthedEmail(email)
      }else{
        console.log('error');
      }
  };


  const changeAppoimentStatus = async (event)=>{
    await updateDoc(doc(db,'appoinments',event.id),{
      status:'approved'
    })
  }

  const handleCancel = async (event)=>{
    setLoader(true)
    await deleteDoc(doc(db,'appoinments',event.id))
    refreshData()
    setLoader(false)
    alert('Appoinment Canceled!')
  }

  const Row = (appoinment)=>{
    
    return(
      <div class="a-list-item">
        <div class="a-email">
          <p>{appoinment.name}</p>
        </div>
        <div class="a-phone">
          <p>{appoinment.phone}</p>
        </div>
        <div class="a-post-name">
          <p>{appoinment.post_title}</p>
        </div>
        <div class="a-post-name">
          <p>{`${appoinment.date_slot}`} / {appoinment.time_slot<=8 ? `${appoinment.time_slot} PM` :`${appoinment.time_slot} AM`}</p>
        </div>
        <div class="a-post-name">
          <p>{appoinment.con_type}</p>
        </div>
        <div class="a-post-name">
          <p>{appoinment.status}</p>
        </div>
        <div class="a-post-name">
            {appoinment.status == 'pending' ?
                <>
                <input type="submit" name="cancel" value="Cancel" onClick={()=>{handleCancel(appoinment)}}/>
                <input type="submit" name="approve" value="Approve" onClick={()=>{handleApprove(appoinment)}}/>
                </>
              :
                <input type="submit" name="cancel" value="Cancel" onClick={()=>{handleCancel(appoinment)}}/>
            }
        </div>
      </div>
    )
  }

  return(
  <>
  <Head>
    <title>Appoinments | GHC</title>
    <meta name="description" content="Growth starts here" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
  {loader && <div className="login-loader"><span>.</span></div>}
  <div class="a-top">
    <h1>Appoinments</h1>
    <div class="a-list-box">
      <h3>Pending Appoinments</h3>
      {appoinments.length == 0 ? <p>No pending appoinments!!</p>:''}
      {appoinments.map(appoinment =>(
        Row(appoinment)
      ))}
    </div>
    <div class="a-list-box">
      <h3>Approved Appoinments</h3>
      {approved_appoinments.length == 0 ? <p>No pending appoinments!!</p>:''}
      {approved_appoinments.map(appoinment =>(
        Row(appoinment)
      ))}
    </div>
  </div>
  </>
  
  )
}