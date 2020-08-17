import React, { Component } from 'react';
import { graphql } from 'gatsby';
import './main.scss';
import get from 'lodash.get';

class LogoGrid extends Component {
  render() {
    const { logos } = this.props;
    return (
      <div>
        <section className="logo-grid">
          <div className="container">
            <h2 className="alt">Client<br/>Roster</h2>
            <ul className="clients">
              {
                logos.map((logo, i) => (
                  <li className="client" key={i}>
                    <figure>
                      <img 
                        src={
                          get(logo, 'url.localFile.publicURL') ||
                          get(logo, 'localFile.publicURL') ||
                          ''
                        } 
                        alt={logo.alt || logo.alt_text} />
                    </figure>
                  </li>
                ))
              }
            </ul>
          </div>
        </section>
      </div>
    );
  }
}

export default LogoGrid;

// NB: need to get publicURL because svg's aren't processed by ImageSharp.
export const logoGridFragment = graphql`
  fragment LogoGridFragment on logoGrid_10 {
    logos {
      alt
      url {
        localFile {
          publicURL
        }
      }
    }
  }
  fragment LogoGridFragmentCase on logoGrid_8 {
    logos {
      alt_text
      localFile {
        publicURL
      }
    }
  }
`