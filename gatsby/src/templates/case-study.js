import React, { Component } from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import SingleMedia from '../modules/single-media';
import TraditionalCarousel from '../modules/traditional-carousel';
import WorkDetailIntro from '../modules/work-detail-intro';
import StatLongFactRow from '../modules/stat-long-fact-row';
import RichMediaHeader from '../modules/rich-media-header';
import StatRow from '../modules/stat-row';
import get from 'lodash.get';
import CTATiles from '../modules/cta-tiles';
import './work-detail.scss';

// const getCtaProps = (work, cta_title) => {
//   if (!work) return {};

//   return {
//     headline: work.title,
//     cta: {
//       title: cta_title,
//       url: `/work/${work.slug}`,
//       target: '',
//     },
//     image: get(work, 'acf.prevnext_image'),
//   };
// };

class CaseStudy extends Component {
  render() {
    const {
      data: { wordpressWpCaseStudies: work },
    } = this.props;

    // const workIndex = allWork.edges.findIndex(
    //   ({ node: w }) => w.id === work.id
    // );
    // const prevWork =
    //   workIndex > 0
    //     ? allWork.edges[workIndex - 1].node
    //     : allWork.edges[allWork.edges.length - 1].node;
    // const nextWork =
    //   workIndex < allWork.edges.length - 1
    //     ? allWork.edges[workIndex + 1].node
    //     : allWork.edges[0].node;

    // const cta_tiles_props = {
    //   left_cta: getCtaProps(prevWork, 'Previous'),
    //   right_cta: getCtaProps(nextWork, 'Next'),
    // };

    return (
      <>
        <SEO {...work.yoast_meta} {...work.cp_meta.yoast_social} />

        <section className={`work-detail ${work.slug}`}>
          <RichMediaHeader {...work.acf.rich_media_header.rich_media_header} />
          {work.acf.case_study_content_case_studies &&
            work.acf.case_study_content_case_studies.map((module_content, i) => {
              switch (module_content.__typename) {
                case 'WordPressAcf_single_media': {
                  return (
                    <SingleMedia
                      {...module_content.single_media}
                      key={module_content.id}
                    />
                  );
                }
                case 'WordPressAcf_traditional_carousel': {
                  return (
                    <TraditionalCarousel
                      {...module_content.traditional_carousel}
                      key={module_content.id}
                    />
                  );
                }
                case 'WordPressAcf_case_study_intro': {
                  return (
                    <WorkDetailIntro
                      {...module_content.work_detail_intro}
                      key={module_content.id}
                    />
                  );
                }
                case 'WordPressAcf_stat_long_fact_row': {
                  return (
                    <StatLongFactRow
                      {...module_content.stat_long_fact_row}
                      key={module_content.id}
                    />
                  );
                }
                case 'WordPressAcf_stat_row': {
                  return (
                    <StatRow
                      {...module_content.stat_row}
                      key={module_content.id}
                    />
                  );
                }
                case 'WordPressAcf_rte': {
                  return (
                    <section
                      className="work-detail-rte"
                      key={module_content.id}
                    >
                      <div className="container">
                        <div
                          className="rte-body"
                          dangerouslySetInnerHTML={{
                            __html: module_content.rte_body,
                          }}
                        />
                      </div>
                    </section>
                  );
                }
                default: {
                  return (
                    <pre key={i}>
                      <code>{JSON.stringify(module_content, null, 1)}</code>
                    </pre>
                  );
                }
              }
            })}
          {/* <CTATiles {...cta_tiles_props} htmlTitles /> */}
        </section>
      </>
    );
  }
}

export default CaseStudy;

export const query = graphql`
  query($id: String!) {
    wordpressWpCaseStudies(id: { eq: $id }) {
      id
      title
      slug
      ...YoastMetadataFragmentCaseStudies
      acf {
        client_name
        rich_media_header {
          ...RichMediaHeaderCaseFragment
        }
        case_study_content_case_studies {
          __typename
          ... on WordPressAcf_single_media {
            id
            single_media {
              ...SingleMediaFragment
            }
          }
          ... on WordPressAcf_traditional_carousel {
            id
            traditional_carousel {
              ...TraditionalCarouselFragment
            }
          }
          ... on WordPressAcf_case_study_intro {
            id
            work_detail_intro {
              ...CaseStudyIntroFragment
            }
          }
          ... on WordPressAcf_stat_long_fact_row {
            id
            stat_long_fact_row {
              ...StatLongFactRowFragment
            }
          }
          ... on WordPressAcf_stat_row {
            id
            stat_row {
              ...StatRowFragmentWorkDetail
            }
          }
          ... on WordPressAcf_rte {
            id
            rte_body
          }
        }
      }
    }
  }
`;
