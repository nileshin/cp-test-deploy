import React, { Component } from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import Transition from 'react-transition-group/Transition';
import Blob from '../../components/blob';
import shuffle from 'lodash.shuffle';
import get from 'lodash.get';
import './main.scss';

const PEOPLE_FILTERS = {
  ALL: 'all',
  BOSTON: 'boston',
  DUBLIN: 'dublin',
};

const DUBLIN_DEPT = 'CP Dublin';
const ANIMATION_TIME = 200;
const ANIMATION_DELAY_FACTOR = 0.03;

class PeopleGrid extends Component {
  state = {
    page: 1,
    postsPerPage: 20,
    filter: PEOPLE_FILTERS.ALL,
    fullPeopleList: [],
    transitioning: false,
  };
  componentDidMount() {
    this.setState(state => {
      const {
        data: {
          allWordpressWpPeople: { edges },
        },
      } = this.props;
      return {
        ...state,
        fullPeopleList: shuffle(edges),
      };
    });
  }

  changeFilter = e => {
    e.preventDefault();
    const newFilter = e.currentTarget.getAttribute('title');
    if (newFilter === this.state.filter) return;
    if (Object.values(PEOPLE_FILTERS).indexOf(newFilter.toLowerCase()) >= 0) {
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
                filter: newFilter,
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
    } else {
      console.warn(`Cannot apply filter: `, newFilter);
    }
  };
  applyFilter = person => {
    const { filter } = this.state;
    if (filter === PEOPLE_FILTERS.ALL) return true;
    const department =
      person.node.department && person.node.department.length
        ? person.node.department[0].name
        : '';
    if (filter === PEOPLE_FILTERS.BOSTON) {
      return department && department !== DUBLIN_DEPT;
    } else if (filter === PEOPLE_FILTERS.DUBLIN) {
      return department && department === DUBLIN_DEPT;
    }
    return false;
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
      page,
      postsPerPage,
      filter,
      fullPeopleList,
      transitioning,
    } = this.state;

    const filteredPeopleList = fullPeopleList.filter(this.applyFilter);
    const people = filteredPeopleList.slice(
      0,
      Math.min(filteredPeopleList.length, page * postsPerPage - 1)
    );

    const hasNextPage = people.length !== filteredPeopleList.length;

    return (
      <section className="people filter-wrap">
        <div className="container">
          <ul className="filter">
            {Object.values(PEOPLE_FILTERS).map(filterName => (
              <li key={filterName}>
                <a
                  href={`#${filterName}`}
                  title={filterName}
                  className={filter === filterName ? 'active' : ''}
                  onClick={this.changeFilter}
                >
                  {filterName}
                </a>
              </li>
            ))}
          </ul>
          <Transition in={!transitioning} timeout={ANIMATION_TIME}>
            {listTransitionState => {
              const pageStartIndex = (page - 1) * postsPerPage;
              return (
                <div className={`people-list ${listTransitionState}`}>
                  {people.map((personNode, i) => {
                    const person = personNode.node;
                    const transitionDelay = (() => {
                      if (transitioning) return '0s';
                      return i >= pageStartIndex
                        ? `${ANIMATION_DELAY_FACTOR * (i - pageStartIndex)}s`
                        : `0s`;
                    })();
                    const photo = get(
                      person,
                      'featured_media.localFile.childImageSharp.fluid'
                    );
                    const alt_photo = get(
                      person,
                      'acf.alternate_photo.localFile.childImageSharp.fluid'
                    );
                    const alt_photo_publicURL = get(
                      person,
                      'acf.alternate_photo.localFile.publicURL'
                    );
                    const isWeb =
                      person.acf.name.toLowerCase().indexOf('eric webster') >=
                      0;
                    return (
                      <Transition
                        in={!transitioning}
                        timeout={ANIMATION_TIME}
                        appear={true}
                        key={`${person.acf.name}-${i}`}
                        onEnter={node => node.scrollTop}
                      >
                        {personTransitionState => {
                          return (
                            <div
                              className={`people-list__item filter-item ${personTransitionState}`}
                              style={{ transitionDelay }}
                            >
                              <figure>
                                {photo && (
                                  <Img
                                    fluid={photo}
                                    alt={person.acf.name}
                                    fadeIn={true}
                                    critical={true}
                                  />
                                )}
                              </figure>
                              <div className="people-list__details">
                                <h5>{person.acf.name}</h5>
                                <small className="title">
                                  {person.acf.title}
                                </small>
                              </div>
                              <figure
                                className={`alternate ${isWeb ? 'zoom' : ''}`}
                              >
                                {alt_photo && !isWeb && (
                                  <Img
                                    fluid={alt_photo}
                                    alt={person.acf.name + '_hover'}
                                    critical={true}
                                  />
                                )}
                                {(isWeb ||
                                  (!alt_photo && alt_photo_publicURL)) && (
                                  <div className="alt-container">
                                    <img
                                      src={alt_photo_publicURL}
                                      alt={person.acf.name + '_hover'}
                                    />
                                  </div>
                                )}
                              </figure>
                            </div>
                          );
                        }}
                      </Transition>
                    );
                  })}
                  {hasNextPage && (
                    <div
                      className={`people-list__item filter-load ${listTransitionState}`}
                      style={{
                        transitionDelay: transitioning
                          ? '0s'
                          : `${ANIMATION_DELAY_FACTOR * postsPerPage}s`,
                      }}
                    >
                      <a
                        href="#load-more"
                        onClick={this.nextPage}
                        className="load-more"
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
                </div>
              );
            }}
          </Transition>
        </div>
      </section>
    );
  }
}

const PeopleGridWrapper = () => (
  <StaticQuery
    query={graphql`
      query {
        allWordpressWpPeople {
          edges {
            node {
              wordpress_id
              department {
                name
              }
              acf {
                name
                title
                alternate_photo {
                  localFile {
                    publicURL
                    childImageSharp {
                      fluid {
                        ...GatsbyImageSharpFluid_noBase64
                      }
                    }
                  }
                }
              }
              featured_media {
                localFile {
                  publicURL
                  childImageSharp {
                    fluid {
                      ...GatsbyImageSharpFluid_noBase64
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => <PeopleGrid data={data} />}
  />
);

export default PeopleGridWrapper;
