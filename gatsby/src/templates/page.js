import React from 'react';
import { graphql } from 'gatsby';
import './page.scss';

const Page = ({ data }) => {
  const { wordpressPage: page } = data;
  return (
    <>
      <section className="page-template">
        <div className="container">
          <div className="row">
              <div className="col-lg-8">
                <div className="news-details__title">
                  <h2>{page.title}</h2>
                </div>
              </div>
              <div className="col-12">
                <div className="news-content">
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
                </div>
              </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default Page;

export const query = graphql`
  query($id: String!) {
    wordpressPage(id: { eq: $id }) {
      title
      content
    }
  }
`;
