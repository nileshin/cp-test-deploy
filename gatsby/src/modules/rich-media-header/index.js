import React, { Component } from 'react';
import Img from 'gatsby-image';
import { graphql } from 'gatsby';

import './main.scss';

class RichMediaHeader extends Component {
  render() {
    const { lightdark_mode, project_title, image, client_name } = this.props;
    return (
      <section
        className={`banner-full bg-cover ${!lightdark_mode && 'dark-mode'}`}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-6">
              <div className="banner-full__content">
                <small className="small-head">{client_name}</small>
                <h1
                  dangerouslySetInnerHTML={{
                    __html: project_title,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {image && image.localFile ? (
          <Img
            fluid={image.localFile.childImageSharp.fluid}
            alt={image.alt_text}
            className="cover"
          />
        ) : null}
      </section>
    );
  }
}

export default RichMediaHeader;

export const RichMediaHeaderFragment = graphql`
  fragment RichMediaHeaderFragment on richMediaHeader_21 {
    rich_media_header {
      lightdark_mode
      client_name
      project_title
      client_name
      image {
        ...WpMediaFragmentFluid1440
      }
    }
  }
  fragment RichMediaHeaderCaseFragment on richMediaHeader_23 {
    rich_media_header {
      lightdark_mode
      client_name
      project_title
      client_name
      image {
        ...WpMediaFragmentFluid1440
      }
    }
  }
`;
