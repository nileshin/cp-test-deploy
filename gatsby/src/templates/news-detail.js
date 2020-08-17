import React, { Component } from 'react';
import { graphql, Link } from 'gatsby';
import TraditionalCarousel from '../modules/traditional-carousel';
import { formatDate } from '../utils';
import SEO from '../components/seo';
import './news-detail.scss';
import CTATiles from '../modules/cta-tiles';

import { ReactComponent as BackArrowIcon } from '../modules/_global/images/icon-arrow.svg';

class NewsDetail extends Component {
  render() {
    const {
      data: {
        wordpressPost: {
          title,
          yoast_meta,
          cp_meta,
          acf: { date, article_content_post: article_content, cta_tiles },
        },
      },
    } = this.props;
    return (
      <>
        <SEO {...yoast_meta} {...cp_meta.yoast_social} />
        <section className="news-details">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="news-details__title">
                  <Link to="/news" title="Back to News" className="back-news">
                    <BackArrowIcon alt="Back to News" class="icn" /> Back to
                    News
                  </Link>
                  <h2 dangerouslySetInnerHTML={{__html: `${title}`}} />
                  <time className="news-date" datetime={date}>
                    {formatDate(date)}
                  </time>
                </div>
              </div>
              <div className="col-12">
                <div className="news-content">
                  {article_content.map(content => {
                    switch (content.__typename) {
                      case 'WordPressAcf_rte': {
                        return (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: content.rte_copy,
                            }}
                          />
                        );
                      }
                      case 'WordPressAcf_traditional_carousel': {
                        return (
                          <TraditionalCarousel
                            {...content.traditional_carousel}
                          />
                        );
                      }
                      default: {
                        console.warn(
                          'News Detail content without a template: ',
                          content.__typename
                        );
                        return null;
                      }
                    }
                  })}
                </div>

                <Link to="/news" title="Back to News" className="back-news">
                  <BackArrowIcon alt="Back to News" class="icn" /> Back to News
                </Link>
              </div>
            </div>
          </div>
        </section>
        {cta_tiles ? <CTATiles {...cta_tiles.cta_tiles} /> : null}
      </>
    );
  }
}

export default NewsDetail;

export const query = graphql`
  query($id: String!) {
    wordpressPost(id: { eq: $id }) {
      id
      wordpress_id
      slug
      title
      ...YoastMetadataFragmentNews
      acf {
        date
        article_content_post {
          __typename
          ... on WordPressAcf_rte {
            rte_copy
          }
          ... on WordPressAcf_traditional_carousel {
            traditional_carousel {
              ...TraditionalCarouselFragment
            }
          }
        }
        cta_tiles {
          cta_tiles {
            ...CTATileFragmentNewsDetail
          }
        }
      }
    }
  }
`;
