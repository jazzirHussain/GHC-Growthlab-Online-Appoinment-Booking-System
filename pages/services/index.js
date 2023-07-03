import { collection, doc, getDocs, orderBy, query } from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Nav from "../../components/Nav";
import db from "../../firebase.config";

export async function getServerSideProps() {
  const services = await getDocs(query(collection(db,'services'),orderBy("post_date","desc")))
  let services_list = []
  services.docs.map(service=>{
    services_list.push(service.data())
  })
  return{
    props: {services:services_list}
  }
}

export default function Services({ services }) {

  return(
    <>
    <Head>
    <title>Services | GHC</title>
    <meta name="description" content="Growth starts here" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
     <Nav />
    <div class='top-news'>
      <div class="overlay-blur"></div>
      <div class="overlay-black"></div>
      <div class="s-top">
        <div class="non-featured-top">
          <div class="s-list">
            {services.map((service,i)=>(
              <div key={i} class="s-list-item">
                <div class="s-img">
                  <img src={`/${service.image}`} alt="" />
                </div>
                <div class='s-cont'>
                  <h3 class="s-heading">{service.post_title}</h3>
                  <p>{service.post_content}</p>
                  <div class="s-book-now">
                    <Link href={service.link||''}><a> <button>Book Now</button></a></Link>
                  </div>
                  {service.isFeaturred ? <div class="cr cr-top cr-left cr-sticky cr-red">Featured</div> : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
    
  )
}