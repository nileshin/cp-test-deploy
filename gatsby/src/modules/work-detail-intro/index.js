import React, { Component } from 'react';
import Img from 'gatsby-image';
import { graphql } from 'gatsby';
// import { nominalTypeHack } from 'prop-types';

import './main.scss';

class WorkDetailIntro extends Component {
  render() {
    const { title, body_copy, image } = this.props;

    return (
      <section className="intro-work">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="intro-work__content">
                <h2
                  dangerouslySetInnerHTML={{
                    __html: title,
                  }}
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html: body_copy,
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 intro-work__img">
              {image && image.localFile ? (
                <figure>
                  <Img
                    fluid={image.localFile.childImageSharp.fluid}
                    alt={image.alt_text}
                    className="cover"
                  />
                </figure>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default WorkDetailIntro;

export const workDetailIntroFragment = graphql`
  fragment WorkDetailIntroFragment on workDetailIntro_6 {
    title
    body_copy
    image {
      ...WpMediaFragmentFluid1440
    }
  }
  fragment CaseStudyIntroFragment on workDetailIntro_7 {
    title
    body_copy
    image {
      ...WpMediaFragmentFluid1440
    }
  }
`;
