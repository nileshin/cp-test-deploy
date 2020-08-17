import React, { Component } from 'react';
import { graphql } from 'gatsby';
import './main.scss'

class SectionHeader extends Component {
  render() {
    const { title, subtitle, body_copy } = this.props;
    return (
      <section className="section-header">
        <div className="container">
          <h2 className="alt" dangerouslySetInnerHTML={{__html:title}} />
          <div className="row">
            <div className="col-md-6">
              <h3 className="alt">
                {subtitle}
              </h3>
            </div>
            <div className="col-md-6" dangerouslySetInnerHTML={{__html:body_copy}} />
          </div>
        </div>
      </section>
    );
  }
}

export default SectionHeader;

export const sectionHeaderFragment = graphql`
  fragment SectionHeaderLeadershipFragment on sectionHeader_7 {
    title
    subtitle
    body_copy
  }
  fragment SectionHeaderGridFragment on sectionHeader_8 {
    title
    subtitle
    body_copy
  }
`;
