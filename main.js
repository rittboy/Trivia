//import JSON files
import questions from './questions.json' assert { type: 'json'}
import users from './users.json' assert { type: 'json'}
//get all DOM elements
const container = document.querySelector('.container');
const usernameInput = document.getElementById('username');
const validationMsg = document.getElementById('validation-msg');
const startBtn = document.getElementById('start-btn');
const nextBtns = document.getElementById('.next-question');
const playAgainBtn = document.getElementById('play-again');
const startSection = document.getElementById('start');
const currentUserDisplay = document.getElementById('user-display');
const questionGroups = document.querySelectorAll('.question');
const endSection = document.getElementById('.question');
const finalScoreSpan = document.querySelector('span[id="score"]');
const answerButtons = docuemnt.querySelectorAll('.answer');
const questionsInModal = docuemnt.querySelectorAll('.game-question');
const userStatsItems = docuemnt.querySelectorAll('.user-stat');

//create array of answer buttons
const ansewrs = [...answerButtons];
//create array from buttons which cause change in section
const nextSectionTriggers = [startBtn, ...nextBtns];
//create an array of all <section> elements
const sections = [startSection, ...questionGroups, endSection];
//create an array from all stats listed in modal
const resultQuestions = [...questionsInModal];
//creates array of all questions asked, and is used in randomTen variable
const questionsKeysArray = Object.keys(questions);
//creates array fropm users.json file
const usersValuesArray = Object.values(users);
//creates a new set of questions pulled from JSON file in random order
const randomTen = new Set();
//creates a variable for usernames
const gameUsers = new Set();
//Variable for current Username
let currentUser;
//variable for running score of current game
let runningScore = 0;

//allows for cycling through sections of display
const lastSectionIndex = sections.length - 1;
let displayedSectionIndex = 0;
let sectionOffset;

//allows for display of question and stores the selected answer
let nextQuestionNumber = displayedSectionIndex + 1;
let currentQuestion;
let selectedAnswer;
let userSelection = false;

//creates a map of detailed results
const currentUserDetaiedResults = new Map();
currentUserDetaiedResults.set("results", []);
//creates a map of all user stats
const usersStats = new Map();
usersStats.set("stats", []);

