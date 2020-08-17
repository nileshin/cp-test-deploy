import React, { Component } from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import './main.scss';

class PressModule extends Component {
  render() {
    const { eyebrow, title, cta, image } = this.props;
    return (
      <section className="press bg-img page-sec">
        {image && image.localFile && (
          <Img
            fluid={image.localFile.childImageSharp.fluid}
            className="content-tile-bg"
            alt={image.alt_text}
            style={{ position: 'absolute' }}
          />
        )}
        <div className="container">
          <div className="row">
            <div className="col-md-10">
              <h4 className="eyebrow">{eyebrow}</h4>
              <h2>
                {title.replace(/\.$/, '')}
                <span className="highlight">.</span>
              </h2>
              {cta &&
                (cta.url.search(/https?:\/\//) >= 0 ? (
                  <a
                    href={cta.url}
                    title={cta.title}
                    target={cta.target}
                    className="cta"
                  >
                    {cta.title}
                  </a>
                ) : (
                  <Link
                    to={cta.url}
                    title={cta.title}
                    className="cta"
                    target={cta.target}
                  >
                    {cta.title}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default PressModule;

export const pressModuleFragment = graphql`
  fragment PressModuleFragment on pressModule_2 {
    eyebrow
    title
    cta {
      title
      url
      target
    }
    image {
      ...WpMediaFragmentFluid1440
    }
  }
`;
