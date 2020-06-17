import React from 'react';
import './App.css';
import axios from 'axios';
import {CircularProgress} from '@material-ui/core';
import Quote from './components/Quote';
import Rating from './components/Rating';
import 'react-rater/lib/react-rater.css';

export default class App extends React.Component {
  constructor(props){
      super(props)
      this.state = {
          currentQuote:{},
          usedQuotes:[],
          isLoading:true,
          allRated:false
      }
      this.firstFetchData = this.firstFetchData.bind(this);
      this.userChoiceData = this.userChoiceData.bind(this);
  }

  //This function is called when the web app is loaded for the first time
  firstFetchData()
  {
    //Making a GET call to get random quote.
    axios.get('/random')
    .then(result => {
      console.log(result)
          this.setState({
                currentQuote:result.data.result,
                usedQuotes: [...this.state.usedQuotes, result.data.result._id],
                isLoading:false
            });
    })
    .catch();
  }

  //This function is called when the user starts voting.Based on their vote, a quote is displayed.
  userChoiceData(vote)
  {
    //Extracting rating value from rating component.
    const {rating} = vote;
    const voteData = {
      quoteId: this.state.currentQuote._id,
      newVote:rating
    }

    //POSTing back to quote API the vote of the user from rating component.
    axios.post('https://programming-quotes-api.herokuapp.com/quotes/vote',voteData)
      .then(result => {
        console.log("Voting result:",result);
      })
      .catch(err => console.log(err));

    // Extracting/Destructuring data from the state
    const {
      currentQuote:{
            categories,
            sentimentScore
      },
      usedQuotes} = this.state;

    // Preparing data to query the DB from the backend
    const filterData = {
      categories,
      sentimentScore,
      usedQuotes
    }

    // This variable holds the value of the api URL based according to the user's needs.
    const API_URL = '/' + (rating < 4 ? 'opposite' : 'similar');
    
    // Setting the isLoading to true so that circular progress bar is shown to user while we fetch the result
    this.setState({ isLoading: true }, () => {

        axios.post(API_URL,filterData)
        .then(result => {
            // If the return data's length is 0, then that means the user has rated all quotes.
            if(result.data.resultLength === 0)
            {
              this.setState({
                    isLoading:false,
                    allRated:true
              })
            }
            else
            {
              this.setState({
                    currentQuote:result.data.result,
                    usedQuotes: [...this.state.usedQuotes, result.data.result._id],
                    isLoading:false
              });
            }
        })
        .catch(err => console.log(err));
    });
  }

  componentDidMount()
  {
    this.firstFetchData()
  }

  render(){
    var {currentQuote} = this.state;
      return (
        <div className="App">
            <div id="heading">Quote Rater</div>
            {
              // Display Loading Circular bar if isLoading is true
              this.state.isLoading
                ? <CircularProgress/>

                // Display Quote and Rating component if isLoading is false,i.e., the user has not yet rated all quotes.
                : !this.state.allRated
                    ?   
                        <>
                          <Quote quote={currentQuote}/>
                          <Rating onRate={this.userChoiceData}/>
                        </>
                    :
                      // Control reaches here when the user has rated all quotes from the API as the length of the result
                      // array will be 0 as no result will be returned because all quote IDs are in usedQuotes array.
                      <div>
                        You have rated all quotes. You can reload the page if you want to rate again.
                      </div>
            }
        </div>
      );
  }
}

