import React from "react";
//import '../assets/stylesheets/static.css';
import StaticNavbar from '../components/StaticNavbar';

function Privacy() {
    return (
        <div className='static-body static-html'>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.12.0/css/all.css" />
          <StaticNavbar page="privacy" />
          <div id="loginPane">
            <p className="fs-1 fw-bold" style={{textAlign: 'center'}}>Privacy</p>
            <div className="container-fluid static-container-fluid py-5 text-white">
              <p style={{fontSize: '18px'}}>Your privacy is very important to us. In order to keep your important information safe:</p>
              <p style={{fontSize: '18px'}}>&nbsp; &nbsp;• Your data will not be sold to or shared with third parties.</p>
              <p style={{fontSize: '18px'}}>&nbsp; &nbsp;• Discord Integration is handled by Discord's Developer API and oAuth2.</p>
              <p style={{fontSize: '18px'}}>&nbsp; &nbsp;• Queue requests are encrypted, so others on your network do not know your activity.</p>
              <p style={{fontSize: '18px'}}>&nbsp; &nbsp;• We will never ask for any personal information in regards to your account.</p>
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
          <script src="../assets/js/static.js"></script>
        </div>
      );
}

export default Privacy;