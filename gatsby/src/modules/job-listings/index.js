import React, { Component } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { Transition } from 'react-transition-group';
import './main.scss';
import debounce from 'lodash.debounce';

import { ReactComponent as NewTabIcon } from '../_global/images/icon-new-tab.svg';
import { stringExcerpt } from '../../utils';

const DEFAULT_URL_TITLE = 'Apply Now';
const ANIMATION_TIME = 400;

class JobListingsDisplay extends Component {
  state = {
    currentFilter: 'all',
    transitioning: false,
    screen_size: 'sm',
  };
  updateFilter = e => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    const newFilter = e.target.dataset.location;
    if (newFilter === this.state.currentFilter) return;

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
            }),
            () => {
              setTimeout(() => {
                this.setState(state => ({
                  ...state,
                  transitioning: false,
                }));
              }, 50);
            }
          );
        }, ANIMATION_TIME);
      }
    );
  };
  updateScreenSize = () => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const screen_size = (() => {
      if (width > 1112) return 'lg';
      if (width > 768) return 'md';
      return 'sm';
    })();

    this.setState(state => ({
      ...state,
      screen_size,
    }));
  };
  setFilterBasedOnHash = () => {
    if (window.location.hash) {
      this.setState(
        state => ({
          ...state,
          currentFilter: window.location.hash.substring(1)
        })
      )
    }
  }
  componentDidMount() {
    if (typeof window === 'undefined') return;

    this.setFilterBasedOnHash();
    window.addEventListener('resize', debounce(this.updateScreenSize, 100));
    this.updateScreenSize();
  }
  render() {
    const {
      allWordpressWpJobs: { edges: jobs },
      allWordpressWpJobLocation: { edges: locations },
    } = this.props;
    const { currentFilter, transitioning, screen_size } = this.state;
    const filteredJobs = currentFilter === 'all' ? jobs : 
      jobs.filter(
        ({ node: job }) =>
          Array.isArray(job.job_location) &&
          job.job_location[0].slug === currentFilter
      );

    // these values come from CP30-42
    const description_cutoffs = {
      sm: 161, // 0-768
      md: 243, // 769-1112
      lg: 332, // 1113+
    };

    return (
      <section className="jobs">
        <div className="container">
          <h3 className="alt">Jobs in</h3>
          <ul className="tabs">
            <li
              className={`tab ${
                `all` === currentFilter ? 'tab--active' : ''
              }`}
              key={`all`}
            >
              <a
                href={`#all`}
                title={`all`}
                onClick={this.updateFilter}
                data-location={`all`}
              >
                All
              </a>
            </li>
            {locations.map(({ node: location }) => (
              <li
                className={`tab ${
                  location.slug === currentFilter ? 'tab--active' : ''
                }`}
                key={location.slug}
              >
                <a
                  href={`#${location.slug}`}
                  title={location.name}
                  onClick={this.updateFilter}
                  data-location={location.slug}
                >
                  {location.name.split(',')[0]}
                </a>
              </li>
            ))}
          </ul>
          <div className="tabs-content-wrap">
            <Transition in={!transitioning} timeout={ANIMATION_TIME}>
              {tabState => (
                <div className={`tabs-content ${tabState}`}>
                  {filteredJobs.map(({ node: job }) => {
                    const {
                      job_location,
                      acf: {
                        job_posting: { job_posting },
                      },
                    } = job;
                    const {
                      position_title: title,
                      posting_description: description,
                      applicant_stack_link: {
                        url: applicant_stack_url,
                        title: url_title,
                      },
                    } = job_posting;
                    return (
                      <article className="job row" key={job.id}>
                        <div className="col-md-4 job__title">
                          <h3 className="alt">
                            <a
                              href={applicant_stack_url}
                              title={url_title || DEFAULT_URL_TITLE}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {title}
                            </a>
                          </h3>
                          <p>
                            {Array.isArray(job_location) &&
                              job_location[0].name}
                          </p>
                        </div>
                        <div className="col-md-8 job__overview">
                          <p
                            dangerouslySetInnerHTML={{
                              __html: stringExcerpt(
                                description,
                                description_cutoffs[screen_size]
                              ),
                            }}
                          />
                        </div>
                        <div className="col-12">
                          <a
                            href={applicant_stack_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={url_title || DEFAULT_URL_TITLE}
                            className="cta"
                          >
                            <NewTabIcon
                              className="svg-convert icn"
                              alt="open in new tab"
                              viewBox="0 0 18 18"
                            />
                            <span>{url_title || DEFAULT_URL_TITLE}</span>
                          </a>
                        </div>
                      </article>
                    );
                  })}
                  {!filteredJobs.length && (
                    <article className="job row">
                      <div className="message">
                        Check back soon for more opportunities!
                      </div>
                    </article>
                  )}
                </div>
              )}
            </Transition>
          </div>
        </div>
      </section>
    );
  }
}

const jobListingRender = props => {
  return <JobListingsDisplay {...props} />;
};

class JobListings extends Component {
  render() {
    return (
      <StaticQuery
        query={graphql`
          query {
            allWordpressWpJobs {
              edges {
                node {
                  id
                  wordpress_id
                  job_location {
                    wordpress_id
                    slug
                    name
                  }
                  acf {
                    job_posting {
                      job_posting {
                        position_title
                        posting_description
                        applicant_stack_link {
                          title
                          url
                        }
                      }
                    }
                  }
                }
              }
            }
            allWordpressWpJobLocation {
              edges {
                node {
                  slug
                  name
                }
              }
            }
          }
        `}
        render={jobListingRender}
      />
    );
  }
}

export default JobListings;
