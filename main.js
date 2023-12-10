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
//callback function to sanitize and validate input of username field
const checkUsernameValidity = () =>{
    const sanitizedInput = DOMPurify.sanitize(usernameInput.value);
    const trimmedInput = validator.trim(sanitizedInput);
    const escapedInput = validator.escape(trimmedInput);

    const validation = isValid(escapedInput);
    const usernameNotTaken = userExists(escapedInput);

    if(!validation.valid || usernameNotTaken){
        setStartGameInvalidState();

        if(usernameNotTaken){
            validationMsg.innerHTML = "Username already in use";
        }else {
            validationMsg.innerHTML = validation.msg;
        }
    }else{
        currentUser = escapedInput;
        setStartGameValidState();
    }
}

//toggles selected indicator on answer buttons
const toggleSelectedIndicator = (e) =>{
    userSelection = true;

    if(e.target.id.includes("answer-selection")){
        const childrenArray = Array.from(e.target.parentElement.children);
        childrenArray.forEach((answerBtn) =>{
            answerBtn.children[0].style.border = "2px solid #fff";
            answerBtn.children[0].style.boxShadow = "none";
        })

        e.target.children[0].style.border = "none";
        e.target.children[0].style["box-shadow"] = "var(--blue-neon-box)";
        selectedAnswer = e.target.children[1].innerText;

        if(userSelection){
            e.target.parentElement.nextElementSibling.removeAttribute("disabled");
        }
    }else if(e.target.id.includes("-indicator") || e.target.id.includes("__text")){
        const childrenArray = Array.from(e.target.parentElement.parentElement.children);
        childrenArray.forEach((answerBtn) =>{
            answerBtn.children[0].style.border = "2px solid #fff";
            answerBtn.children[0].style.boxShadow = "none";
        })

        if(e.target.id.includes("-indicator")){
            e.target.style.border = "none";
            e.target.style["box-shadow"] = "var(--blue-neon-box)";

            selectedAnswer = e.target.nextElementSibling.innerText;
        }else{
            e.target.previousElementSibling.style.border = "none";
            e.target.previousElementSibling.style["box-shadow"] = "var(--blue-neon-box)";
            selectedAnswer = e.target.innerText;
        }
    }
}

//checks whether given answer is correct and updates users score
const checkAnswer = (question, userAnswer, correct) =>{
    const results = currentUserDetailedResults.entries().next().value;

    if(results[1].length < 10){
        if(userAnswer === correct){
            results[1].push({
                question,
                selectedAnswer,
                outcome: "Correct"
            })

            runningScore += 100;
        }else{
            results[1].push({
                question,
                selectedAnswer,
                outcome: "Incorrect"
            })
        }
    }
}
//handles gameend logic
const gameEnd = () =>{
    const score = runningScore.toString();
    const results = currentUserDetailedResults.entries().next().value;
    const stats = usersStats.entries().next().value;

    finalScoreSpan.innerHTML = score;
    stats[1].push({
        username: currentUser, 
        score: runningScore
    })

    const sortedStats = stats[1].sort((a,b) => (a.score < b.score) ? 1 : -1);

    resultsStats.forEach((rs, index) =>{
        rs.children[0].innerHTML = sortedStats[index].username;
        rs.children[1].innerHTML = sortedStats[index].score.toString();
    })

    resultsQuestions.forEach((rq, index) =>{
        rq.children[1].style["font-family"] = "var(--accent-font)";
        rq.children[0].children[0].innerHTML = results[1][index].question;
        rq.children[0].children[1].children[0].innerHTML = results[1][index].selectedAnswer;
        rq.children[1].innerHTML = results[1][index].outcome;

        if(results[1][index].outcome === "Correct"){
            rq.children[1].style.color = "green";
        }else if(results[1][index].outcome === "Incorrect"){
            rq.children[1].style.color = "var(--error-color)";
        }
    })
}

//displays questions and answer set from randomTen set
const loadQuestionsAndAnswers = () =>{
    if(nextQuestionNumber != lastSectionIndex){
        currentQuestion = randomQuestionSet.next().value;
        correctAnswer = currentQuestion.correctAnswer;
        sections[nextQuestionNumber].children[0].innerHTML = currentQuestion["question"];

        const answerNodes = Array.from(sections[nextQuestionNumber].children[1].children);

        answerNodes.forEach((node, index) => node.children[1].innerHTML = currentQuestion["answers"][index]);

        setTimeout(() =>{
            container.style.background = "rgba(11, 70, 96, 0.75"
        }, 350)
    }
}
