import React, { Component } from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Header from '../modules/header';
import BlobVideo from '../modules/blob-video';
import WorkTiles from '../modules/work-tiles';
import CTATiles from '../modules/cta-tiles';
import LogoGrid from '../modules/logo-grid';

class Work extends Component {
  render() {
    const { data: { wordpressPage: page, wordpressPage: { acf } } } = this.props;

    return (
      <>
        <SEO {...page.yoast_meta} {...page.cp_meta.yoast_social} />
        <section className={`work-landing page-${page.slug}`}>
          <Header {...acf.header.header} />
          <BlobVideo {...acf.blob_video.blob_video} />
          <WorkTiles {...acf.work_tiles} />
          <LogoGrid {...acf.logo_grid.logo_grid} />
          <CTATiles {...acf.cta_tiles.cta_tiles} />
        </section>
      </>
    );
  }
}

export default Work;

export const query = graphql`
  query {
    wordpressPage(slug: { eq: "work" }) {
      id
      wordpress_id
      slug
      ...YoastMetadataFragment
      acf {
        header {
          header {
          ...HeaderFragment
          }
        }
        blob_video {
          blob_video {
            ...BlobVideoFragment
          }
        }
        work_tiles {
         ...WorkTilesFragment 
        }
        logo_grid {
          logo_grid {
            ...LogoGridFragment
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