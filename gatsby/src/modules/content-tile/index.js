import React, { Component } from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import './main.scss';

class ContentTile extends Component {
  render() {
    const { eyebrow, headline, supportive_text, cta, image } = this.props;
    return (
      <section className="latest bg-dark bg-img page-sec overflow-hidden">
        {image && image.localFile && (
          <Img
            fluid={image.localFile.childImageSharp.fluid}
            className="content-tile-bg cover"
            alt={image.alt_text}
            style={{ position: 'absolute' }}
          />
        )}
        <div className="container">
          <div className="row">
            <div className="col-8 col-md-6">
              <h4 className="eyebrow">{eyebrow}</h4>
              <h2>
                {headline.trim().replace(/\.$/, '')}
                <span className="highlight">.</span>
              </h2>
              <p>{supportive_text}</p>
              {cta &&
                (cta.url.search(/https?:\/\//) >= 0 ? (
                  <a
                    href={cta.url}
                    title={cta.title}
                    className="cta"
                    target={cta.target}
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

export default ContentTile;

export const contentTileFragment = graphql`
  fragment ContentTileFragment on contentTile_2 {
    eyebrow
    headline
    supportive_text
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
