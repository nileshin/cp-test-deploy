import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { ReactComponent as NewTabIcon } from '../_global/images/icon-new-tab.svg';

import './main.scss';

class StatLongFactRow extends Component {
  render() {
    const { statistic, fact } = this.props;
    return (
      <section className="stat">
        <div style={{ display: 'none', border: 'solid 1px #700bff' }}>
          Stat Long Fact Row
          <pre>
            <code>{JSON.stringify(this.props, null, 1)}</code>
          </pre>
        </div>
        <div className="container stat-fact-row-container">
          <div className="col-5 col-md-4 stat__head stat-title">
            <h3
              className="stat__title"
              dangerouslySetInnerHTML={{
                __html: statistic.stat_title,
              }}
            />
          </div>
          <div className="col-7 col-md-8 stat__head fact-title">
            <h3
              className="stat__title"
              dangerouslySetInnerHTML={{
                __html: fact.fact_title,
              }}
            />
          </div>
          <div className="col-5 col-md-4 stat__content stat-content">
            <span className="lg-text">{statistic.stat_number_unit}</span>
          </div>
          {fact.fact_content && (
            <div className="col-7 col-md-8 stat__content fact-content">
              {fact.fact_content.map((fact_row, index) => (
                <article className="fact" key={index}>
                  <h3 className="fact__title">
                    {fact_row.fact_link ? (
                      <a
                        href={fact_row.fact_link.url}
                        target={fact_row.fact_link.target}
                      >
                        {fact_row.fact_text}
                      </a>
                    ) : (
                      fact_row.fact_text
                    )}
                  </h3>
                  {fact_row.fact_link && (
                    <div className="fact__link">
                      <a
                        href={fact_row.fact_link.url}
                        target={fact_row.fact_link.target}
                        title={fact_row.fact_link.title}
                      >
                        {fact_row.fact_link.target === '_blank' && (
                          <NewTabIcon className="icn" viewBox="0 0 18 18" />
                        )}
                        {fact_row.fact_link.title}
                      </a>
                      <time>{fact_row.fact_link_supporting_text}</time>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default StatLongFactRow;

export const statLongFactRowFragment = graphql`
  fragment StatLongFactRowFragment on statLongFactRow_5 {
    statistic {
      stat_title
      stat_number_unit
    }
    fact {
      fact_title
      fact_content {
        fact_text
        fact_link {
          title
          url
          target
        }
        fact_link_supporting_text
      }
    }
  }
`;
