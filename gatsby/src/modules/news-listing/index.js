import React, { Component } from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import { htmlentities, formatDate } from '../../utils';
import DefiantlyHumanCallOut from '../defiantly-human-call-out';
import './main.scss';
import { ReactComponent as NewTabIcon } from '../_global/images/icon-new-tab.svg';
import NewsletterCapture from '../newsletter-capture';
import { Transition } from 'react-transition-group';
import Blob from '../../components/blob';

const renderPost = ({ node: post }, i = 0, state = {}) => {
  const filterType = post.acf.internal_external;
  const colWidth = post.acf.featured ? 8 : filterType === 'external' ? 4 : 6;
  const postClassName = post.acf.featured ? 'featured' : '';
  const url =
    filterType === 'external' ? post.acf.external_link : `/news/${post.slug}`;
  const pageStartIndex = (state.page - 1) * state.postsPerPage - 4;
  const postStyle = {
    transitionDelay: `${i > pageStartIndex ? 0.03 * (i - pageStartIndex) : 0}s`,
  };
  return (
    <Transition
      in={!state.transitioning}
      timeout={ANIMATION_TIME}
      appear={true}
      key={post.id}
      onEnter={node => node.scrollTop}
    >
      {postState => {
        return (
          <div
            className={`col-md-${colWidth} news-post ${postState}`}
            style={postStyle}
          >
            <article className={postClassName}>
              <h4 className="eyebrow">News</h4>
              <h3>
                {filterType === 'external' ? (
                  <a
                    href={url}
                    title={htmlentities.decode(post.title)}
                    dangerouslySetInnerHTML={{ __html: post.title }}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ) : (
                  <Link
                    to={url}
                    title={htmlentities.decode(post.title)}
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                )}
              </h3>
              <div className="news-link">
                {filterType === 'external' ? (
                  <a
                    href={url}
                    title=""
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <NewTabIcon className="icn" viewBox="0 0 18 18" />
                    <span>{post.acf.source}</span>
                  </a>
                ) : (
                  <p className="news-description">{post.acf.description}</p>
                )}
                <time dateTime={post.acf.date}>
                  {formatDate(post.acf.date)}
                </time>
              </div>
            </article>
          </div>
        );
      }}
    </Transition>
  );
};

const NEWS_FILTER = {
  ALL: 'all',
  NEWS: 'news',
  FEATURES: 'features',
};

const ANIMATION_TIME = 200;

class NewsListingDisplay extends Component {
  state = {
    featuredPost: null,
    postListing: [],
    currentFilter: NEWS_FILTER.ALL,
    page: 1,
    postsPerPage: 8,
    transitioning: false,
  };
  postDateCutoff = (() => {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 2);
    return cutoff;
  })();
  componentDidMount() {
    const {
      allWordpressPost: { edges: posts },
    } = this.props;
    const sortedPosts = posts.sort(({ node: postA }, { node: postB }) => {
      return new Date(postA.acf.date) < new Date(postB.acf.date);
    });
    const featuredIndex = sortedPosts.findIndex(
      ({ node: post }) => post.acf.featured
    );
    this.setState(state => ({
      ...state,
      featuredPost: sortedPosts[featuredIndex],
      postListing: sortedPosts.filter((p, i) => i !== featuredIndex),
    }));
  }
  changeFilter = e => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const newFilter = e.target.dataset.filterName;

    if (newFilter === this.state.currentFilter) return;

    if (Object.values(NEWS_FILTER).findIndex(f => f === newFilter) < 0) {
      console.warn(`Cannot switch to filter ${newFilter}`);
      return;
    }

    this.setState(
      state => ({
        ...state,
        transitioning: true,
      }),
      () => {
        setTimeout(() => {
          this.setState(
            state => ({
              ...state,
              currentFilter: newFilter,
              page: 1,
            }),
            () => {
              this.setState(state => ({
                ...state,
                transitioning: false,
              }));
            }
          );
        }, ANIMATION_TIME);
      }
    );
  };
  nextPage = e => {
    e.preventDefault();
    this.setState(state => ({
      ...state,
      page: state.page + 1,
    }));
  };
  render() {
    const {
      postListing: unfilteredPosts,
      featuredPost,
      currentFilter,
      postsPerPage,
      page,
    } = this.state;
    const filteredPosts = unfilteredPosts.filter(({ node: post }) => {
      if (post.acf.date && new Date(post.acf.date) < this.postDateCutoff) {
        return false;
      }

      if (currentFilter === NEWS_FILTER.ALL) return true;
      if (
        currentFilter === NEWS_FILTER.NEWS &&
        post.acf.internal_external === 'external'
      )
        return true;
      if (
        currentFilter === NEWS_FILTER.FEATURES &&
        post.acf.internal_external === 'internal'
      )
        return true;
      return false;
    });
    const posts = filteredPosts.slice(0, page * postsPerPage);
    const hasNextPage = posts.length < filteredPosts.length;

    return (
      <section className="news">
        <div className="container">
          <ul className="filter">
            {Object.values(NEWS_FILTER).map(filterName => (
              <li key={filterName}>
                <a
                  href={`#${filterName}`}
                  title={filterName}
                  className={currentFilter === filterName ? 'active' : ''}
                  data-filter-name={filterName}
                  onClick={this.changeFilter}
                >
                  {filterName}
                </a>
              </li>
            ))}
          </ul>
          <div className="row news-row">
            {currentFilter === NEWS_FILTER.ALL &&
              featuredPost &&
              renderPost(featuredPost)}
            {posts
              .slice(0, currentFilter === NEWS_FILTER.ALL ? 3 : 4)
              .map((post, i) => renderPost(post, i, this.state))}
            <DefiantlyHumanCallOut {...this.props.defiantlyHumanCallout} />
            {posts
              .slice(currentFilter === NEWS_FILTER.ALL ? 3 : 4)
              .map((post, i) => renderPost(post, i, this.state))}
            {hasNextPage && (
              <div className="col-md-4 filter-load">
                <a
                  href="#load-more"
                  className="load-more"
                  onClick={this.nextPage}
                >
                  <span className="load-more-text">load more</span>
                  <Blob
                    blobToBeDisplayed="loadMoreBlob"
                    phaseTwoPath="M2.46072 38.5c-9.4891 30.67173 23.34516 61.17297 56.73841 57.79179 33.39325-3.38119 69.80343-22.89571 69.80343-54.33692 0-31.44121-16.02906-52.90044-55.35187-35.74628C34.32788 23.36275 11.94982 7.82827 2.46072 38.5z"
                    phaseThreePath="M11 81.14913c17.27754 11.87968 27.3554-13.62828 60.35897-9.11246 33.00358 4.51581 47.40417-2.58216 47.40417-34.02337 0-31.44121-43.57646-48.33539-82.89928-31.18123C-3.45894 23.98623-6.27754 69.26944 11 81.14913z"
                  />
                </a>
              </div>
            )}
            <NewsletterCapture {...this.props.newsletterCapture} />
          </div>
        </div>
      </section>
    );
  }
}

const newsListingRender = props => <NewsListingDisplay {...props} />;

class NewsListing extends Component {
  render() {
    return (
      <StaticQuery
        query={graphql`
          query {
            allWordpressPost {
              edges {
                node {
                  id
                  wordpress_id
                  title
                  slug
                  type
                  excerpt
                  categories {
                    slug
                  }
                  acf {
                    internal_external
                    external_link
                    date
                    source
                    featured
                    description
                  }
                }
              }
            }
          }
        `}
        render={data => newsListingRender({ ...data, ...this.props })}
      />
    );
  }
}

export default NewsListing;
