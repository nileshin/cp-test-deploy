import React, { Component } from 'react';
import Img from 'gatsby-image';
import { graphql } from 'gatsby';
import './main.scss';

import { ReactComponent as BostonFlag } from '../_global/images/boston-flag.svg';
import { ReactComponent as DublinFlag } from '../_global/images/dublin-flag.svg';

class ImageTextPairing extends Component {
  render() {
    const { headline, supportive_text, image, flag, orientation } = this.props;
    return (
      <section className="content-alt">
        <div className={`content-alt__wrap ${orientation}`}>
          <div className="container">
            <div className="row">
              <div className="col-md-6 content-alt__img">
                {image && image.localFile && (
                  <figure>
                    <Img
                      fluid={image.localFile.childImageSharp.fluid || ''}
                      alt={image.alt_text}
                    />
                  </figure>
                )}
              </div>
              <div className="col-md-6">
                <div className="content-alt__text">
                  <h2>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: headline,
                      }}
                    />
                    {flag === 'us' ? (
                      <BostonFlag className="flag" viewBox="0 0 198 4" />
                    ) : (
                      <DublinFlag className="flag" viewBox="0 0 198 4" />
                    )}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: supportive_text,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ImageTextPairing;

export const imageTextPairingFragment = graphql`
  fragment ImageTextPairingBostonFragment on imageTextPairing_11 {
    headline
    flag
    supportive_text
    image {
      ...WpMediaFragmentFluid1440
    }
  }
  fragment ImageTextPairingDublinFragment on imageTextPairing_12 {
    headline
    flag
    supportive_text
    image {
      ...WpMediaFragmentFluid1440
    }
  }
`;
