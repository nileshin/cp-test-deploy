import React, { Component } from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Header from '../modules/header';
import BlobVideoWithTextCTAs from '../modules/blob-video-text-ctas';
import WorkTilesNoFilter from '../modules/work-tiles-no-filter';
import LogoGrid from '../modules/logo-grid';
import ContentTileWithSideImage from '../modules/content-tile-w-side-image';

class LandingPages extends Component {
  render() {
    const { data: { 
            wordpressWpLandingPages: page, 
            wordpressWpLandingPages: { acf },
            allWordpressWpCaseStudies: allCaseStudies
          } } = this.props;

    return (
      <>
        <SEO {...page.yoast_meta} {...page.cp_meta.yoast_social} />
        <section className={`category-landing page-${page.slug}`}>
          {acf.landing_page_content_landing_pages.length && 
            acf.landing_page_content_landing_pages.map(field => {
              switch (field.__typename) {
                case 'WordPressAcf_header': {
                  return (
                    <Header 
                      {...field.header} 
                      key={field.id} 
                    />
                  );
                }
                case 'WordPressAcf_blob_video_w_text_ctas': {
                  return (
                    <BlobVideoWithTextCTAs 
                      {...field.blob_video_w_text_ctas} 
                      key={field.id} 
                    />
                  );                
                }
                case 'WordPressAcf_case_tiles': {
                  return (
                    <WorkTilesNoFilter 
                      {...field.case_tiles}
                      allCaseStudies={allCaseStudies}
                      key={field.id} 
                    />
                  );
                }
                case 'WordPressAcf_logo_grid': {
                  return (
                    <LogoGrid 
                      {...field.logo_grid} 
                      key={field.id} 
                    />
                  );
                }
                case 'WordPressAcf_text__image_module': {
                  return (
                    <ContentTileWithSideImage 
                      {...field.content_tile_w_side_image} 
                      key={field.id} 
                    />
                  );
                }
              }
          })}
        </section>
      </>
    );
  }
}

export default LandingPages;

export const query = graphql`
  query($id: String!) {
    wordpressWpLandingPages(id: { eq: $id }) {
      id
      wordpress_id
      slug
      ...YoastMetadataFragmentLandingPages
      acf {
        landing_page_content_landing_pages {
          __typename
          ... on WordPressAcf_header {
            id
            header {
              ...HeaderFragmentCase
            }
          }
          ... on WordPressAcf_blob_video_w_text_ctas {
            id
            blob_video_w_text_ctas {
              ...BlobVideoWithTextCTAsFragment
            }
          }
          ... on WordPressAcf_case_tiles {
            id
            case_tiles {
              ...WorkTilesNoFilterFragment 
            }
          }
          ... on WordPressAcf_text__image_module {
            id
            content_tile_w_side_image {
              ...ContentTileWithSideImageFragmentCase
            }
          }
          ... on WordPressAcf_logo_grid {
            id
            logo_grid {
              ...LogoGridFragmentCase
            }
          }
        }
      }
    }
    allWordpressWpCaseStudies {
      edges {
        node {
          wordpress_id
          acf {
            client_name
            rich_media_header {
              rich_media_header {
                project_title
              }
            }
          }
        }
      }
    }
  }
`;