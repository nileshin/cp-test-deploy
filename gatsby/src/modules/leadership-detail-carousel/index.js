import React, { Component } from 'react';
import { graphql } from 'gatsby';
import { slugify, passiveIfSupported } from '../../utils';
import { Transition } from 'react-transition-group';
import debounce from 'lodash.debounce';
import get from 'lodash.get';
import './main.scss';

const ANIMATION_TIME = 300;

class LeadershipDetailCarousel extends Component {
  constructor(props) {
    super(props);
    this.sliderLeader = React.createRef();
    this.state = {
      activeLeader: this.props.leadership_slides[0].name,
      buttonStyle: {},
    };
  }
  componentDidMount() {
    if (typeof window === 'undefined') return;
    this.updateSliderLeaderHeight(this.state.activeLeader);

    window.addEventListener(
      'resize',
      this.updateButtonStyle,
      passiveIfSupported
    );
    this.updateButtonStyle();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateButtonStyle);
  }
  componentDidUpdate() {
    if (typeof window === 'undefined') return;
    if (!this.state.activeLeader) return;
    this.updateSliderLeaderHeight(this.state.activeLeader);
  }
  updateSliderLeaderHeight = activeLeader => {
    const activeSlide = this.sliderLeader.current.querySelector(
      `div[data-name="${activeLeader}"]`
    );
    const activeSlideHeight = activeSlide.offsetHeight;
    this.sliderLeader.current.style.height = `${activeSlideHeight + 30}px`;
  };
  changeSlide = e => {
    e.preventDefault && e.preventDefault();
    const newName = e.target ? e.target.getAttribute('title') : e.slideName;
    this.setState(
      state => ({
        ...state,
        activeLeader: null,
      }),
      () => {
        setTimeout(() => {
          this.setState(
            state => ({
              ...state,
              activeLeader: newName,
            }),
            this.getButtonStyle
          );
        }, ANIMATION_TIME);
      }
    );
  };
  advanceSlide = e => {
    e.preventDefault();
    const direction =
      e.target.getAttribute('class').indexOf('prev') >= 0 ? -1 : 1;

    const currentIndex = this.props.leadership_slides.findIndex(
      slide => slide.name === this.state.activeLeader
    );

    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = this.props.leadership_slides.length - 1;
    if (newIndex >= this.props.leadership_slides.length) newIndex = 0;

    this.changeSlide({
      slideName: this.props.leadership_slides[newIndex].name,
    });
  };
  getButtonStyle = () => {
    if (typeof window === 'undefined') return {};

    if (window.innerWidth < 768 && this.sliderLeader.current) {
      const currentImage = this.sliderLeader.current.querySelector(
        '.slider-leader__item.entered img.cover'
      );
      if (currentImage) {
        this.setState(state => ({
          ...state,
          buttonStyle: { top: `${currentImage.height}px` },
        }));
      }
    }
  };
  updateButtonStyle = debounce(
    () => {
      this.getButtonStyle();
    },
    150,
    { leading: true }
  );
  render() {
    const { leadership_slides: slides } = this.props;
    const { activeLeader, buttonStyle } = this.state;
    return (
      <section className="leaders">
        <div className="container">
          <div className="row">
            <div className="col-md-2 offset-md-1 leaders-name-column">
              <ul className="leaders-list">
                {slides.map(slide => {
                  return (
                    <li key={slide.name}>
                      <a
                        href={`#${slugify(slide.name)}`}
                        title={slide.name}
                        onClick={this.changeSlide}
                        className={activeLeader === slide.name ? 'active' : ''}
                      >
                        {slide.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-md-8 offset-md-1 leader-details-column">
              <div className="slider-leader" ref={this.sliderLeader}>
                <button
                  className="slick-prev slick-arrow"
                  aria-label="Previous"
                  type="button"
                  onClick={this.advanceSlide}
                  style={buttonStyle}
                >
                  Previous
                </button>
                {slides.map(slide => {
                  const image = get(
                    slide,
                    'image.localFile.childImageSharp.original.src'
                  );
                  return (
                    <Transition
                      in={slide.name === activeLeader}
                      timeout={ANIMATION_TIME}
                      key={slide.name}
                    >
                      {slideState => {
                        return (
                          <div
                            className={`slider-leader__item ${slideState}`}
                            data-name={slide.name}
                          >
                            <figure className="leader-img bg-cover bg-dark">
                              <img
                                src={image}
                                alt={slide.name}
                                className="cover"
                              />
                              <figcaption>
                                <h2
                                  dangerouslySetInnerHTML={{
                                    __html: slide.name
                                      .trim()
                                      .replace(/\s+/, '<br/>'),
                                  }}
                                />
                              </figcaption>
                            </figure>
                            <div className="leader-details">
                              <small className="title">{slide.title}</small>
                              <blockquote>
                                <p>{slide.quote}</p>
                              </blockquote>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: slide.body_copy,
                                }}
                                className="body-copy"
                              />
                              <small className="tenure">{slide.tenure}</small>
                            </div>
                          </div>
                        );
                      }}
                    </Transition>
                  );
                })}
                <button
                  className="slick-next slick-arrow"
                  aria-label="Next"
                  type="button"
                  onClick={this.advanceSlide}
                  style={buttonStyle}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default LeadershipDetailCarousel;

export const leadershipDetailCarouselFragment = graphql`
  fragment LeadershipDetailCarouselFragment on leadershipDetailCarousel_8 {
    leadership_slides {
      name
      title
      quote
      body_copy
      tenure
      image {
        ...WpMediaFragment
      }
    }
  }
`;
