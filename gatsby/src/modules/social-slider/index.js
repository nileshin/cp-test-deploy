import React, { Component } from 'react';
import Helmet from 'react-helmet';
import './main.scss';

class SocialSlider extends Component {
  constructor(props) {
    super(props);

    this.juicerContainer = React.createRef();
  }
  componentDidMount() {
    this.loadJuicer();
  }
  loadJuicer() {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://assets.juicer.io/embed.js';

    // if (this.juicerContainer.current) {
    //   this.juicerContainer.current.appendChild(script);
    // } else {
    document.body.appendChild(script);
    // }
    const evt = document.createEvent('Event');
    evt.initEvent('load', false, false);
    window.dispatchEvent(evt);
  }
  slickOptions = {
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: false,
    infinite: false,
    variableWidth: true,
  };
  render() {
    return (
      <div className="social-slider">
        <Helmet>
          <link
            href="https://assets.juicer.io/embed.css"
            media="all"
            rel="stylesheet"
            type="text/css"
          />
        </Helmet>
        <div className="container">
          <h2 className="alt">
            Social
            <br />
            Feed
          </h2>
        </div>
        <div className="juicer-container container" ref={this.juicerContainer}>
          <ul
            className="juicer-feed"
            data-feed-id="cpinsta"
            data-slick={JSON.stringify(this.slickOptions)}
            data-interval="0"
          />
        </div>
      </div>
    );
  }
}

export default SocialSlider;
