import React, { Component } from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/seo';
import Header from '../modules/header';
import ContactCards from '../modules/contact-cards';

class Contact extends Component {
  render() {
    const { data: { wordpressPage: page, wordpressPage: { acf: { header, contact_cards } } } } = this.props
    return (
      <>
        <SEO {...page.yoast_meta} {...page.cp_meta.yoast_social} />
        <Header {...header.header} />
        <ContactCards {...contact_cards.contact_cards} />
      </>
    );
  }
}

export default Contact;

export const query = graphql`
  query {
    wordpressPage(slug: { eq: "contact" }) {
      id
      wordpress_id
      ...YoastMetadataFragment
      acf {
        header {
          header {
            ...HeaderFragment
          }
        }
        contact_cards {
          contact_cards {
            ...ContactCardsFragment
          }
        }
      }
    }
  }
`;
