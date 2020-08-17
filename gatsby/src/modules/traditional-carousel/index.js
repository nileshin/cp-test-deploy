import React, { Component } from 'react';
import { graphql } from 'gatsby';
// import sliderVideo, { parseVideoEmbed } from '../../utils/video';
import ReactPlayer from 'react-player';
import get from 'lodash.get';

import $ from 'jquery';
import '../_global/js/vendor/slick';
import { ReactComponent as HamburgerClose } from '../_global/images/hamburger-close.svg';

import './main.scss';

const extractVideoSRC = embed => {
  if (!embed) return null;
  // eslint-disable-next-line
  return embed.match(/https:\/\/[A-Za-z0-9\.\/]*/g)[0];
};

const vimeo = {
  playerOptions: {
    //background: 1
  },
};

class VideoSlide extends Component {
  state = {
    playing: false,
  };
  onPlay = () => {
    this.setState(state => ({
      ...state,
      playing: true,
    }));
  };
  onStop = () => {
    this.setState(state => ({
      ...state,
      playing: false,
    }));
  };
  render() {
    return (
      <ReactPlayer
        url={this.props.url}
        className="react-player"
        config={{ vimeo }}
        playing={this.state.playing}
        volume={1}
      />
    );
  }
}

class TraditionalCarousel extends Component {
  constructor(props) {
    super(props);
    this.slider = React.createRef();
    this.MediaObj = props.slides.map(s =>
      extractVideoSRC(get(s, 'video.video_embed_code'))
    );
    this.reactPlayers = props.slides.map(s => null);
  }
  componentDidMount() {
    // sliderVideo($('.slider-full'));
    if (typeof window === 'undefined') return;
    $(this.slider.current).slick({
      centerMode: true,
      centerPadding: `20%`,
      slidesToShow: 1,
      dots: false,
      slidesToScroll: 1,
      draggable: false,
      swipe: false,
      infinite: true,
    });
    this.calcSlideHeight();
    window.addEventListener('resize', this.onResize);
    Array.from(this.slider.current.querySelectorAll('.slick-arrow')).forEach(
      el => el.addEventListener('click', this.onStopClicked)
    );
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }
  onResize = () => {
    this.calcSlideHeight();
    clearTimeout(this.resizeFinished);
    this.resizeFinished = setTimeout(() => this.calcSlideHeight(), 950);
  };
  calcSlideHeight() {
    const currentSlide = this.slider.current.querySelector(
      '.slick-current .slider__item'
    );
    if (currentSlide) {
      const slideHeight = currentSlide.offsetHeight;
      const track = this.slider.current.querySelector('.slick-track');
      if (track) {
        track.style.height = `${slideHeight}px`;
      }
    }
  }
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }
  noop = e => e.preventDefault();
  onPlayClicked = e => {
    e.preventDefault();

    if (typeof window === 'undefined') return;
    const allStop = document.querySelectorAll('.stop');
    Array.from(allStop).forEach(s => s.click());

    const idx = +e.target.dataset.videoIndex;
    this.reactPlayers[idx] && this.reactPlayers[idx].onPlay();

    const slides = this.slider.current.querySelectorAll('.slider__item');
    Array.from(slides).forEach((s, i) => {
      if (+s.dataset.videoIndex === idx) {
        s.classList.add('started');
      } else {
        s.classList.remove('started');
      }
    });
  };
  onStopClicked = e => {
    e.preventDefault();
    this.reactPlayers.forEach(rp => {
      rp && rp.onStop();
    });
    Array.from(this.slider.current.querySelectorAll('.slider__item')).forEach(
      s => s.classList.remove('started')
    );
  };
  render() {
    const { slides } = this.props;
    return (
      <section className="slider-full">
        <div className="slider" ref={this.slider}>
          {slides.map((slide, i) => {
            let slideClass = 'slider__img';
            const video_embed_code = get(slide, 'video.video_embed_code') || '';
            if (slide.video__image) {
              slideClass = video_embed_code.search(/youtu\.?be/)
                ? 'slider__youtube'
                : video_embed_code.indexOf('vimeo')
                ? 'slider__vimeo'
                : '';
            }
            return (
              <div
                className={`slider__item ${slideClass}`}
                data-video-index={i}
                key={i}
              >
                {slide.video__image ? (
                  <>
                    <img
                      src={
                        get(
                          slide,
                          'video.video_thumbnail.localFile.childImageSharp.fluid.src'
                        ) || ''
                      }
                      alt={get(slide, 'video.video_thumbnail.alt_text') || ''}
                      data-critical={true}
                      className="cover"
                    />
                    {/* eslint-disable-next-line */}
                    <a
                      href="#"
                      title="Play"
                      className="play"
                      data-video-index={i}
                      onClick={this.onPlayClicked}
                    />
                    <VideoSlide
                      url={this.MediaObj[i]}
                      ref={e => (this.reactPlayers[i] = e)}
                    />
                    <span
                      className="stop"
                      onClick={this.onStopClicked}
                      data-video-index={i}
                    >
                      <HamburgerClose />
                    </span>
                  </>
                ) : (
                  <img
                    src={
                      get(slide, 'image.localFile.childImageSharp.fluid.src') ||
                      ''
                    }
                    alt={slide.image && slide.image.alt_text}
                    data-critical={true}
                    className="cover"
                  />
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }
}

export default TraditionalCarousel;

export const traditionalCarouselFragment = graphql`
  fragment TraditionalCarouselFragment on traditionalCarousel_4 {
    slides {
      video__image
      video {
        video_embed_code
        video_thumbnail {
          alt_text
          localFile {
            childImageSharp {
              fluid(quality: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
      image {
        alt_text
        localFile {
          childImageSharp {
            fluid(quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
