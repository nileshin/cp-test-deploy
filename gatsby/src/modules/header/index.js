import React, { Component } from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import './main.scss';
import get from 'lodash.get';

class Header extends Component {
  render() {
    const { page_name, image } = this.props;
    if (!page_name && !image) return false;
    return (
      <section id="maincontent" className="page-banner bg-img">
        {get(image, 'localFile.childImageSharp.fluid') && (
          <Img
            fluid={get(image, 'localFile.childImageSharp.fluid') || ''}
            className="header-bg-img"
            style={{ position: 'absolute' }}
          />
        )}
        <div className="container">
          <h1>{page_name}</h1>
        </div>
      </section>
    );
  }
}

export default Header;

export const headerFragment = graphql`
  fragment HeaderFragment on header_10 {
    page_name
    image {
      ...WpMediaFragmentFluid1440
    }
  }
  fragment HeaderFragmentCase on header_8 {
    page_name
    image {
      ...WpMediaFragmentFluid1440
    }
  }
`;
