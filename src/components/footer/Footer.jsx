import React from 'react'
import './Footer.css'
import { AiFillFacebook, AiFillInstagram, AiFillTwitterSquare } from "react-icons/ai";



const Footer = () => {
  return (
    
    <footer>
        <div className="footer-content">
            <p>
                &copy; 2024 Your E-Learning Platform. All right reserved. <br /> Made with ❤️ <a href="https://github.com/Siddhant7621">Siddhant Sharma</a>
            </p>
            <div className="social-links">
                <a href=""><AiFillFacebook/></a>
                <a href=""><AiFillTwitterSquare/></a>
                <a href=""><AiFillInstagram/></a>
            </div>
        </div>
    </footer>
  )
}

export default Footer