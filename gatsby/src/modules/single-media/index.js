import React, { Component } from 'react';
import { graphql } from 'gatsby';
import get from 'lodash.get';
// import sliderVideo, { parseVideoEmbed } from '../../utils/video';
import ReactPlayer from 'react-player';
import closeImg from '../_global/images/hamburger-close.svg';
import './main.scss';

const extractVideoSRC = (embed) => {
  if (!embed) return null;
  // eslint-disable-next-line
  return embed.match(/https:\/\/[A-Za-z0-9\.\/]*/g)[0];
}

const vimeo = {
  playerOptions: {
    //background: 1
  }
}

class SingleMedia extends Component {
  constructor(props) {
    super(props);
    this.sliderWrapper = React.createRef();
    this.MediaObj = extractVideoSRC(get(props, 'video.video_embed_code'));
    this.reactPlayer = React.createRef();
    this.state = {
      playing: false
    }
  }
  componentDidMount() {
    if (typeof window === 'undefined') return;

    if (this.sliderWrapper.current) {
      // sliderVideo(this.sliderWrapper.current);
    }
  }
  noop = e => e.preventDefault();
  onVideoReady = () => {
  }
  playClicked = e => {
    e.preventDefault();

    if (typeof window === 'undefined') return;
    const allStop = document.querySelectorAll('.stop');
    Array.from(allStop).forEach(s => s.click());

    this.setState(state => ({
      ...state,
      playing: true
    }));
  }
  stopClicked = e => {
    e.preventDefault();
    this.setState(state =>({
      ...state,
      playing: false
    }));
  }
  render() {
    const { video__image, image } = this.props;
    const video_embed_code = get(this.props, 'video.video_embed_code') || '';
    const { playing } = this.state;

    const mediaType = !video__image ? 'slider__img' : video_embed_code.indexOf('vimeo') ? 'slider__vimeo' : video_embed_code.search(/youtu\.?be/) ? 'slider__youtube' : '';
    return (
      <section className={`media slider-full`} ref={this.sliderWrapper}>
        <div className="container">
          <div className="media-carousel single-slide slick-current">
            <div className={`slider__item ${mediaType} media-carousel__item media-item  ${playing ? 'started' : ''}`} data-media-type={mediaType}>
              {
                video__image ? (
                  <>
                    {this.props.video.video_thumbnail && this.props.video.video_thumbnail.localFile && (
                      <img src={get(this.props, 'video.video_thumbnail.localFile.childImageSharp.fluid.src')} alt={get(this.props, 'video.video_thumbnail.alt_text')} className="cover" />
                    )}                    {/* eslint-disable-next-line */}
                    <a href="#play-video" title="Play" className={`play ${playing ? 'deactivated' : ''}`} onClick={this.playClicked} />
                    <ReactPlayer 
                      url={this.MediaObj}
                      className="react-player"
                      config={{
                        vimeo
                      }}
                      playing={playing}
                      onReady={this.onVideoReady}
                      volume={1}
                      ref={this.reactPlayer}
                    />
                    <span className="stop" onClick={this.stopClicked}><img src={closeImg} alt="stop" /></span>
                  </>
                ) : (
                  <>
                    {image.localFile &&
                      <img src={get(image, 'localFile.childImageSharp.fluid.src')} alt={image && image.alt_text} className="cover" />
                    }                  
                  </>
                )
              }
            </div>
          </div>
        </div>
    </section>
    );
  }
}

export default SingleMedia;

export const singleMediaFragment = graphql`
  fragment SingleMediaFragment on singleMedia_5 {
    video__image
    video {
      video_embed_code
      video_thumbnail {
        alt_text
        localFile {
          childImageSharp {
            fluid(quality:100) {
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
          fluid(quality:100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;
