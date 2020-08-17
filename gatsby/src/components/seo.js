import React from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

const SEO = ({
  description,
  title,
  og_title,
  og_description,
  og_image,
  tw_title,
  tw_image,
  tw_description,
}) => {
  const helmetData = {
    title,
    htmlAttributes: {
      lang: 'en',
    },
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        property: `og:title`,
        content: og_title,
      },
      {
        property: `og:image`,
        content: og_image && og_image.localFile && og_image.localFile.publicURL ? og_image.localFile.publicURL : og_image,
      },
      {
        property: `og:description`,
        content: og_description,
      },
      {
        property: `og:type`,
        content: 'website',
      },
      {
        name: `twitter:card`,
        content: `summary`,
      },
      {
        name: `twitter:title`,
        content: tw_title,
      },
      {
        name: `twitter:image`,
        content: tw_image && tw_image.localFile && tw_image.localFile.publicURL ? tw_image.localFile.publicURL : tw_image,
      },
      {
        name: `twitter:description`,
        content: tw_description,
      },
    ],
  };
  helmetData.meta = helmetData.meta.filter(m => m && m.content);
  return <Helmet {...helmetData} />;
};

export default SEO;

export const yoastMetadataFragment = graphql`
  fragment YoastMetadataFragment on wordpress__PAGE {
    yoast_meta {
      title: yoast_wpseo_title
      description: yoast_wpseo_metadesc
      canonical: yoast_wpseo_canonical
    }
    cp_meta {
      yoast_social {
        og_title: yoast_wpseo_opengraph_title
        og_description: yoast_wpseo_opengraph_description
        og_image: yoast_wpseo_opengraph_image {
          localFile {
            publicURL
          }
        }
        tw_title: yoast_wpseo_twitter_title
        tw_description: yoast_wpseo_twitter_description
        tw_image: yoast_wpseo_twitter_image {
          localFile {
            publicURL
          }
        }
      }
    }
  }
  fragment YoastMetadataFragmentWork on wordpress__wp_work {
    yoast_meta {
      title: yoast_wpseo_title
      description: yoast_wpseo_metadesc
      canonical: yoast_wpseo_canonical
    }
    cp_meta {
      yoast_social {
        og_title: yoast_wpseo_opengraph_title
        og_description: yoast_wpseo_opengraph_description
        og_image: yoast_wpseo_opengraph_image {
          localFile {
            publicURL
          }
        }
        tw_title: yoast_wpseo_twitter_title
        tw_description: yoast_wpseo_twitter_description
        tw_image: yoast_wpseo_twitter_image {
          localFile {
            publicURL
          }
        }
      }
    }
  }
  fragment YoastMetadataFragmentCaseStudies on wordpress__wp_case_studies {
    yoast_meta {
      title: yoast_wpseo_title
      description: yoast_wpseo_metadesc
      canonical: yoast_wpseo_canonical
    }
    cp_meta {
      yoast_social {
        og_title: yoast_wpseo_opengraph_title
        og_description: yoast_wpseo_opengraph_description
        og_image: yoast_wpseo_opengraph_image {
          localFile {
            publicURL
          }
        }
        tw_title: yoast_wpseo_twitter_title
        tw_description: yoast_wpseo_twitter_description
        tw_image: yoast_wpseo_twitter_image {
          localFile {
            publicURL
          }
        }
      }
    }
  }
  fragment YoastMetadataFragmentNews on wordpress__POST {
    yoast_meta {
      title: yoast_wpseo_title
      description: yoast_wpseo_metadesc
      canonical: yoast_wpseo_canonical
    }
    cp_meta {
      yoast_social {
        og_title: yoast_wpseo_opengraph_title
        og_description: yoast_wpseo_opengraph_description
        og_image: yoast_wpseo_opengraph_image {
          localFile {
            publicURL
          }
        }
        tw_title: yoast_wpseo_twitter_title
        tw_description: yoast_wpseo_twitter_description
        tw_image: yoast_wpseo_twitter_image {
          localFile {
            publicURL
          }
        }
      }
    }
  }
  fragment YoastMetadataFragmentLandingPages on wordpress__wp_landing_pages {
    yoast_meta {
      title: yoast_wpseo_title
      description: yoast_wpseo_metadesc
      canonical: yoast_wpseo_canonical
    }
    cp_meta {
      yoast_social {
        og_title: yoast_wpseo_opengraph_title
        og_description: yoast_wpseo_opengraph_description
        og_image: yoast_wpseo_opengraph_image {
          localFile {
            publicURL
          }
        }
        tw_title: yoast_wpseo_twitter_title
        tw_description: yoast_wpseo_twitter_description
        tw_image: yoast_wpseo_twitter_image {
          localFile {
            publicURL
          }
        }
      }
    }
  }
`;
