import React, { Component } from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import { ReactComponent as NewTabIcon } from '../_global/images/icon-new-tab.svg'

class DefiantlyHumanCallOut extends Component {
  render() {
    const { headline, cta, image } = this.props;
    return (
      <div className="row full-bleed-parent">
        <div className="col-12 full-width bg-cover bg-dark">
          <div className="container">
            <div className="col-8 col-md-6">
              <h3>
                <a href={cta.url} title={headline} target={cta.target}>{headline}</a>
              </h3>
              <a href={cta.url} className="cta" target={cta.target}>
                <NewTabIcon className="icn" />{' '}
                {cta.title}
              </a>
              {
                image && image.localFile && <Img fluid={image.localFile.childImageSharp.fluid} className="cover" alt={headline} style={{position:"absolute"}} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DefiantlyHumanCallOut;

export const defiantlyHumanCallOutFragment = graphql`
  fragment DefiantlyHumanCallOutFragment on defiantlyHumanCallOut_8 {
    headline
    cta {
      title
      url
      target
    }
    image {
      alt_text
      localFile {
        childImageSharp {
          fluid(maxWidth: 1440, quality: 90) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
  }
`