import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { slugify } from '../../utils';
import Blob from '../../components/blob';
import './main.scss';

class StatRow extends Component {
  render() {
    const { stats, options: { hasBlob, hasColors } = {} } = this.props;
    return (
      <section
        className={`stat stat-alt ${hasBlob ? 'has-blob' : ''} ${
          hasColors ? 'has-colors' : ''
        }`}
      >
        <div className="container stat-row-container">
          <Blob
            blobToBeDisplayed="bgBlob"
            phaseTwoPath="M289.513424,1488.12278 C411.566054,1426.91973 550.5,1504.4 600.298197,1392.14433 C650.096394,1279.88867 582,1121.56429 445,1077 C308,1032.43571 77.7668765,1150.17142 24.2589746,1330.93539 C-29.2489273,1511.69936 167.460795,1549.32583 289.513424,1488.12278 Z"
            phaseThreePath="M263.344983,1470.09589 C366.575421,1386.67146 550.5,1528.25566 600.298197,1416 C650.096394,1303.74434 642.75,1155.03557 505.75,1110.47128 C368.75,1065.90698 77.7668765,1150.17142 24.2589746,1330.93539 C-29.2489273,1511.69936 160.114544,1553.52032 263.344983,1470.09589 Z"
          />
          {stats.map(({ stat_title }, i) => {
            return (
              <div className="row stat__head" data-stat-index={i} key={stat_title}>
                <div className="col-6 col-md-4" key={slugify(stat_title)}>
                  <h3
                    className="stat__title"
                    dangerouslySetInnerHTML={{ __html: stat_title }}
                  />
                </div>
              </div>
            );
          })}

          {stats.map(({ stat_number }, i) => {
            return (
              <div className="row stat__content" data-stat-index={i} key={stat_number}>
                <div className="col-6 col-md-4" key={slugify(stat_number)}>
                  <span className="lg-text">{stat_number}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
}

export default StatRow;

export const statRow = graphql`
  fragment StatRowFragmentWorkDetail on statRow_11 {
    stats {
      stat_title
      stat_number
    }
  }
  fragment StatRowFragment on statRow_14 {
    stats {
      stat_title
      stat_number
    }
  }


`;
