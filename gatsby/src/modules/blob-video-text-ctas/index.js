import React, { Component } from 'react';
import { graphql } from 'gatsby';

import ReactPlayer from 'react-player';

import { ReactComponent as Hamburger } from '../_global/images/hamburger-close.svg';
import $ from 'jquery';
import '../blob-video/main.scss';

class BlobVideoWithTextCTAs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      videoReady: false,
      volume: 0,
    };
    this.MediaObj = {};
    this.stage = React.createRef();
    this.player = React.createRef();
  }
  componentDidMount() {
    this.fillBlobWithVideo();
    window.addEventListener('resize', this.onResize);
  }
  onResize = () => {
    if (!this.state.playing) {
      this.fillBlobWithVideo();
    }
  };
  fillBlobWithVideo() {
    $('.blob iframe, .blob .react-player').width('1422');
    $('.blob iframe, .blob .react-player').height('800');
  }
  toggleFullScreen() {
    if (!this.state.playing) {
      $('.blob iframe, .blob .react-player').width('100vw');
      $('.blob iframe, .blob .react-player').height('100vh');
    } else {
      this.fillBlobWithVideo();
    }
  }
  extractVideoSRC(embed) {
    // eslint-disable-next-line
    this.MediaObj = embed.match(/https:\/\/[A-Za-z0-9\.\/]*/g)[0];
  }

  render() {
    const { eyebrow, headline, supportive_text, video_embed_code, text_link_ctas } = this.props;
    const youtubeOpts = {
      playerVars: {
        autoplay: 1,
        controls: 0,
        enablejsapi: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
      },
      embedOptions: {
        wmode: 'transparent',
        showinfo: 0,
      },
    };
    const vimeoOpts = {
      playerOptions: {
        background: 1,
      },
    };
    this.extractVideoSRC(video_embed_code);
    return (
      <section className="content-blob">
        <div style={{ display: 'none' }}>
          BlobVideo
          <pre>
            <code>{JSON.stringify(this.props, null, 1)}</code>
          </pre>
        </div>
        <div className="container">
          <div className="col-md-6">
            <h4 className="eyebrow">{eyebrow}</h4>
            <h2
              dangerouslySetInnerHTML={{
                __html: headline,
              }}
            />
            <div
              dangerouslySetInnerHTML={{
                __html: supportive_text,
              }}
            />
            {text_link_ctas.length && text_link_ctas.map(ele => {
              const cta = ele.text_link_cta;
              return (
                <a className="text-cta" key={cta.title} href={cta.url} target={cta.target}>{cta.title}</a>
              )
            })}
          </div>
          <div
            className={
              this.state.playing ? 'blob yt-v vid-active' : 'blob yt-v'
            }
            ref={this.stage}
          >
            <ReactPlayer
              url={this.MediaObj}
              // playing={this.state.playing}
              className="react-player"
              config={{
                youtube: youtubeOpts,
                vimeo: vimeoOpts,
              }}
              volume={this.state.volume}
              onPlay={this._onPlay}
              onEnded={this._onEnded}
              onReady={this._onReady}
              loop={true}
            />

            <div 
              className="vid-thumb" 
              tabIndex="0" 
              onClick={this._beginPlaying} 
              onKeyDown={this._beginPlaying} 
            />
            <span 
              className="stop" 
              tabIndex="0"
              onClick={this._stopPlaying}
              onKeyDown={this._stopPlaying}>
              <Hamburger alt="" />
            </span>
          </div>
        </div>
      </section>
    );
  }
  _beginPlaying = event => {
    if (event.keyCode && event.keyCode != 13) {
      return;
    } else {
      this.toggleFullScreen();
      this.setState(state => ({
        ...state,
        playing: true,
        volume: 1,
      }));
    }
  };

  _stopPlaying = event => {
    if (event.keyCode && event.keyCode != 13) {
      return;
    } else {
      this.toggleFullScreen();
      this.setState(state => ({
        ...state,
        playing: false,
        volume: 0,
      }));
    }
  };
  _onReady = event => {
    this.fillBlobWithVideo();
    this.setState(state => ({
      ...state,
      videoReady: true,
    }));
    // console.log('playing');
  };
  _onPlay = event => {
    // console.log('playing');
  };
  _onEnded = event => {
    this.setState(state => ({
      ...state,
      playing: false,
    }));
  };
}

export default BlobVideoWithTextCTAs;

export const blobVideoWithTextCTAsFragment = graphql`
  fragment BlobVideoWithTextCTAsFragment on blobVideoWTextCtas_2 {
    video_embed_code
    eyebrow
    headline
    supportive_text
    text_link_ctas {
      text_link_cta {
        title
        url
        target
      }
    }
  }
`;
