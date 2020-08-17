import React, { Component } from 'react';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import './main.scss';

import { ReactComponent as NewTabIcon } from '../_global/images/icon-new-tab.svg'; 

class ContentTileWithSideImage extends Component {
  render() {
    const { eyebrow, headline, supportive_text, cta, image } = this.props;
    const headlineHTML = `${headline.replace(
      /\.$/,
      ''
    )}<span class="highlight">.</span>`;
    return (
      <div>
        <section className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-9 col-lg-6">
                <h4 className="eyebrow">{eyebrow}</h4>
                <h2 dangerouslySetInnerHTML={{ __html: headlineHTML }} />
                <div
                  className="content__text"
                  dangerouslySetInnerHTML={{ __html: supportive_text }}
                />
                {cta && (
                  cta.url.search(/https?:\/\//) >= 0 ?
                  <a href={cta.url} title={cta.title} target={cta.target} className="cta">
                    {cta.target === "_blank" && <NewTabIcon className="icn" />}
                    {cta.title}
                  </a> :
                  <Link to={cta.url} title={cta.title} className="cta">{cta.title}</Link>
                )}
              </div>
              <div className="col-md-6 intro-work__img">
                {image && image.localFile && (
                  <figure>
                    <Img
                      fluid={image.localFile.childImageSharp.fluid || ''}
                      alt={image.alt_text}
                    />
                  </figure>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default ContentTileWithSideImage;

export const contentTileWithSideImageFragment = graphql`
  fragment ContentTileWithSideImageFragment on contentTileWSideImage_10 {
    eyebrow
    headline
    supportive_text
    cta {
      title
      url
      target
    }
    image {
      localFile {
        childImageSharp {
          fluid(quality: 100) {
            ...GatsbyImageSharpFluid_tracedSVG
          }
        }
      }
    }
  }
  fragment ContentTileWithSideImageFragmentCase on contentTileWSideImage_8 {
    eyebrow
    headline
    supportive_text
    cta {
      title
      url
      target
    }
    image {
      localFile {
        childImageSharp {
          fluid(quality: 100) {
            ...GatsbyImageSharpFluid_tracedSVG
          }
        }
      }
    }
  }
`;
