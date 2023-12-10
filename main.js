//Input JSON data
import questions from './questions.json' assert { type: 'json' }
import users from './users.json' assert { type: 'json' }
//Add all DOM elements to file
const container = document.querySelector('.container');
const usernameInput = document.getElementById('username');
const validationMsg = document.getElementById('validation-msg');
const startBtn = document.getElementById('start-btn');
const nextBtns = document.querySelectorAll('.next-question');
const playAgainBtn = document.getElementById('play-again');
const startSection = document.getElementById('start');
const currentUserDisplay = document.getElementById('user-display');
const questionGroups = document.querySelectorAll('.question');
const endSection = document.getElementById('game-end');
const finalScoreSpan = document.querySelector('span[id="score"]');
const answerButtons = document.querySelectorAll('.answer');
const questionsInModal = document.querySelectorAll('.game-question');
const userStatsItems = document.querySelectorAll('.user-stat');
// Create array from all the answer buttons
const answers = [...answerButtons];
// Create array from buttons which trigger the displayed <section> element to change
const nextSectionTriggers = [startBtn, ...nextBtns];
// Create an array from all the <section> elements
const sections = [startSection, ...questionGroups, endSection];
// Create an array from all question <li> elements in detailed results modal
const resultsQuestions = [...questionsInModal];
// Create an array from all stat <li> elements at the end of the game
const resultsStats = [...userStatsItems];
// Create array from the questions.json object keys, which will help in selecting random questions
const questionsKeysArray = Object.keys(questions);
// Create array from the users.json object values
const usersValuesArray = Object.values(users);
//create a new set which will store 10 random questions
const randomTen = new Set();
//creates a set to store created usernames
const gameUsers = new Set();
//variable to store user's chosen username
let currentUser;
//the running score during the trivia game
let runningScore = 0;
//necessary variables for cycling through different sections
const lastSectionIndex = sections.length - 1;
let displayedSectionIndex = 0;
let sectionOffset;
//necessary variables to display questions and set selected answer
let nextQuestionNumber = displayedSectionIndex + 1;
let currentQuestion;
let selectedAnswer;
let correctAnswer;
let userSelection = false;

//map to store detailed results
const currentUserDetailedResults = new Map();
currentUserDetailedResults.set("results", []);
//map to store users stats
const usersStats = new Map();
usersStats.set("stats", []);
//adds usernames entered to gameUsers Set and full fake user objects to userStats Map
for(const user of usersValuesArray){
    gameUsers.add(user.username);
    usersStats.entries().next().value[1].push(user);
}
//adds 10 randomm questions from JSON file to question array
while(randomTen.size < 10){
    const randomIndex = Math.floor(Math.random() * questionsKeysArray.length);
    const randomObjectKey = questionsKeysArray[randomIndex];
    if(randomTen.has(questions[randomObjectKey])) {
        continue;
    }else{
        randomTen.add(questions[randomObjectKey]);
    }
}
//accesses set's values
const randomQuestionSet = randomTen.values();

//if DOM's readystate is complete, move all question sections out of view
document.onreadystatechange = (e) =>{
    if(document.readyState === "complete"){
        sections.forEach((section, index) =>{
            section.style.transform = `translateX(${index * 100} %)`;
        })
    }
}
//handles valid & invalid state at game start
const setStartGameInvalidState = () =>{
    usernameInput.style.border = "2px solid rgb(211, 70, 70)";
    validationMsg.style.display = "block";
    startBtn.setAttribute("disabled", "");
}
const setStartGameValidState = () =>{
    usernameInput.style.border = "2px solid black";
    validationMsg.style.display = "none";
    startBtn.removeAttribute("disabled");
}
//helper function to check if username already exists
const userExists = (username) =>{
    if(gameUsers.has(username)){
        return true;
    }else{
        return false;
    }
}
//checks validity of usernameInput using Validator.js package
const isValid = (usernameInputValue) =>{
    if(validator.isEmpty(usernameInputValue) && validator.isLength(usernameInputValue, { min: 5})){
        return{
            valid: true,
            msg: null,
        }
    }else{
        if(validator.isEmpty(usernameInputValue)){
            return{
                valid: false,
                msg: "Required"
            }
        }else if(!validator.isLength(usernameInputValue, { min: 5})){
            return{
                valid: false,
                msg: "Minimum 5 characters"
            }
        }else{
            return{
                valid: false,
                msg: "Input invalid"
            }
        }
    }
}

