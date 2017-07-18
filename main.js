var BasicCard = require("./basicCard.js");
var ClozeCard = require("./clozeCard.js");
var inquirer = require("inquirer");

var basicDeck = [];
var basicDeckQuestions = [];
var clozeDeck = [];
var clozeDeckFullText = [];
var combinedDeck = [];

var score = 0;
var count = 0;

function initial() {
	inquirer.prompt([
		{
			type: "list",
			message: "What would you like to do with the flashcards?",
			choices: ["Read", "Add", "Remove", "Exit"],
			name: "action"
		}
	]).then(function(userResponse) {
		var action = userResponse.action;
		switch (action) {
			// If user wants to read the deck of flashcards
			case "Read":
				// If there are no flashcards available
				if (combinedDeck.length === 0) {
					console.log("There are currently no flashcards in your basic and cloze decks to read.");
					initial();
				// If there are flashcards available
				} else {
					readFlashcards();
				}
				break;
			// If user wants to add to the deck of flashcards
			case "Add":
				addFlashcards();
				break;
			// If user wants to remove cards
			case "Remove":
				// If there are no flashcards available
				if (combinedDeck.length === 0) {
					console.log("There are currently no flashcards in your basic and cloze decks to remove.");
					initial();					
				// If there are flashcards available
				} else {
					removeFlashcards();
				}
				break;
			// If user wants to exit the application
			case "Exit":
				console.log("Thanks for playing!");
				break;
		};
	});
};

function readFlashcards() {
	// Reset flashcard count per 'read flashcard' round
	count = 0;
	// Reset score per 'read flashcard' round
	score = 0;
	// Ask user what type of flashcards he/she wants to see
	inquirer.prompt([
		{
			type: "list",
			message: "Which type of flashcards would you like to read?",
			choices: ["Basic", "Cloze", "All"],
			name: "cardType"
		}
	]).then(function(userResponse) {
		var cardType = userResponse.cardType;
		switch (cardType) {
			// If user wants to read the deck of basic flashcards
			case "Basic":
				// If there are no basic flashcards available
				if (basicDeck.length === 0) {
					console.log("There are currently no flashcards in your basic deck to read.");
					// Return to main menu to allow users to add flashcards
					initial();
				// If there are basic flashcards available
				} else {
					// Shuffle basic flashcards array before returning it to the user
					shuffle(basicDeck);
					readBasicFlashcards();
				}
				break;
			// If user wants to read the deck of cloze flashcards
			case "Cloze":
				// If there are no cloze flashcards available
				if (clozeDeck.length === 0) {
					console.log("There are currently no flashcards in your cloze deck to read.");
					// Return to main menu to allow users to add flashcards
					initial();	
				// If there are cloze flashcards available
				} else {
					// Shuffle basic flashcards array before returning it to the user
					shuffle(clozeDeck);
					readClozeFlashcards();
				}
				break;
			// If user wants to read both basic and cloze flashcards
			case "All":
				shuffle(combinedDeck);
				readAllFlashcards();
		};
	});
};

function readBasicFlashcards() {
	// For each flashcard in basic flashcards array
	if (count < basicDeck.length) {
		// console.log("Current Count: " + count);
		// console.log("Current Flashcard: ", basicDeck[count]);
		// console.log("Current Flashcard Front: ", basicDeck[count].front);
		// console.log("Current Flashcard Back: ", basicDeck[count].back);
		inquirer.prompt([
			{
				type: "input", 
				message: basicDeck[count].front,
				name: "userAnswer",
				validate: function(input) {
					if (!input) {
						return "Please provide an answer.";
					} else {
						return true;
					}
				}
			}
		]).then(function(userResponse) {
			// If user answer matches the flashcard answer
			if (basicDeck[count].back.toLowerCase() === userResponse.userAnswer.toLowerCase()) {
				console.log("You are correct.");
				// Increment score by 1
				score++;
			// If user answer does not match the flashcard answer
			} else {
				console.log("That is incorrect.");
			}
			// Show user the correct answer
			console.log("Correct Answer: " + basicDeck[count].back);
			console.log("-------------------------------------");
			// Increment count by 1 to continue looping the rest of the basic flashcards array
			count++;
			readBasicFlashcards();
		});
	// If the user is done looping through the entire basic flashcards array
	} else {
		console.log("Game Over!");
		console.log("Final Score: " + score + "/" + basicDeck.length);
		playAgain();						
	}
};

function readClozeFlashcards() {
	// For each flashcard in cloze flashcards array
	if (count < clozeDeck.length) {
		// console.log("Current Count: " + count);
		// console.log("Current Flashcard: ", clozeDeck[count]);
		// console.log("Current Flashcard Front: ", clozeDeck[count].partial);
		// console.log("Current Flashcard Back: ", clozeDeck[count].cloze);
		inquirer.prompt([
			{
				type: "input", 
				message: clozeDeck[count].partial,
				name: "userAnswer",
				validate: function(input) {
					if (!input) {
						return "Please provide an answer.";
					} else {
						return true;
					}
				}
			}
		]).then(function(userResponse) {
			// If user answer matches the flashcard answer
			if (clozeDeck[count].cloze.toLowerCase() === userResponse.userAnswer.toLowerCase()) {
				console.log("You are correct.");
				// Increment score by 1
				score++;
			// If user answer does not match the flashcard answer
			} else {
				console.log("That is incorrect.");
			}
			// Show user the entire text
			console.log(clozeDeck[count].fullText);
			console.log("-------------------------------------");
			// Increment count by 1 to continue looping the rest of the cloze flashcards array
			count++;
			readClozeFlashcards();
		});
	// If the user is done looping through the entire cloze flashcards array
	} else {
		console.log("Game Over!");
		console.log("Final Score: " + score + "/" + clozeDeck.length);
		playAgain();						
	}
};

function readAllFlashcards() {
	// For each flashcard in combined flashcards array
	if (count < combinedDeck.length) {
		// If the flashcard is a basic flashcard
		if (combinedDeck[count] instanceof BasicCard) {
			inquirer.prompt([
				{
					type: "input", 
					message: combinedDeck[count].front,
					name: "userAnswer",
					validate: function(input) {
						if (!input) {
							return "Please provide an answer.";
						} else {
							return true;
						}
					}
				}
			]).then(function(userResponse) {
				// If user answer matches the flashcard answer
				if (combinedDeck[count].back.toLowerCase() === userResponse.userAnswer.toLowerCase()) {
					console.log("You are correct.");
					// Increment score by 1
					score++;
				// If user answer does not match the flashcard answer
				} else {
					console.log("That is incorrect.");
				}
				// Show user the correct answer
				console.log("Correct Answer: " + combinedDeck[count].back);
				console.log("-------------------------------------");
				// Increment count by 1 to continue looping the rest of the basic flashcards array
				count++;
				readAllFlashcards();
			});
		// If the flashcard is a cloze flashcard
		} else if (combinedDeck[count] instanceof ClozeCard) {
			inquirer.prompt([
				{
					type: "input", 
					message: combinedDeck[count].partial,
					name: "userAnswer",
					validate: function(input) {
						if (!input) {
							return "Please provide an answer.";
						} else {
							return true;
						}
					}
				}
			]).then(function(userResponse) {
				// If user answer matches the flashcard answer
				if (combinedDeck[count].cloze.toLowerCase() === userResponse.userAnswer.toLowerCase()) {
					console.log("You are correct.");
					// Increment score by 1
					score++;
				// If user answer does not match the flashcard answer
				} else {
					console.log("That is incorrect.");
				}
				// Show user the entire text
				console.log(combinedDeck[count].fullText);
				console.log("-------------------------------------");
				// Increment count by 1 to continue looping the rest of the cloze flashcards array
				count++;
				readAllFlashcards();
			});
		}
	// If the user is done looping through the entire combined flashcards array	
	} else {
		console.log("Game Over!");
		console.log("Final Score: " + score + "/" + combinedDeck.length);
		playAgain();	
	}
};

function addFlashcards() {
	// Ask user what type of card he/she would like to add
	inquirer.prompt([
		{
			type: "list",
			message: "What type of flashcard would you like to add?",
			choices: ["Basic", "Cloze"],
			name: "cardType"
		},
		{
			type: "input",
			message: "Question (Basic) or Statement (Cloze): ",
			name: "front",
			validate: function(input) {
				if (!input) {
					return "Please provide a question or statement for the front of your flashcard.";
				} else {
					return true;
				}
			}
		},
		{
			type: "input", 
			message: "Answer: ",
			name: "back",
			validate: function(input) {
				if (!input) {
					return "Please provide the answer to the previous question or statement for the back of your flashcard.";
				} else {
					return true;
				}
			}
		}
	]).then(function(userResponse) {
		// If user wants to add a basic flashcard
		if (userResponse.cardType === "Basic") {
			var newBasic = BasicCard(userResponse.front, userResponse.back);
			// Add the basic flashcard to the 'basic deck' and 'back deck questions' array
			basicDeck.push(newBasic);
			basicDeckQuestions.push(newBasic.front);
			// console.log("Basic Deck Update: ", basicDeck);
			// Add the basic flashcard to the 'combined deck' array
			combinedDeck.push(newBasic);
			console.log("Flashcard added to basic deck.");
			// console.log("-------------------------------------");
		// If user wants to add a cloze flashcard
		} else {
			var newCloze = ClozeCard(userResponse.front, userResponse.back);
			// If the new cloze flashcard is valid
			if (Object.keys(newCloze).length !== 0) {
				// Add the basic flashcard to the 'cloze deck' and 'cloze deck full text' array
				clozeDeck.push(newCloze);
				clozeDeckFullText.push(newCloze.fullText);
				// console.log("Cloze Deck Update: ", clozeDeck);
				// Add the basic flashcard to the 'combined deck' array
				combinedDeck.push(newCloze);
				console.log("Flashcard added to cloze deck.");
				// console.log("-------------------------------------");
			// If the new cloze flashcard is not valid
			} else {
				console.log("Fail to add flashcard to cloze deck.");
				// console.log("-------------------------------------");
			}
		}
		// console.log("Returning to main menu...");
		initial();
	});
};

function removeFlashcards() {
	// Ask user what type of card he/she would like to remove
	inquirer.prompt([
		{
			type: "list",
			message: "Which type of flashcards would you like to remove?",
			choices: ["Basic", "Cloze"],
			name: "cardType"
		}
	]).then(function(userResponse) {
		var cardType = userResponse.cardType;
		switch (cardType) {
			// If user wants to remove from the deck of basic flashcards
			case "Basic":
				// If there are no basic flashcards available
				if (basicDeck.length === 0) {
					console.log("There are currently no flashcards in your basic deck to remove.");
					// Return to main menu to allow users to add flashcards
					initial();
				// If there are basic flashcards available
				} else {
					removeBasicFlashcards();
				}
				break;
			// If user wants to remove from the deck of cloze flashcards
			case "Cloze":
				// If there are no cloze flashcards available
				if (clozeDeck.length === 0) {
					console.log("There are currently no flashcards in your cloze deck to remove.");
					// Return to main menu to allow users to add flashcards
					initial();	
				// If there are cloze flashcards available
				} else {
					removeClozeFlashcards();
				}
				break;
		};
	});
};

function removeBasicFlashcards() {
	inquirer.prompt([
		{
			type: "checkbox", 
			message: "Which of the following would you like to remove?",
			choices: basicDeckQuestions,
			name: "remove",
			validate: function(answers) {
				if (answers.length === 0) {
					return "Please choose at least one of the flashcards above to remove.";
				} else {
					return true;
				}
			}
		}
	]).then(function(userResponse) {
		// console.log("Remove the Following: ", userResponse.remove);
		var remove = userResponse.remove;
		// console.log("Previous Combined Deck: ", combinedDeck);
		remove.forEach(function(removeCard) {
			// console.log("Remove This: " + removeCard);
			for (var i = 0; i < basicDeck.length; i++) {
				if (removeCard === basicDeck[i].front) {
					basicDeck.splice(i, 1);
				}
			};
			for (var i = 0; i < basicDeckQuestions.length; i++) {
				if (removeCard === basicDeckQuestions[i]) {
					basicDeckQuestions.splice(i, 1);
				}
			};
			for (var i = 0; i < combinedDeck.length; i++) {
				if (removeCard === combinedDeck[i].front) {
					combinedDeck.splice(i, 1);
				}
			};
		});
		console.log("Flashcard(s) removed from basic deck.");
		// console.log("Updated Combined Deck: ", combinedDeck);
		// console.log("-------------------------------------");
		// console.log("Returning to main menu...");
		initial();
	});
};

function removeClozeFlashcards() {
	inquirer.prompt([
		{
			type: "checkbox", 
			message: "Which of the following would you like to remove?",
			choices: clozeDeckFullText,
			name: "remove",
			validate: function(answers) {
				if (answers.length === 0) {
					return "Please choose at least one of the flashcards above to remove.";
				} else {
					return true;
				}
			}
		}
	]).then(function(userResponse) {
		// console.log("Remove the Following: ", userResponse.remove);
		var remove = userResponse.remove;
		// console.log("Previous Combined Deck: ", combinedDeck);
		remove.forEach(function(removeCard) {
			// console.log("Remove This: " + removeCard);
			for (var i = 0; i < clozeDeck.length; i++) {
				if (removeCard === clozeDeck[i].fullText) {
					clozeDeck.splice(i, 1);
				}
			};
			for (var i = 0; i < clozeDeckFullText.length; i++) {
				if (removeCard === clozeDeckFullText[i]) {
					clozeDeckFullText.splice(i, 1);
				}
			};
			for (var i = 0; i < combinedDeck.length; i++) {
				if (removeCard === combinedDeck[i].fullText) {
					combinedDeck.splice(i, 1);
				}
			};
		});
		console.log("Flashcard(s) removed from cloze deck.");
		// console.log("Updated Combined Deck: ", combinedDeck);
		// console.log("-------------------------------------");
		// console.log("Returning to main menu...");
		initial();
	});
};

function playAgain() {
	inquirer.prompt([
		{
			type: "list",
			message: "Play Again?",
			choices: ["Yes", "No", "Main Menu"],
			name: "playAgain"
		}
	]).then(function(userResponse) {
		var playAgain = userResponse.playAgain;
		switch (playAgain) {
			// If user wants to play again, ask if user wants to read the basic or cloze flashcards
			case "Yes":
				readFlashcards();
				break;
			// If user does not want to play again, exit the application
			case "No": 
				console.log("Thanks for playing!");
				break;
			// If user wants to return to the main menu for more options (i.e. add more cards), return to main menu
			case "Main Menu":
				initial();
				break;
		};
	});
};

function shuffle(arr) {
	let counter = arr.length;
	while (counter > 0) {
		// Pick a random index from 0 to the current counter
		let index = Math.floor(Math.random() * counter);
		// Decrease counter by 1
		counter--;
		let temp = arr[counter];
		// Reassign the current counter's value to a random number's value
		arr[counter] = arr[index];
		// Reassign the random number's value to the current counter's value
		arr[index] = temp;
	};
};

initial();

