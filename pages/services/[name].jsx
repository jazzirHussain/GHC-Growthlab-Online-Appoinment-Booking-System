import { addDoc, collection, doc, getDoc, getDocs , query, setDoc, where } from "firebase/firestore"
import { useEffect, useRef, useState } from "react";
import db from "../../firebase.config"
import emailjs from '@emailjs/browser'
import Nav from "../../components/Nav";
import Head from "next/head";


export async function getServerSideProps(q) {
  const service = await getDocs(query(collection(db,'services'),where('post_title','==',q.query.name)))
  return {
    props:{service:{...service.docs[0].data(),id:service.docs[0].id}}
  }
}
export default function Service({service}){
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  const [appointedTimes, setAppointedTimes] = useState([])
  const [selectedTime, setSelectedTime] = useState('')
  const [selecetdDate, setSelecetdDate] = useState('')
  const [userEmail, setuseremail] = useState('')
  const [userPhone, setuserPhone] = useState('')
  const [userName, setuserName] = useState('')
  const [app_type, setapp_type] = useState('physical')

  const time_box = useRef()
  const input_box = useRef()

  const fetchAppointedTimes =async (id,date)=>{
    console.log(id,date);
    const appointedTimes_doc = await getDocs(query(collection(db,'appoinments'),where('service_id','==',id),where('date_slot','==',date)))
    let appointedTimes = []
    appointedTimes_doc.docs.map(appointedTime =>{
      appointedTimes.push(appointedTime.data().time_slot)
    })
    setAppointedTimes(appointedTimes)
  }

  const handleDateClick = (e,id,date) =>{
    fetchAppointedTimes(id,date)
    setSelecetdDate(date)
    let elem = document.getElementsByClassName('cal-selected')[0]
    if(elem){
      elem.classList.remove('cal-selected')
    }
    e.target.classList.add('cal-selected')
    time_box.current.classList.remove('hide')
  }

  const handleTimeClick = (e,time)=>{
    setSelectedTime(time)
    let elem = document.getElementsByClassName('time-selected')[0]
    if(elem){
      elem.classList.remove('time-selected')
    }
    e.target.classList.add('time-selected')
    input_box.current.classList.remove('hide')
  }
  const correctTime = (time)=>{
    if(time>12){
      return time-12
    }else{
      return time
    }
  }

  const clearFields = ()=>{
    let elem = document.getElementsByClassName('time-selected')[0]
    let elem2 = document.getElementsByClassName('cal-selected')[0]
    if(elem && elem2){
      elem.classList.remove('time-selected')
      elem2.classList.remove('cal-selected')
    }
    time_box.current.classList.add('hide')
    input_box.current.classList.add('hide')
    setuseremail('')
    setuserName('')
    setuserPhone('')
    setapp_type('physical')
  }

  const handleFormSubmit = async ()=>{
    const config_doc = await getDoc(doc(db,'config','H5IECtArT7Ngo9r5rdj6'))
    const config = config_doc.data()
    const data = {
      email:userEmail,
      phone:userPhone,
      name:userName,
      service_id:service.id,
      date_slot: selecetdDate,
      time_slot:correctTime(selectedTime),
      amount:service.fees,
      con_type:app_type,
      status:'pending',
      post_title:service.post_title
    }
    var templateParams = {
      to_name: 'Manu',
      from_name:"GHC Growth Lab",
      message: `A new appoinment has been made for ${service.post_title} by ${userName} on ${selecetdDate}-${currentMonthName}-${curentYear}. Please approve the request\n Link: https://ghcgrowthlab.com/admin/appoinments` ,
      to_email: config.email
    };
    emailjs.send('service_fymwt6q','template_ut5nozq',templateParams,'KbGLQS0YcIzoUFKiy').then(()=>{
      console.log('succes');
    }).catch(e=>{
      console.log(e);
    })
    await addDoc(collection(db,'appoinments'),data)
    clearFields()
    alert('Appoinmnet Made succesfullyAppoinment Booked Succesfully. Will recieve a mail shortly.')
  }

  useEffect(() => {
    
  }, [])
  const currentDate = new Date();
  const currentMonthName =  monthNames[currentDate.getMonth()]
  const curentYear = currentDate.getFullYear()
  let firstDay = new Date(curentYear + "-" + (currentDate.getMonth()+1) + "-01").getDay();
  firstDay = (firstDay===0) ? 7 : firstDay
  const bookableDates = service.days.split(',').map(x => +x)
  const daysInMonth = new Date(curentYear, currentDate.getMonth() + 1,0).getDate()
  const bookableTime = service.time.split(',').map(x => +x).map(time=>{
    if(time<=8){
      return time+12
    }else{
      return time
    }
  })
  
  return(
    <>
    <Head>
    <title>{service.post_title} | GHC</title>
    <meta name="description" content="Growth starts here" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
    <Nav />
    <div class="p-top">
      
			<div class="p-left">
				<div class="cont-box">
					<h1>{service.post_title}</h1>
					<p>{service.post_content}</p>
					<br/>
					<p class="cont-price">Fees: ₹ {service.fees}</p>
					{/* <p >*Initial consultation is free.</p> */}
				</div>
			</div>
      <div class="p-right">
        <div class="p-overlay"></div>
          <div class="s-calender">
            <div class="s-cal-digits">
              <p class="s-my"><span>{currentMonthName}</span><span>{curentYear}</span></p>
              <form >
                <p class="week-name">Mon</p>
                <p class="week-name">Tue</p>
                <p class="week-name">Wed</p>
                <p class="week-name">Thu</p>
                <p class="week-name">Fri</p>
                <p class="week-name">Sat</p>
                <p class="week-name">Sun</p>
                {Array(firstDay-1).fill(1).map((el, i) =>
                  <p key={i}></p>
                )}
                {Array(daysInMonth).fill(1).map((el, i) =>
                  bookableDates.includes(i+1) && i+1>=currentDate.getDate() && new Date(curentYear + "-" + (currentDate.getMonth()+1) + "-" + (i+1)).getDay() != 0 ?
                    <p class='cal-days cal-bookable' onClick={(e)=>{handleDateClick(e,service.id,`${i+1}-${currentDate.getMonth()+1}-${curentYear}`)}}>{i+1}</p> :
                    <p class='cal-days cal-not-bookable'>{i+1}</p>
                )}
              </form>
            </div>
            <div class="cal-time-box hide" ref={time_box}>
              
              {bookableTime.map(time=>(
                new Date(curentYear,currentDate.getMonth(),selecetdDate.split('-')[0],time,0,0)>currentDate&& !appointedTimes.includes(correctTime(time)) ?
                  <p class='time-slot-but' onClick={(e)=>{handleTimeClick(e,time)}}>{correctTime(time)} - {correctTime(time)}:30 </p> :
                  <p class='time-slot-but-booked'>{correctTime(time)} - {correctTime(time)}:30 </p>
              ))}
            </div>
            <div class="cal-sub-form hide" ref={input_box}>
              <form >
                <input type="text" name="user_name" id="" placeholder="Name" value={userName} onChange={(e)=>{setuserName(e.target.value)}} required />
                <input type="email" name="user_email" id="" placeholder="Email" value={userEmail} onChange={(e)=>{setuseremail(e.target.value)}} required />
                <input type="text" name="user_phone" id="" placeholder="Phone" value={userPhone} onChange={(e)=>{setuserPhone(e.target.value)}} required />
                <select name="con_type" id="" value={app_type} onChange={(e)=>{setapp_type(e.target.value)}}>
                  <option value="physical">Offline (at Office)</option>
                  <option value="phone">Phone</option>
                  <option value="online">Online</option>
                </select>
                <p onClick={handleFormSubmit} class='sub-btn' >Book Appoinment</p>
              </form>
            </div>
          </div>
      </div>
		</div>
    </>
    
  )
} 
