import React, { Component } from 'react';
import SocialSlider from '../modules/social-slider';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Header from '../modules/header';
import ContentModuleWithStats from '../modules/content-module-with-stats';
import SectionHeader from '../modules/section-header';
import LeadershipDetailCarousel from '../modules/leadership-detail-carousel';
import StatRow from '../modules/stat-row';
import PeopleGrid from '../modules/people-grid';

class People extends Component {
  render() {
    const { data: { wordpressPage: page, wordpressPage: { acf } } } = this.props;
    return (
      <>
        <SEO {...page.yoast_meta} {...page.cp_meta.yoast_social} />
        <Header {...acf.header.header} />
        <ContentModuleWithStats {...acf.content_with_stats.content_module_with_stats} />
        <SectionHeader {...acf.leadership_header.section_header} />
        <LeadershipDetailCarousel {...acf.leadership_detail_carousel.leadership_detail_carousel} />
        <StatRow {...acf.stat_row.stat_row} options={{hasBlob: true, hasColors: true}} />
        <SectionHeader {...acf.people_grid_header.section_header} />
        <PeopleGrid />
        <SocialSlider />
      </>
    );
  }
}

export default People;

export const peopleQuery = graphql`
  query {
    wordpressPage(slug: { eq: "people" }) {
      id
      ...YoastMetadataFragment
      acf {
        header {
          header {
            ...HeaderFragment
          }
        }
        content_with_stats {
          content_module_with_stats {
            ...ContentModuleWithStatsFragment
          }
        }
        leadership_header {
          section_header {
            ...SectionHeaderLeadershipFragment
          }
        }
        leadership_detail_carousel {
          leadership_detail_carousel {
            ...LeadershipDetailCarouselFragment
          }
        }
        stat_row {
          stat_row {
            stats {
              stat_title
              stat_number
            }
          }
        }
        people_grid_header {
          section_header {
            ...SectionHeaderGridFragment
          }
        }
      }
    }
  }
`;
