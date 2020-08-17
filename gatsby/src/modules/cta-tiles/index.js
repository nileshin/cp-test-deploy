import React, { Component } from 'react';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import './main.scss';
import get from 'lodash.get';

const renderTile = (tile, htmlTitles) => {
  const isExternal = tile.cta.url.indexOf('http') === 0;
  const linkProps = {
    className: 'col-md-6 cta-tile-wrapper',
    title: tile.cta.title,
  };
  const image = get(tile, 'image.localFile.childImageSharp.fluid') || '';

  const tileBody = (
    <>
      <div className="cta-tile">
        {htmlTitles ? (
          <h3 dangerouslySetInnerHTML={{ __html: tile.headline }} />
        ) : (
          <h3>{tile.headline}</h3>
        )}
        <span className="cta">{tile.cta.title}</span>
        {image && (
          <Img
            fluid={image}
            className="cta-tile__img bg-img cover"
            style={{ position: 'absolute' }}
          />
        )}
      </div>
    </>
  );

  return isExternal ? (
    <a href={tile.cta.url} {...linkProps}>
      {tileBody}
    </a>
  ) : (
    <Link to={tile.cta.url} {...linkProps}>
      {tileBody}
    </Link>
  );
};

class CTATiles extends Component {
  render() {
    const { left_cta, right_cta, htmlTitles } = this.props;

    return (
      <section className="cta-tiles bg-dark">
        <div className="container-fluid">
          <div className="row">
            {renderTile(left_cta, htmlTitles)}
            {renderTile(right_cta, htmlTitles)}
          </div>
        </div>
      </section>
    );
  }
}

export default CTATiles;

export const ctaTileFragment = graphql`
  fragment CTATileFragment on ctaTiles_16 {
    left_cta {
      headline
      cta {
        title
        url
        target
      }
      image {
        localFile {
          publicURL
        }
        ...WpMediaFragmentFluid1440
      }
    }
    right_cta {
      headline
      cta {
        title
        url
        target
      }
      image {
        localFile {
          publicURL
        }
        ...WpMediaFragmentFluid1440
      }
    }
  }
  fragment CTATileFragmentNewsDetail on ctaTiles_14 {
    left_cta {
      headline
      cta {
        title
        url
        target
      }
      image {
        localFile {
          publicURL
        }
        ...WpMediaFragmentFluid1440
      }
    }
    right_cta {
      headline
      cta {
        title
        url
        target
      }
      image {
        localFile {
          publicURL
        }
        ...WpMediaFragmentFluid1440
      }
    }
  }
`;
