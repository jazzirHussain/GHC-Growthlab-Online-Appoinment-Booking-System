import { collection, getDocs, orderBy, query } from "firebase/firestore"
import Head from "next/head"
import Link from "next/link"
import Nav from "../../../components/Nav"
import db from "../../../firebase.config"

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
    <div>
      <Head>
        <title>Admin | Services</title>
        <meta name="description" content="Growth starts here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="admin-service-head">
        <h1>Services</h1>
        <p className="service-add-but"><Link href={'services/add'}>Add</Link></p> 
      </div>
      <div className="admin-service-top">
        <div className="admin-service-table">
          <div className="table-row">
            <p>Service Name</p>
            <p className="hide-mobile">Service Description</p>
            <p>Service Fees</p>
          </div>
          {services.map((service,i)=>(
            <div key={i} class="table-row">
              <p><Link href={`services/edit/${service.post_title}`}>{service.post_title}</Link></p>
              <p className="hide-mobile">{service.post_content}</p>
              <p className="font-bold">{service.fees}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}