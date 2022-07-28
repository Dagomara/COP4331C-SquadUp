import React from 'react';

import BrandImg from '../assets/img/Squadup with text gradient white.png';


export default function StaticNavbar(props) {
    let activeOrNot = (pg) => {
        return props.page == pg ? "nav-link nav-link-static active active-static" : "nav-link nav-link-static";
    }
    return (
        <nav className="navbar static-navbar navbar-light navbar-expand-md navbar-fixed-top navigation-clean-button" style={{borderStyle: 'none', paddingTop: 0, paddingBottom: '10px'}}>
            <div className="container"><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
              <div><a className="navbar-brand" href="/"><img className="img-fluid" src={BrandImg} /> </a></div>
              <div className="collapse navbar-collapse" id="navcol-1" style={{color: 'rgb(255,255,255)'}}>
                <ul className="navbar-nav">
                  <li className="nav-item nav-item-static"><a className={activeOrNot("home")} style={{color: 'rgba(228, 241, 254)'}} href="/">Home</a></li>
                  <li className="nav-item nav-item-static"><a className={activeOrNot("about")} style={{color: 'rgba(228, 241, 254)'}} href="/about">About</a></li>
                  <li className="nav-item nav-item-static"><a className={activeOrNot("faq")} style={{color: 'rgba(228, 241, 254)'}} href="/faq">FAQ</a></li>
                  <li className="nav-item nav-item-static"><a className={activeOrNot("privacy")} style={{color: 'rgba(228, 241, 254)'}} href="/privacy">Privacy</a></li>
                </ul>
              </div>
            </div>
          </nav>
    );
};