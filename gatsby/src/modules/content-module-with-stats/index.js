import React, { Component } from 'react';
import { graphql } from 'gatsby';
import './main.scss';

class ContentModuleWithStats extends Component {
  render() {
    const { eyebrow, title, description, statistics } = this.props;
    const titleHTML = `${title.replace(
      /\.$/,
      ''
    )}<span class="highlight">.</span>`;
    return (
      <section className="content content-stats">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h4 className="eyebrow">{eyebrow}</h4>
              <h2 dangerouslySetInnerHTML={{ __html: titleHTML }} />
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <div className="col-md-4 offset-md-2 content-stats__column">
              {statistics.map((stat, i) => (
                <div className="content-stats__row" key={i}>
                  <h3
                    className="alt"
                    dangerouslySetInnerHTML={{ __html: stat.stat_title }}
                  />
                  <span
                    className="lg-text"
                    dangerouslySetInnerHTML={{ __html: stat.stat_number }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default ContentModuleWithStats;

export const contentModuleWithStatsFragment = graphql`
  fragment ContentModuleWithStatsFragment on contentModuleWithStats_8 {
    eyebrow
    title
    description
    statistics {
      stat_title
      stat_number
    }
  }
`;
