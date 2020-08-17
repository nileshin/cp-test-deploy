import React, { Component } from 'react';
import Menu from '../../components/menu';

import { Link } from 'gatsby';
import './main.scss';

import { ReactComponent as ConnellyLogo } from '../_global/images/logo-footer.svg';
import { ReactComponent as DHLogo } from '../_global/images/DH.svg';
import { ReactComponent as LinkedinLogo } from '../_global/images/social-linkedin.svg';
import { ReactComponent as InstaLogo } from '../_global/images/social-ig.svg';
import { ReactComponent as TwitterLogo } from '../_global/images/social-twitter.svg';
import { ReactComponent as FacebookLogo } from '../_global/images/social-fb.svg';

const SOCIAL_LOGOS = {
  instagram: InstaLogo,
  twitter: TwitterLogo,
  facebook: FacebookLogo,
  linkedin: LinkedinLogo,
};

const renderFooterMenu = ({ menu }, optionsData) => {
  const [node] = optionsData;
  const {
    node: { options },
  } = node;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-3 order-2 order-md-1 order-lg-0">
            <a href="/" title="Connelly Partners" className="site-footer__logo">
              <ConnellyLogo />
            </a>
          </div>
          <div className="col-6 col-md-12 col-lg-6">
            <nav className="footer-nav">
              <ul className="secondary-menu">
                {menu.map(nav_item => (
                  <li
                    className={nav_item.classes.join(' ')}
                    key={nav_item.wordpress_id}
                  >
                    {nav_item.post_object && nav_item.type !== 'custom' ? (
                      <Link to={nav_item.url}>{nav_item.title}</Link>
                    ) : (
                      <a href={nav_item.url}>
                        {nav_item.url.indexOf('defiantly-human') >= 0 ||
                        nav_item.title.toLowerCase() === 'defiantly human' ? (
                          <DHLogo />
                        ) : (
                          nav_item.title
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="privacy-link">
              <Link to="/privacy-policy">View our <span>Privacy Policy</span></Link>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-3 order-md-1">
            <div className="social">
              <ul>
                {options.social_menu.map(
                  ({ social_media_network: network, link }) => {
                    const NetworkLogo = SOCIAL_LOGOS[network];
                    return (
                      <li key={network}>
                        <a
                          href={link.url}
                          title={network}
                          target={link.target || '_blank'}
                          rel="noopener noreferrer"
                        >
                          {NetworkLogo ? <NetworkLogo /> : network}
                        </a>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

class Footer extends Component {
  render() {
    return <Menu menuName="footer-menu" render={renderFooterMenu} />;
  }
}

export default Footer;
