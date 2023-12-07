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
//array of all stats elements at the end of the game
const resultsStats = [...userStatsItems];
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
//adds usernames to gameUsers set and full objects into userStats Map
for(const users of usersValuesArray){
    gameUsers.add(user.username);
    usersStats.entries().next().value[1].push(user);
}
//adds ten questions at random from the JSON file into the randomTen array
while(randomTen.size < 10){
    //returns random whole number less than the total amount of questions in JSON file
    const randomIndex = Math.floor(Math.random() * questionsKeysArray.length);
    //returns the reference to the question in the array according to the index number it received from random number pull above
    const randomObjectKey = questionsKeysArray[randomIndex];
    //if question already is inside the array, continue on, if not, add to the array.
    if(randomTen.has(questions[randomObjectKey])){
        continue;
    }else{
        randomTen.add(questions[randomObjectKey]);
    }
}
//returns the questions contained in the set into another variable for further use
const randomQuestionsSet = randomTen.values();

//if DOM's readyState is "complete", move all question sections out of view
document.onreadystatechange= (e) =>{
    if(document.readyState === 'complete'){
        sections.forEach((section, index) =>{
            section.style.transform = `translateX(${index * 100}%)`;
        })
    }
}

//handle valid and invalid state at the starting point of game
const setStartGameInvalidState = () =>{
    usernameInput.style.border = "2px solid rgb(211, 70, 70)";
    validationMsg.style.display = "block";
    startBtn.setAttribute('disabled', '');
}

const setStartGameValidState = () =>{
    usernameInput.style.border = '2px solid black';
    validationMsg.style.display = 'none';
    startBtn.removeAttribute('disabled');
}

//checks to see if the username entered already exists or not
const userExists = (username) =>{
    if(gameUsers.has(username)){
        return true;
    }else{
        return false;
    }
}

//checks validity of usernameInput value
const isValid = (usernameInputValue) =>{
    if(!validator.isEmpty(usernameInputValue) && validator.isLength(usernameInputValue, { min: 5})){
        return{
            valid: true,
            msg: null
        }
    }else{
        if(validator.isEmpty(usernameInputValue)){
            return{
                valid: false,
                msg: "required"
            }
        }else if(!validator.isLength(usernameInputValue, { min: 5})){
            return{
                valid: false,
                msg: "Minimum 5 characters"
            }
        }else {
            return{
                valid: false,
                msg: "Input invalid"
            }
        }
    }
}

//sanitizes and validates input value from username field
const checkusernameValidity = () => {
    const sanitizedInput = DOMPurify.sanitize(usernameInput.value);
    const trimmedInput = validator.trim(sanitizedInput);
    const escapedInput = validator.escape(trimmedInput);

    const validation = isValid(escapedInput);
    const usernameNotTaken = userExists(escapedInput);

    if(!validation.valid || usernameNotTaken){
        setStartGameInvalidState();

        if(usernameNotTaken){
            validationMsg.innerHTML = "Username already in use";
        }else{
            validationMsg.innerHTML = validation.msg;
        }
    }else{
        currentUser = escapedInput;
        setStartGameValidState();
    }
}

//toggles select indicator on any given answer button
const toggleSelectIndicator = (e) =>{
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
            e.target.parentElement.nextElementSibling.removeAttribute('disabled');
        }
    }else if(e.target.id.includes('-indicator') || e.target.id.includes('__text')){
        const childrenArray = Array.from(e.target.parentElement.parentElement.children);
        childrenArray.forEach((answerBtn) =>{
            answerBtn.children[0].style.border = "2px solid #fff";
            answerBtn.children[0].style.boxShadow = "none";
        })

        if(e.target.id.includes('-indicator')){
            e.target.style.border = 'none';
            e.target.style["box-shadow"] = "var(--blue-neon-box)";

            selectedAnswer = e.target.nextElementSibling.innerText;
        }else {
            e.target.previousElementSibling.style.border = 'none';
            e.target.previousElementSibling.style['box-shadow'] = 'var(--blue-neon-box)';

            selectedAnswer = e.target.innerText;
        }

        if(userSelection){
            e.target.parentElement.parentElement.nextElementSibling.removeAttribute('disabled');
        }
    }
}

//checks to see if chosen answer is correct, and will update users score
const checkAnswer = (question, userAnswer, correct) =>{
    const results = currentUserDetaiedResults.entries().next().value;

    if(results[1].length < 10){
        if(userAnswer === correct){
            results[1].push({
                question,
                selectedAnswer,
                outcome: "Correct"
            })

            runningScore += 100;
        } else{
            results[1].push({
                question,
                selectedAnswer,
                outcome: "Incorrect"
            })
        }
    }
}



//Logic for end of game
const gameEnd = () =>{
    const score = runningScore.toString();
    const results = currentUserDetaiedResults.entries().next().value;
    const stats = usersStats.entries().next().value;

    finalScoreSpan.innerHTML = score;

    stats[1].push({username: currentUser, score: runningScore});

    const sortedStats = stats[1].sort((a,b) => (a.score < b.score) ? 1 : -1);

    resultsStats.forEach((rs, index) =>{
        rs.children[0].innerHTML = sortedStats[index].username;
        rs.children[1].innerHTML = sortedStats[index].score.toString();
    })

    resultQuestions.forEach((rq, index) =>{
        rq.children[1].style['font-family'] = "var(--accent-font)";
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

//displays answer and question set from randomTen Set
const loadQuestionAndAnswers = () =>{
    if(nextQuestionNumber != lastSectionIndex){
        currentQuestion = randomQuestionsSet.next().value;
        correctAnswer = currentQuestion.correctAnswer;
        sections[nextQuestionNumber].children[0].innerHTML = currentQuestion["question"];

        const answerNodes = Array.from(sections[nextQuestionNumber].children[1].children);

        answerNodes.forEach((node, index) => node.children[1].innerHTML = currentQuestion["answers"][index]);
        setTimeout(() => {
            container.style.background = "rgba(11, 70, 96, 0.75)";
        }, 350);
    }
}

//Allows for transferring to next section
const goToNextSection = () =>{
    sections.forEach((section, loopIndex) =>{
        sectionOffset = loopIndex - displayedSectionIndex;
        section.style.transform = `translateX(${sectionOffset + 100}%)`;
        section.style.opacity = 1;
    })
}

//callback function to move to next section element
const nextSectionClickListener = (e) =>{
    if(e.target.id === "start-btn"){
        gameUsers.add(currentUser);
        currentUserDisplay.children[0].innerHTML = currentUser;
        currentUserDisplay.style.display = "block";
    }

    if(correctAnswer && selectedAnswer){
        checkAnswer(currentQuestion["question"], selectedAnswer, correctAnswer);
    }

    if(displayedSectionIndex === lastSectionIndex - 1){
        userSelection = false;
        displayedSectionIndex++;
        gameEnd();
        goToNextSection();
    }else{
        loadQuestionAndAnswers();
        userSelection = false;
        displayedSectionIndex++;
        nextQuestionNumber++;
        goToNextSection();
    }
}

//adds eventlistener to all section change buttons
nextSectionTriggers.forEach((trigger) =>{
    trigger.addEventListener('click', (e) => nextSectionClickListener(e));
})

//adds listeners to all answer buttons
answers.forEach((answer) =>{
    answer.addEventListener('click', (e) => toggleSelectIndicator(e));
})

//adds input and blur listeners to username input field
usernameInput.addEventListener('input', checkusernameValidity);
usernameInput.addEventListener('blur', checkusernameValidity);

//adds listener to play again button
playAgainBtn.addEventListener('click', () => window.location.reload());