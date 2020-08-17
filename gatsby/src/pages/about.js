import React, { Component } from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Header from '../modules/header';
import ContentTileWithSideImage from '../modules/content-tile-w-side-image';
import ImageTextPairing from '../modules/image-text-pairing';
import CTATiles from '../modules/cta-tiles';
import CapabilitiesTiles from '../modules/capabilities-tiles';

class About extends Component {
  render() {
    const { data: { wordpressPage: page, wordpressPage: { acf } } } = this.props;
    return (<>
      <SEO {...page.yoast_meta} {...page.cp_meta.yoast_social} />
      <Header {...acf.header.header} />
      <ContentTileWithSideImage {...acf.defiantly_human_section.content_tile_w_side_image} />
      <ImageTextPairing {...acf.why_boston_section.image_text_pairing} orientation="right" />
      <ImageTextPairing {...acf.why_dublin_section.image_text_pairing} orientation="left" />
      <CapabilitiesTiles {...acf.capabilities.capabilities_tiles} />
      <CTATiles {...acf.cta_tiles.cta_tiles} />
    </>);
  }
}

export default About;

export const query = graphql`
  query {
    wordpressPage(slug: { eq: "about" }) {
      id
      wordpress_id
      ...YoastMetadataFragment
      acf {
        header {
          header {
            ...HeaderFragment
          }
        }
        defiantly_human_section {
          content_tile_w_side_image {
            ...ContentTileWithSideImageFragment
          }
        }
        why_boston_section {
          image_text_pairing {
            ...ImageTextPairingBostonFragment
          }
        }
        why_dublin_section {
          image_text_pairing {
            ...ImageTextPairingDublinFragment
          }
        }
        capabilities {
          capabilities_tiles {
            ...CapabilitiesTilesFragment
          }
        }
        cta_tiles {
          cta_tiles {
            ...CTATileFragment
          }
        }
      }
    }
  }
`;
