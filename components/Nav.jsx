import Link from "next/link";

export default function Nav(){
  return (
    <div id="masthead">
      <div className="logo">
        <img src='/logo.png' alt="" />
      </div>
      <div className="ham-menu">
        <label for="check">
          <input type="checkbox" id="check"/> 
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>
      <div className="nav-cont">
        <Link href='/services'><a>Services</a></Link>
        <Link href='/'><a>Home</a></Link>
      </div>
    </div>
  )
}