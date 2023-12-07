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

