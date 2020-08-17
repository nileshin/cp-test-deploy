import React, { Component } from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Header from '../modules/header';
import QuoteBlobVideoModule from '../modules/quote-blob-video-module';
import JobListings from '../modules/job-listings';

class Careers extends Component {
  render() {
    const {
      data: { wordpressPage:page, wordpressPage: { acf } },
    } = this.props;
    return (
      <>
        <SEO {...page.yoast_meta} {...page.cp_meta.yoast_social} />
        <Header {...acf.header.header} />
        <QuoteBlobVideoModule {...acf.quote_blob_video_module.quote_blob_video_module} />
        <JobListings />
      </>
    );
  }
}

export default Careers;

export const query = graphql`
  query {
    wordpressPage(slug: { eq: "careers" }) {
      id
      wordpress_id
      ...YoastMetadataFragment
      acf {
        header {
          header {
            ...HeaderFragment
          }
        }
        quote_blob_video_module {
          quote_blob_video_module {
            ...QuoteBlobVideoModuleFragment
          }
        }
      }
    }
  }
`;
