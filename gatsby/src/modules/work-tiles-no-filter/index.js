import React, { Component } from 'react';
import { graphql, Link } from 'gatsby';
import { passiveIfSupported } from '../../utils';
import '../work-tiles/main.scss';
import get from 'lodash.get';

function findAncestor (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

const renderTiles = currentList => {
  return currentList.map((tile, index) => {
    let { project_title, client_name } = tile.override_fields || {};
    if (!project_title) project_title = get(tile, 'case_piece.acf.rich_media_header.rich_media_header.project_title') || '';
    if (!client_name) client_name = get(tile, 'case_piece.acf.client_name') || '';
    const { post_type, post_name:slug } = tile.case_piece || {}
    const direction = index % 2 === 0 ? 'left' : 'right';
    const angleType = index % 4 === 0 || index % 4 === 1 ? 'connected' : 'reverse';
    return (
      <Link to={`/${post_type}/${slug}`} title={project_title} className={`work-tile filter-item ${direction} ${angleType}`} key={slug}>
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

class WorkTiles extends Component {
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

  render() {
    let currentList = this.props.tiles;
    const allCaseStudies = this.props.allCaseStudies.edges;
    const updatedListWithACF = (() => {
      return currentList.map(tile => {
        const wp_id = tile.case_piece.wordpress_id;
        const caseStudy = allCaseStudies.find(caseStudy => caseStudy.node.wordpress_id === wp_id);
        tile.case_piece.acf = caseStudy.node.acf;

        return tile;
      })
    })();

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
            </div>
          </div>
          <div className="filter-content-wrap">
            {renderTiles(updatedListWithACF)}
          </div>
        </section>
      </>
    );
  }
}

export default WorkTiles;

export const workTilesNoFilterFragment = graphql`
  fragment WorkTilesNoFilterFragment on caseTiles_2 {
    tiles {
      case_piece {
        post_name
        post_type
        wordpress_id
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
`;
