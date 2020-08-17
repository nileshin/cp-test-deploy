import $ from 'jquery';
import YT from 'react-youtube';



(function($) {
  if (typeof window === 'undefined') return;
  var player, getHeight, getWidth;

  $(document).ready(function() {
    calcAspectRatio();
    $(document).on("click", ".vid-thumb", function(i) {
      i.preventDefault();
      var getSRC = $(this).closest(".yt-v").find("iframe").data("src");
      $(this).closest(".yt-v").find("iframe").attr("src", getSRC);
      $(this).closest(".yt-v").addClass("vid-active");
      $(this).closest(".yt-v").find(".vid-thumb").fadeOut();
    });
    $(".yt-v").each(function(i) {
      $(this).find("iframe").attr("id", "player" + i)
    });
  });

  $(window).resize(function() {
    calcAspectRatio();
  });

  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  console.log("player active ", player)
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  function onYouTubeIframeAPIReady() {
      $(".yt-v").each(function(i, el) {
          $("body").on("click", ".yt-v .vid-thumb", function(e) {
              setTimeout(function() {
                  player = new YT.Player('player' + i,{
                      events: {
                          'onReady': onPlayerReady,
                          'onStateChange': onPlayerStateChange
                      }
                  });
              }, 100);
          });
      })
  }
  function onPlayerReady(event) {
    event.target.playVideo();

    $(".stop").click(function() {
      event.target.stopVideo();
      $(this).closest(".yt-v").removeClass("vid-active");
      $(this).closest(".yt-v").find(".vid-thumb").fadeIn();
    });

    /* var pauseButton = document.getElementById("pause-button");
    pauseButton.addEventListener("click", function() {
      event.target.pauseVideo();
    }); */
  }
  function onPlayerStateChange(event) {
      if (event.data === 1) {
          $(event.target.a).closest(".bg-sec").addClass("playing-yt");
      }
  }
  onYouTubeIframeAPIReady();

  function calcAspectRatio() {
    getHeight = (window.innerWidth * 1080) / 1920;
    getWidth = (1920 * window.innerHeight) / 1080;
    if (getHeight < window.innerHeight) {
      $(".blob iframe").width(getWidth);
      $(".blob iframe").height(window.innerHeight);
    } else {
      $(".blob iframe").width(window.innerWidth);
      $(".blob iframe").height(getHeight);
    }
  }

})($);