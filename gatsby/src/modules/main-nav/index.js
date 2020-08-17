import React, { Component } from 'react';
import { Link } from 'gatsby';
import Menu from '../../components/menu';
import { passiveIfSupported } from '../../utils';

import './main.scss';
import $ from 'jquery';
import '../_global/js/vendor/menu';

import ConnellyLogo from '../_global/images/logo.svg';
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

class MainNavDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      footerOverlap: false,
      footerHeight: 0,
      windowHeight: 0,
      open: false
    };
  }
  componentDidMount() {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', this.handleScroll, passiveIfSupported);
    window.addEventListener('resize', this.handleScroll, passiveIfSupported);
    this._checkMenuState();
  }
  componentWillUnmount() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  }
  handleScroll = e => {
    if (typeof window === 'undefined') return;

    const footer = document.querySelector('footer');
    if (!footer) return;

    const footerRect = footer.getBoundingClientRect();

    if (footerRect.top < window.innerHeight) {
      this.setState(state => ({
        ...state,
        footerOverlap: true,
        footerHeight: footerRect.height,
        windowHeight: window.innerHeight,
      }));
    } else {
      this.setState(state => ({
        ...state,
        footerOverlap: false,
        footerHeight: 0,
      }));
    }
  };
  _checkMenuState = e =>{
    if($(".enumenu_container .menu-icon").hasClass("active")){
      this.setState(state => ({
        ...state,
        open: true
      }));
    } else{
      this.setState(state => ({
        ...state,
        open: false
      }));
    }
  }
  _onMainMenuFocus = e => {
    this._checkMenuState();
    if(!this.state.open){
      this.setState(state => ({
        ...state,
        open: true
      }));
      $(".enumenu_container .menu-icon").trigger("click");
      
    }
  };
  _onSocialMenuFocus = e =>{
    this._checkMenuState();
    if(this.state.open){
      this.setState(state => ({
        ...state,
        open: false
      }));
      $(".enumenu_container .menu-icon").trigger("click");
    }  
  };
  render() {
    const { menu } = this.props.menuData;
    const [node] = this.props.optionsData;
    const {
      node: { options },
    } = node;

    const { footerOverlap, footerHeight } = this.state;
    const socialStyle = footerOverlap
      ? {
          transitionDelay: '0.1s',
          transform: `translate3d(0, -${footerHeight -
            window.innerHeight * 0.15}px, 0)`,
        }
      : {};

    return (
      <header className="site-header">
        <a href="#maincontent" id="bypass-link">Skip to main content</a> 
        <div className="logo">
          <Link to="/" title="Connelly Partners">
            <img src={ConnellyLogo} alt="Connelly Partners" />
          </Link>
        </div>
        <nav className="main-navigation">
          <ul className="primary-menu">
            {menu.map(nav_item => (
              <li
                className={nav_item.classes.join(' ')}
                key={nav_item.wordpress_id}
              >
                {nav_item.post_object && nav_item.type !== 'custom' ? (
                  <Link to={nav_item.url} onFocus={this._onMainMenuFocus}>{nav_item.title}</Link>
                ) : (
                  <a href={nav_item.url} title={nav_item.title} onFocus={this._onFocus} >
                    {nav_item.title}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={`social ${footerOverlap ? 'overlapping' : ''}`}
          style={socialStyle}
        >
          <span className="follow">Follow us</span>
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
                      onFocus={this._onSocialMenuFocus}
                    >
                      {NetworkLogo ? <NetworkLogo /> : network}
                    </a>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </header>
    );
  }
}

const mainNavRender = (menuData, optionsData) => (
  <MainNavDisplay menuData={menuData} optionsData={optionsData} />
);

class MainNav extends Component {
  componentDidMount() {
    $('.main-navigation').responsiveMenu({
      menuslide_overlap: true,
    });
  }
  render() {
    return <Menu menuName="main-menu" render={mainNavRender} />;
  }
}

export default MainNav;
