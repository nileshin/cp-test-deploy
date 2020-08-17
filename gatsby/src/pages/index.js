import React from 'react';
import { graphql } from 'gatsby';

import SEO from '../components/seo';
import HomeHeader from '../modules/home-header';
import ContentTile from '../modules/content-tile';
import PressModule from '../modules/press-module';
import CTATiles from '../modules/cta-tiles';

const Home = ({ data }) => {
  const { wordpressPage: page } = data;
  return (
    <>
      <SEO {...page.yoast_meta} {...page.cp_meta.yoast_social} />
      <section className="home">
        <HomeHeader {...page.acf.home_header.home_header} />
        {page.acf.featured_content_page.map(module_content => {
          if (module_content.__typename === 'WordPressAcf_content_tile') {
            return (
              <ContentTile
                {...module_content.content_tile}
                key={module_content.id}
              />
            );
          } else if (
            module_content.__typename === 'WordPressAcf_press_module'
          ) {
            return (
              <PressModule
                {...module_content.press_module}
                key={module_content.id}
              />
            );
          }
          return null;
        })}
        <CTATiles {...page.acf.cta_tiles.cta_tiles} />
      </section>
    </>
  );
};

export default Home;

export const query = graphql`
  query {
    wordpressPage(slug: { eq: "home" }) {
      title
      content
      ...YoastMetadataFragment
      acf {
        home_header {
          home_header {
            ...HomeHeaderFragment
          }
        }
        featured_content_page {
          ... on WordPressAcf_press_module {
            id
            press_module {
              ...PressModuleFragment
            }
          }
          ... on WordPressAcf_content_tile {
            id
            content_tile {
              ...ContentTileFragment
            }
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
