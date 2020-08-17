import React, { Component } from 'react';
import MainNav from '../modules/main-nav';
import Footer from '../modules/footer';
import Helmet from 'react-helmet';
import CookieConsent from "react-cookie-consent";
import objectFitImages from 'object-fit-images';
import '../modules/_global/scss/global.scss';

class Layout extends Component {
  componentDidMount() {
    if (typeof window === 'undefined') return;

    if (typeof objectFitImages === 'function') {
      objectFitImages();
    } else {
      console.log('objectFitImages is not a function', objectFitImages);
    }
  }
  render() {
    return (
      <>
        <Helmet>
          <link rel="stylesheet" type="text/css" href="https://cloud.typography.com/6014912/7241012/css/fonts.css" />
          <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.22.0/polyfill.js"></script>
        </Helmet>
        <MainNav />
        <div role="main" id="maincontent" name="maincontent">{this.props.children}</div>
        <Footer />
        <CookieConsent
          location="bottom"
          buttonText="Agreed"
          buttonStyle={{ backgroundColor: "#B18925"}}
          cookieName="ConnellyPartners"
        >
          By continuing to use this site without changing your settings, you agree to the use of cookies in accordance with our <a href='/cookie-policy/'>Cookie Policy</a>.
        </CookieConsent>
      </>
    );
  }
}

export default Layout;
