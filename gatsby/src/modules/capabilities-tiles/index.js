import React, { Component } from 'react';
import { graphql } from 'gatsby';

import './main.scss';
// import './main.js';

import { ReactComponent as Hamburger } from '../_global/images/hamburger-close.svg';
import { ReactComponent as DownloadIcon } from '../_global/images/icon-dwnld.svg';
import { ReactComponent as PlusIcon } from '../_global/images/icon-plus.svg';

class CapabilitiesTiles extends Component {
  state = {
    popupOpen: false,
    activeCapabilityIndex: null
  };
  activateCapability = e => {
    const target = e.currentTarget;
    this.setState(
      state => ({
        ...state,
        activeCapabilityIndex: target.dataset.capabilityIndex,
      }),
      () => {
        if (document) {
          document.body.classList.add('popOpen');
        }
        this.setState(state => ({ ...state, popupOpen: true }));
      }
    );
  };
  closeActiveCapability = () => {
    this.setState(
      state => ({
        ...state,
        popupOpen: false,
      }),
      () => {
        if (document) {
          document.body.classList.remove('popOpen');
        }
        this.setState(state => ({ ...state, activateCapabilityIndex: null }));
      }
    );
  };
  componentDidMount() {
    if (document) {
      document.body.addEventListener('click', this.handleClick);
      document.body.addEventListener('keyup', this.handleKeyUp);
    }
  }
  componentWillUnmount() {
    if (document) {
      document.body.removeEventListener('click', this.handleClick);
      document.body.removeEventListener('keyup', this.handleKeyUp);
    }
  }
  handleClick = e => {
    if (
      e.target.classList.contains('pop-up') ||
      e.target.classList.contains('pop-up__wrap')
    ) {
      this.closeActiveCapability();
      return;
    }
  };
  handleKeyUp = e => {
    if (e.which === 9 || e.key === 'Tab' || e.code === 'Tab') {
      this.closeActiveCapability();
      return;
    }
  };
  render() {
    const { title, services_and_capabilities_pdf, capabilities } = this.props;
    const { activeCapabilityIndex: activeCapIdx, popupOpen } = this.state;
    const activeCap = activeCapIdx ? capabilities[activeCapIdx] : null;
    return (
      <section className="capabilities-sec" id="capabilities-tiles">
        <div className="container">
          <div className="row">
            <div className="col-6">
              <h2
                dangerouslySetInnerHTML={{
                  __html: title,
                }}
              />
            </div>

            <div className="capabilities col-12">
              {capabilities.map((capability, index) => (
                <div className="capabilities__item" key={index}>
                  <button
                    className="capabilities__title pop-up__btn cap_header"
                    data-href={'#capabilities__details-' + index}
                    onClick={this.activateCapability}
                    data-capability-index={index}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: capability.name,
                      }}
                    />
                    <PlusIcon alt="plus" className="icn" />
                  </button>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: capability.sub_capabilities,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={`pop-up ${popupOpen && 'active'}`}>
          <div className="pop-up__wrap">
            <div className="pop-up__content container">
              <div
                className="capabilities__details pop-up__target popWrap"
                id={'capabilities__details-' + (activeCapIdx || -1)}
              >
                <span className="close" onClick={this.closeActiveCapability}>
                  <Hamburger className="flag" alt="open/close menu" />
                </span>
                <figure
                  className="bg-img"
                  style={{
                    backgroundImage:
                      'url(' +
                      (activeCap &&
                        activeCap.image.localFile.childImageSharp.fluid.src) +
                      ')',
                  }}
                />
                <blockquote>
                  <p>{activeCap && activeCap.leadership_quote}</p>
                  <cite>
                    <small>{activeCap && activeCap.leadership_title}:</small>{' '}
                    {activeCap && activeCap.leadership_name}
                  </cite>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default CapabilitiesTiles;

export const capabilitiesTilesFragment = graphql`
  fragment CapabilitiesTilesFragment on capabilitiesTiles_8 {
    title
    capabilities {
      name
      sub_capabilities
      leadership_quote
      leadership_title
      leadership_name
      image {
        ...WpMediaFragmentFluid1440
      }
    }
  }
`;
