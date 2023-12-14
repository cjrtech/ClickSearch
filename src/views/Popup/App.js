import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "./App.css";
import ResultsCard from "../components/ResultsCard";
import generateChatCompletion from "../../api/openaiApi.js";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
class App extends React.Component {
  state = {
    videos: [],
    loading: true,
    videoId: null,
    videoData: null,
    videoTitle: null,
    prompt: null,
    keywords: ["", "", ""],
    storedOpenaiResponse: null,
    openAIResponse: {
      questionOne: null,
      questionTwo: null,
      questionThree: null,
      questionFour: null,
      questionFive: null,
    },
    userQuestions: {
      peopleQuestions: {
        questionOne: "",
        questionTwo: "",
        questionThree: "",
        questionFour: "",
        questionFive: "",
      },
      movieQuestions: {
        questionOne: "",
        questionTwo: "",
        questionThree: "",
        questionFour: "",
        questionFive: "",
      },
      videoGameQuestions: {
        questionOne: "",
        questionTwo: "",
        questionThree: "",
        questionFour: "",
        questionFive: "",
      },
      techQuestions: {
        questionOne: "",
        questionTwo: "",
        questionThree: "",
        questionFour: "",
        questionFive: "",
      },
      anyQuestions: {
        questionOne: "",
        questionTwo: "",
        questionThree: "",
        questionFour: "",
        questionFive: "",
      },
      historyQuestions: {
        questionOne: "",
        questionTwo: "",
        questionThree: "",
        questionFour: "",
        questionFive: "",
      },
    },
    videoCategory: null,
  };
  // will eventually remove the console logs, but are there now for testing
  // view them by inspecting the popup
  async componentDidMount() {
    // Retrieve videoId from chrome.storage.local
    chrome.storage.local.get(["videoId"], (result) => {
      const videoIdTemp = result.videoId;
      console.log("Retrieved video ID:", videoIdTemp);

      // Set videoId state
      this.setState({ videoId: videoIdTemp }, () => {
        console.log("Updated videoId state:", this.state.videoId);
      });
    });
    chrome.storage.local.get(["openaiResponse"], (result) => {
      const response = result.openaiResponse;
      console.log("Retrieved video ID:", response);
      this.setState({ storedOpenaiResponse: response }, () => {
        console.log("Updated response state:", this.state.storedOpenaiResponse);
      });
    });

    chrome.storage.local.get(["videoCategory"], (result) => {
      const category = result.videoCategory;
      console.log("Retrieved category:", category);

      this.setState({ videoCategory: category }, () => {
        console.log("Updated videoId state:", this.state.videoCategory);
      });
    });

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.data) {
        // Set videoData state when a message is received
        this.setState(
          {
            videoData: message.data,
            videoTitle: message.data.items[0].snippet.title,
          },
          () => {
            console.log(
              "Updated videoData state:",
              this.state.videoData,
              this.state.videoTitle
            );
          }
        );
      } else if (message.keyTag) {
        this.setState(
          {
            keywords: message.keyTag,
          },
          () => {
            console.log("Updated keywords state:", this.state.keywords);
          }
        );
      }
    });

    // Retrieve videoData from chrome.storage.local
    const youtubeResult = await chrome.storage.local.get(["apiResponse"]);
    const youtubeData = youtubeResult.apiResponse;
    this.setState({
      videoData: youtubeData,
      videoTitle: youtubeData[0].snippet.title,
    });
    const keyTagsResult = await chrome.storage.local.get(["keywords"]);
    const tags = keyTagsResult.keywords;
    this.setState({ keywords: tags }, () => {
      console.log("Updated keywords state:", this.state.keywords);
    });
    const preferredQuestionsResult = await chrome.storage.local.get([
      "preferredQuestions",
    ]);
    const questions = preferredQuestionsResult.preferredQuestions;
    console.log("Retrieved questions:", questions);
    this.setState({ userQuestions: questions }, () => {
      console.log("Updated questions state:", this.state.userQuestions);
      // if (this.state.storedOpenaiResponse.videoId !== this.state.videoId){
      //   this.handleSubmit();
      // }
      // else {
      //   this.setState({ openAIResponse: this.state.storedOpenaiResponse})
      //   this.setState({ loading: false });
      // }
      this.handleSubmit();
    });
  }
  handleOptionsPageClick = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  };

  handleSubmit = async () => {
    const {
      questionOne,
      questionTwo,
      questionThree,
      questionFour,
      questionFive,
    } = this.state.userQuestions.techQuestions;
    const prompt = `Video title: ${this.state.videoTitle}, key topics: ${this.state.keywords[0]},  ${this.state.keywords[1]},  ${this.state.keywords[2]}, Questions: (1) ${questionOne} (2) ${questionTwo} (3) ${questionThree} (4) ${questionFour} (5) ${questionFive}`;
    let completion;
    try {
      completion = await generateChatCompletion(prompt);
      this.setState({ openAIResponse: completion });
    } catch (error) {
      console.error("Error:", error);
    }
    completion.videoId = this.state.videoId;
    chrome.storage.local.set({ openaiResponse: completion }, () => {
      console.log("openai answers set:", completion);
    });

    console.log(this.state.userQuestions.techQuestions);
    console.log(prompt);
    console.log(completion);
    this.setState({ loading: false });
  };

  render() {
    return (
      <div className="popup">
        <header className="popup-header">
          <h2 className="popup-title">Click Search - Key Topics:</h2>
          <span className="tag-item">{this.state.keywords[0]}</span>
          <span className="tag-item">{this.state.keywords[1]}</span>
          <span className="tag-item">{this.state.keywords[2]}</span>
          <button
            onClick={this.handleOptionsPageClick}
            className="options-page-button"
          >
            <img src="../../../logo193.png" alt="logo" class="logo"></img>
          </button>
        </header>
        {!this.state.loading ? (
          <div className="results">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={50}
              slidesPerView={1}
              loop={true}
              navigation
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
            >
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionOne}
                  text={this.state.openAIResponse.one}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionTwo}
                  text={this.state.openAIResponse.two}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionThree}
                  text={this.state.openAIResponse.three}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionFour}
                  text={this.state.openAIResponse.four}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ResultsCard
                  title={this.state.userQuestions.techQuestions.questionFive}
                  text={this.state.openAIResponse.five}
                />
              </SwiperSlide>
            </Swiper>
          </div>
        ) : (
          <div class="loading">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
