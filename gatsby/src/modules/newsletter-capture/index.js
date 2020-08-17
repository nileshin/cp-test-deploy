import React, { Component } from 'react';
import { graphql } from 'gatsby';
import './main.scss';

const MAILCHIMP_URL =
  'https://connellypartners.us12.list-manage.com/subscribe/post?u=115a5c8d429a9d02213aad39d&amp;id=f8472f72cf';

class NewsletterCapture extends Component {
  render() {
    const { title, placeholder_copy, cta_copy, copy } = this.props;
    return (
      <section className="newsletter bg-dark row full-bleed-parent">
        <div className="col-12 full-width">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="newsletter__detail">
                  <h2>{title}</h2>
                  <p>{copy}</p>
                </div>
              </div>
              <div className="col-md-auto">
                <form
                  id="newsletter-form"
                  className="newsletter-form"
                  action={MAILCHIMP_URL}
                  method="post"
                  target="_blank"
                >
                  <label htmlFor="mce-EMAIL" className="sr-only">
                    {placeholder_copy}
                  </label>
                  <input
                    type="email"
                    name="EMAIL"
                    id="mce-EMAIL"
                    placeholder={placeholder_copy}
                  />
                  {/* <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups--> */}
                  <div
                    style={{ position: 'absolute', left: '-5000px' }}
                    aria-hidden="true"
                  >
                    <input
                      type="text"
                      name="b_115a5c8d429a9d02213aad39d_f8472f72cf"
                      tabIndex="-1"
                    />
                  </div>
                  <input type="submit" value={cta_copy} title="submit" />
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default NewsletterCapture;

export const newsletterCaptureFragment = graphql`
  fragment NewsletterCaptureFragment on newsletterCapture_8 {
    title
    placeholder_copy
    cta_copy
    copy
  }
`;
