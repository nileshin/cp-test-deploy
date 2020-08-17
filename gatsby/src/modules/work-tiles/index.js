import React, { Component } from 'react';
import { graphql, Link } from 'gatsby';
import { passiveIfSupported } from '../../utils';
import './main.scss';
import get from 'lodash.get';


// finding a node's ancestor of a certain class
// https://stackoverflow.com/questions/22119673/find-the-closest-ancestor-element-that-has-a-specific-class
function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

const WORK_FILTERS = {
  ALL: 'featured',
  BOSTON: 'boston',
  DUBLIN: 'dublin',
};

const renderTiles = filteredList => {
  return filteredList.work_tiles.tiles.map((tile, index) => {
    let { project_title, client_name } = tile.override_fields || {};
    if (!project_title) project_title = get(tile, 'work_piece.acf.rich_media_header.rich_media_header.project_title') || '';
    if (!client_name) client_name = get(tile, 'work_piece.acf.client_name') || '';
    const { post_type, post_name:slug } = tile.work_piece || {}
    const direction = index % 2 === 0 ? 'left' : 'right';
    const angleType = index % 4 === 0 || index % 4 === 1 ? 'connected' : 'reverse';
    return (
      <Link to={`/${post_type}/${slug}`} title={project_title} className={`work-tile filter-item ${direction} ${angleType}`} data-filter-content={filteredList.filter_name} key={slug}>
        <div className="container">
          <div className="row">
            <figure className="work-tile__img col-6">
              <img src={get(tile, 'image.localFile.childImageSharp.original.src') || ''} alt="" className="cover" />
            </figure>
            <div className="work-tile__details col-6">
              <span className="work-tile__client">{client_name}</span>
              <h3>{project_title}</h3>
              <span className="cta">{tile.cta_text}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  })
}

// NB: This module represents all work, and will handle filtering as well.
class WorkTiles extends Component {
  state = {
    currentFilter: WORK_FILTERS.ALL,
  };
  componentDidMount() {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', this.handleScroll, passiveIfSupported)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll = e => {
    if (typeof window === 'undefined') return;
    const elem = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2);
    const parent = findAncestor(elem, 'work-tile');
    const visibleTiles = document.querySelectorAll('.visible.work-tile');
    if (!parent || !parent.classList.contains('visible')) {
      for (let i = 0; i < visibleTiles.length; i++) {
        visibleTiles[i].classList.remove('visible');
      }
      if (parent) parent.classList.add('visible');
    }
  }
  updateFilter = e => {
    e.preventDefault();
    const newFilter = e.currentTarget.dataset.filterName;
    if (Object.values(WORK_FILTERS).indexOf(newFilter.toLowerCase()) < 0) {
      console.warn(`Tried to switch to ${newFilter}, which isn't valid.`);
      return;
    }
    this.setState(state => ({
      ...state,
      currentFilter: newFilter.toLowerCase()
    }))
  }
  render() {
    const currentFilter = this.state.currentFilter.toLowerCase() === 'all' ? 'featured' : this.state.currentFilter.toLowerCase();
    const currentList = this.props.filtered_tiles.find(list => list.filter_name.toLowerCase() === currentFilter);
    return (
      <>
        <section className="work filter-wrap">
          <div className="container work-header">
            <div className="row">
              <div className="col-md-5">
                <h2 className="alt">
                  The <br />
                  Work
                </h2>
              </div>
              <div className="col-md-7">
                <ul className="filter">
                  {Object.values(WORK_FILTERS).map(value => (
                    <li key={value}>
                      <a
                        href={`#${value}`}
                        title={value}
                        onClick={this.updateFilter}
                        data-filter-name={value}
                        className={
                          this.state.currentFilter === value ? 'active' : ''
                        }
                      >
                        {value}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="filter-content-wrap">
            {renderTiles(currentList)}
          </div>
        </section>
      </>
    );
  }
}

export default WorkTiles;

export const workTilesFragment = graphql`
  fragment WorkTilesFragment on workTiles_7 {
    filtered_tiles {
      filter_name
      work_tiles {
        tiles {
          work_piece {
            post_name
            post_type
            acf {
              client_name
              rich_media_header {
                rich_media_header {
                  project_title
                }
              }
            }
          }
          cta_text
          override_fields {
            client_name
            project_title
          }
          image {
            ...WpMediaFragment
          }
        }
      }
    }
  }
`;
