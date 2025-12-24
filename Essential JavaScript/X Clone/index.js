import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.ownReply) {
    const pass = {
      uuid: e.target.dataset.ownReply,
      profilePic: `images/${e.target.parentNode.previousElementSibling.src
        .split("/")
        .pop()}`,
      handle: e.target.previousElementSibling.previousElementSibling.innerText,
      tweetText: e.target.previousElementSibling.value,
    };
    handleOwnReplyClick(pass);
  }
});

let startX = 0;
let currentX = 0;
let isDragging = false;
let swipedTweetId = null;
const threshold = 120;

function handleOwnReplyClick(pass) {
  const tweet = tweetsData.filter((tweet) => {
    return tweet.uuid === pass.uuid;
  });

  let newReply = {
    handle: pass.handle,
    profilePic: pass.profilePic,
    tweetText: pass.tweetText,
  };
  tweet[0].replies.push(newReply);
  console.log("tweetsData: ", tweetsData);
  getFeedHtml();
  render();
  document
    .getElementById(`replies-${tweet[0].uuid}`)
    .classList.remove("hidden");
}

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }

  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  console.log("arrFromLS: ", JSON.parse(localStorage.getItem("tweetsData")));
  console.log("tweetsData: ", tweetsData);

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });

    render();
    tweetInput.value = "";
  }
}

function getFeedHtml() {
  let feedHtml = ``;

  const tweetsDataFromLocalStorage = JSON.parse(
    localStorage.getItem("tweetsData")
  );

  tweetsDataFromLocalStorage.forEach(function (tweet) {
    let likeIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `<div class="tweet-reply">
                            <div class="tweet-inner">
                                <img src="${reply.profilePic}" class="profile-pic">
                                    <div>
                                        <p class="handle">${reply.handle}</p>
                                        <textboard class="tweet-text">${reply.tweetText}</p>
                                    </div>
                                </div>
                        </div>`;
      });
    }

    repliesHtml += `
    <div class="tweet-reply">
      <div class="tweet-inner">
        <img src="images/scrimbalogo.png" class="profile-pic" />
        <div class="ownReply">
          <p class="handle">@Scrimba</p>
          <input class="replyInput" placeholder="What's reply?" id="tweet-input"></input>
          <button id="reply" class="replyBtn" data-own-reply="${tweet.uuid}">Reply</button>
        </div>
      </div>
    </div>
    `;

    feedHtml += `
        <div class="tweet" id="tweet-${tweet.uuid}">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>   
        </div>
`;
  });

  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));

  document.querySelectorAll(".tweet").forEach((tweet) => {
    tweet.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
      isDragging = true;
      swipedTweetId = tweet.id.replace("tweet-", "");
      tweet.setPointerCapture(e.pointerId);
    });

    tweet.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      currentX = e.clientX;

      if (startX - currentX > 0) {
        tweet.style.transform = `translateX(-${startX - currentX}px)`;
      }
    });

    tweet.addEventListener("pointerup", () => {
      isDragging = false;
      tweet.style.transform = "";

      if (startX - currentX > threshold) {
        deleteTweet(swipedTweetId);
      }
    });
  });
}

function deleteTweet(tweetId) {
  const index = tweetsData.findIndex((tweet) => tweet.uuid === tweetId);
  if (index !== -1) {
    tweetsData.splice(index, 1);
  }
  render();
}

render();
