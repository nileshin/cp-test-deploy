import React, { Component } from 'react';
import HomeHeader from '../modules/home-header';
import { graphql } from 'gatsby';

class NotFound extends Component {
  render() {
    const {
      data: {
        allWordpressAcfOptions: { edges },
      },
    } = this.props;
    const [node] = edges;
    const {
      node: {
        options: {
          not_found_content: { home_header },
        },
      },
    } = node;

    return (
      <>
        <HomeHeader
          {...home_header}
          center_content={true}
          suppress_animations
        />
      </>
    );
  }
}

export default NotFound;

export const query = graphql`
  query NotFoundQuery {
    allWordpressAcfOptions {
      edges {
        node {
          options {
            not_found_content {
              home_header {
                ...HomeHeaderFragmentNotFound
              }
            }
          }
        }
      }
    }
  }
`;
