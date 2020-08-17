import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { stripTags } from '../../utils';
import './main.scss';

import { ReactComponent as NewTabIcon } from '../_global/images/icon-new-tab.svg';
import { ReactComponent as DownloadIcon } from '../_global/images/icon-dwnld.svg';
import { ReactComponent as LoadingIcon } from '../_global/images/loading.svg';

class ContactCards extends Component {
  state = {
    cityData: {
      boston: null,
      dublin: null,
    },
  };
  render() {
    const { contact_cards_repeater: cards } = this.props;
    return (
      <>
        <section className="contact">
          <div className="container">
            <div className="row">
              {cards.map(card => {
                return (
                  <div className="col-lg-6" key={card.location}>
                    <div className="contact__card">
                      <div className="contact__details">
                        <span className="eyebrow">{card.eyebrow}</span>
                        <h2>{card.location}</h2>
                        <address>
                          <span
                            dangerouslySetInnerHTML={{ __html: card.address }}
                          />
                          <a
                            href={`tel:${card.phone.replace(/[^0-9+]/g, '')}`}
                            title="Call us"
                          >
                            {card.phone}
                          </a>
                        </address>
                        <a
                          href={
                            card.google_maps_link ||
                            `https://www.google.com/maps/place/${stripTags(
                              card.address
                            )}`
                          }
                          title="Get Directions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-link"
                        >
                          Get Directions{' '}
                          <NewTabIcon
                            className="icn"
                            alt="open map in a new tab"
                            viewBox="0 0 18 18"
                          />
                        </a>
                      </div>
                      <div className="contact-brief">
                        <div className="contact-brief__text">
                          <h3 className="alt">Want to brief us?</h3>
                        </div>
                        <div className="contact-brief__img">
                          <img
                            src={
                              card.contact_info.image &&
                              card.contact_info.image.localFile &&
                              card.contact_info.image.localFile.childImageSharp
                                .original.src
                            }
                            alt={card.contact_info.name}
                          />
                        </div>
                        <div className="contact-brief__info">
                          <ul>
                            <li>
                              <strong>{card.contact_info.name}</strong>
                            </li>
                            <li>{card.contact_info.title}</li>
                          </ul>
                          <a
                            href={`mailto:${card.contact_info.email}`}
                            title="Mail us"
                          >
                            {card.contact_info.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default ContactCards;

export const contactCardsFragment = graphql`
  fragment ContactCardsFragment on contactCards_8 {
    contact_cards_repeater {
      eyebrow
      location
      address
      google_maps_link
      phone
      contact_info {
        name
        title
        email
        image {
          ...WpMediaFragment
        }
      }
    }
  }
`;
