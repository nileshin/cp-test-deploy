import $ from 'jquery';
import parse from 'html-react-parser';
import domToReact from 'html-react-parser/lib/dom-to-react';

// POST commands to YouTube or Vimeo API
function postMessageToPlayer(player, command) {
  if (player == null || command == null) {
    console.warn('Cannot postMessageToPlayer', {player, command});
    return;
  }
  player.contentWindow.postMessage(JSON.stringify(command), "*");
}

// When the slide is changing
function playPauseVideo(slick, control) {
  var currentSlide, slideType, startTime, player, video;

  currentSlide = slick.find(".slick-current .slider__item");

  slideType = currentSlide.attr("class").split(" ")[1];
  player = currentSlide.find("iframe").get(0);
  startTime = currentSlide.data("video-start");

  if (slideType === "slider__vimeo") {
    switch (control) {
      case "play":
        currentSlide.addClass('started');
        if ((startTime != null && startTime > 0) && !currentSlide.hasClass('started')) {
          currentSlide.addClass('started');
          postMessageToPlayer(player, {
            "method": "setCurrentTime",
            "value": startTime
          });
        }
        postMessageToPlayer(player, {
          "method": "play",
          "value": 1
        });
        break;
      case "pause":
        postMessageToPlayer(player, {
          "method": "pause",
          "value": 1
        });
        break;
      default: break;
    }
  } else if (slideType === "slider__youtube") {
    switch (control) {
      case "play":
        currentSlide.addClass('started');
        // postMessageToPlayer(player, {
        //   "event": "command",
        //   "func": "mute"
        // });
        postMessageToPlayer(player, {
          "event": "command",
          "func": "playVideo"
        });
        break;
      case "pause":
        postMessageToPlayer(player, {
          "event": "command",
          "func": "pauseVideo"
        });
        break;
      default: break;
    }
  } else if (slideType === "slider__video") {
    video = currentSlide.children("video").get(0);
    if (video != null) {
      if (control === "play") {
        currentSlide.addClass('started');
        video.play();
      } else {
        video.pause();
        currentSlide.removeClass('started');
      }
    }
  }
}

export default function(slideWrapperElem) {
  $(slideWrapperElem).on("beforeChange", function (event, slick) {
    slick = $(slick.$slider);
    slick.find(".slider__item").removeClass("started");
    $(".play").fadeIn();
    playPauseVideo(slick, "pause");
  });
  $(slideWrapperElem).on("click", ".play", function() {
    $('.slider-full .stop, .slider .stop').click();
    const ancestor = $(this).closest('.slider-full, .slider')
    playPauseVideo(ancestor,"play");
    $(this).fadeOut();
  });
  $(slideWrapperElem).on("click", ".stop", function() {
    const ancestor = $(this).closest('.slider-full, .slider');
    ancestor.find(".slider__item").removeClass("started");
    $(".play").fadeIn();
    playPauseVideo(ancestor, "pause");
  });
}

export const parseVideoEmbed = (video_embed_code, slideClass) => {
  return parse(video_embed_code, {
    replace: domNode => {
      if (!domNode.attribs.class) domNode.attribs.class = '';
      domNode.attribs.class = (
        domNode.attribs.class + ' embed-player slide-media'
      ).trim();
      if (domNode.attribs.src) {
        const joiner = domNode.attribs.src.indexOf('?') > 0 ? '&' : '?';
        if (slideClass === 'slider__youtube') {
          domNode.attribs.src += `${joiner}enablejsapi=1&controls=0showinfo=0`;
        } else if (slideClass === 'slider_vimeo' || slideClass === 'slider__vimeo') {
          domNode.attribs.src += `${joiner}api=1&byline=0&portrait=0&title=0&autoplay=0`;
        }
      }
      return domToReact(domNode);
    },
  });
};