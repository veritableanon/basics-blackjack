// There will be only two players. One human and one computer.
// The computer will always be the dealer. The dealer has to hit if their hand is below 17.
// The player who is closer to 21 wins the hand. Aces can be 1 or 11

//Rules
// 1. user places a bet
// 2. everyone is dealt one open card
// 3. user dealt one more open card; computer dealt a closed card
// 4. aces can be 1 or 11 anytime
// 5. when 2 cards total 21, automatically win 1.5 times and round ends
// 6. otherwise user gets to hit as many times until 21.
// 7. if exceed 21, user busts and dealer wins
// 8. if user has drawn enough cards, choose to stay
// 9. then dealer opens closed card
// 10. if dealer 16 or less, dealer must hit
// 11. if dealer 17 or higher, dealer must stay
// 12. if dealer busts, user will win double the bet.
// 13. if the dealer does not bust, user wins only if higher points. user wins double the bet.

//BASE
// Deck is shuffled.
// >> function to shuffle deck
// User clicks Submit to deal cards.
// >> in main, run function to deal cards in this order: userCard1(open), computerCard1(open), userCard2(open), computerCard2(closed)
// The cards are analysed for game winning conditions, e.g. Blackjack.
// >> if (userCard1 or userCard2) == ace && (userCard1 or userCard2) == 10, jack, queen, king; user wins
// The cards are displayed to the user.
// >>output message = show userCard1, userCard2 and userTotal, computerCard1
// The user decides whether to hit or stand, using the submit button to submit their choice.
// >> change program mode userTurn. Hit = run function draw another card to userHand and calculate new userTotal. Stand = change program mode to checkUserHand
// The user's cards are analysed for winning or losing conditions.
// >> run function sum cards in userHand. If more than 21, computer wins and restart game. If less than or equals to 21, change program mode to computerTurn
// The computer decides to hit or stand automatically based on game rules.
// >> run function sum computerHand. If computer hand 16 or less, computer hits and calculate new computerTotal show computer new card and new total. Repeat mode computerTurn until computerTotal 17 or more. If computerTotal 17 or more, change program mode to compareResults.
// >> If computerTotal > userTotal, computer wins, then restart game.
// >> If computerTotal < userTotal, user wins, then restart game.
// >> If computerTotal == usersTotal, it is a tie, then restart game.
// The game either ends or continues.

///////////////////////////////////////////////////////GLOBAL VARIABLES AND STATES///////////////////////////////////////////
var STAGE_DEAL_CARDS = "STAGE_DEAL_CARDS";
var STAGE_HIT_STAND = "STAGE_HIT_STAND";
var STAGE_COMPUTER_TURN = "STAGE_COMPUTER_TURN";
var STAGE_GAME_OVER = "STAGE_GAME_OVER";
var STAGE_USERNAME = "STAGE_USERNAME";
var STAGE_USER_BET = "STAGE_USER_BET";
var computerHand = [];
var userData = [
  {
    name: "",
    hand: [],
    score: 100,
    bet: 0,
  },
];
var userTotal = 0;
var computerTotal = 0;
var programStage = STAGE_USERNAME;

//////////////////////////////////////////////////////////HELPER FUNCTIONS////////////////////////////////////////////////////

//function: array containing userData with

//function: make card deck
var makeDeck = function () {
  var cardDeck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];

  var suitIndex = 0;
  while (suitIndex < suits.length) {
    var cardSuit = suits[suitIndex];
    var cardIndex = 1;
    while (cardIndex <= 13) {
      var cardName = cardIndex;
      var cardValue = cardIndex;
      if (cardName == 1) {
        cardName = "Ace";
        cardValue = 11;
      } else if (cardName == 11) {
        cardName = "Jack";
        cardValue = 10;
      } else if (cardName == 12) {
        cardName = "Queen";
        cardValue = 10;
      } else if (cardName == 13) {
        cardName = "King";
        cardValue = 10;
      }

      var card = {
        name: cardName,
        suit: cardSuit,
        cardIndex: cardIndex,
        value: cardValue,
      };

      cardDeck.push(card);
      cardIndex += 1;
    }
    suitIndex += 1;
  }
  return cardDeck;
};
//function: make card deck
var makeDeck = function () {
  var cardDeck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];

  var suitIndex = 0;
  while (suitIndex < suits.length) {
    var cardSuit = suits[suitIndex];
    var cardIndex = 1;
    while (cardIndex <= 13) {
      var cardName = cardIndex;
      var cardValue = cardIndex;
      if (cardName == 1) {
        cardName = "Ace";
        cardValue = 11;
      } else if (cardName == 11) {
        cardName = "Jack";
        cardValue = 10;
      } else if (cardName == 12) {
        cardName = "Queen";
        cardValue = 10;
      } else if (cardName == 13) {
        cardName = "King";
        cardValue = 10;
      }

      var card = {
        name: cardName,
        suit: cardSuit,
        cardIndex: cardIndex,
        value: cardValue,
      };

      cardDeck.push(card);
      cardIndex += 1;
    }
    suitIndex += 1;
  }
  return cardDeck;
};

//Function: shuffle card deck and return shuffled cards
var getRandomIndex = function (max) {
  return Math.floor(Math.random() * max);
};

var shuffleCards = function (deckToShuffle) {
  var currentIndex = 0;
  while (currentIndex < deckToShuffle.length) {
    var randomIndex = getRandomIndex(deckToShuffle.length);
    var randomCard = deckToShuffle[randomIndex];
    var currentCard = deckToShuffle[currentIndex];
    deckToShuffle[currentIndex] = randomCard;
    deckToShuffle[randomIndex] = currentCard;
    currentIndex = currentIndex + 1;
  }
  return deckToShuffle;
};

var shuffledDeck = shuffleCards(makeDeck());

// Function: deal 1 card to player, 1 card to computer. Repeat one more time.
var dealStartingCards = function () {
  var dealIndex = 0;
  //start loop to deal cards twice to each player
  while (dealIndex < 2) {
    //deal 1 card to user
    userData[0].hand.push(shuffledDeck.pop());
    //update global variable for user's total points
    updateUserTotal();
    //deal 1 card to computer
    computerHand.push(shuffledDeck.pop());
    //update global variable for computer's total points
    updateComputerTotal();
    dealIndex += 1;
  }
};

// Function: check if user's starting hand is Blackjack
var isBlackjack = function () {
  //evaluate to TRUE statement which can be used in main function as a conditional
  return userData[0].hand[0].value + userData[0].hand[1].value == 21;
};

// function to output message for a player's cards
var outputCards = function (aHand) {
  //set a loop to run through a player's entire hand and output all the cards' names and suits
  var cardsIndex = 0;
  var outputCardsMessage = "";
  while (cardsIndex < aHand.length) {
    outputCardsMessage =
      outputCardsMessage +
      aHand[cardsIndex].name +
      " of " +
      aHand[cardsIndex].suit +
      "<br>";
    cardsIndex += 1;
  }
  console.log("outputUserCards:");
  console.log(outputCardsMessage);
  return outputCardsMessage;
};

// function calculate total value of cards in a hand, also to convert Ace value from 11 to 1 when total is more than 21
var calcHandTotal = function (hand) {
  //set a loop to go through the hand's cards and add the value of the cards to get total points
  var handTotal = 0;
  for (var i = 0; i < hand.length; i += 1) {
    handTotal = handTotal + hand[i].value;
  }
  //execute function to check for aces in hand to find out number of aces in hand to be subtracted if total points more than 21
  var numOfAces = checkForAce(hand);
  //if hand total is more than 21 and there is 1 or more aces in hand, then convert 1 ace at a time from 11 to 1 points and recount hand total and repeat
  while (handTotal > 21 && numOfAces > 0) {
    handTotal = handTotal - 10;
    numOfAces = numOfAces - 1;
  }
  return handTotal;
};

// function update user total for deal cards stage
var updateUserTotal = function () {
  userTotal += userData[0].hand[userData[0].hand.length - 1].value;
};

// function update computer total for deal cards stage
var updateComputerTotal = function () {
  computerTotal += computerHand[computerHand.length - 1].value;
};

// function to output a message to show Computer's 1st card
var outputComputerCard1 = function () {
  computerCard1Message =
    computerHand[0].name + " of " + computerHand[0].suit + " <br>";
  return computerCard1Message;
};

//function to check for Ace in hand and find out the number of aces in hand
var checkForAce = function (aHand) {
  var numOfAces = 0;
  for (var i = 0; i < aHand.length; i += 1) {
    if (aHand[i].cardIndex == 1) {
      numOfAces += 1;
    }
  }
  return numOfAces;
};

//function to check if hand bust
var checkForBust = function (aHand) {
  return calcHandTotal(aHand) > 21;
};

// function computerTurn
var startComputerTurn = function () {
  computerTotal = calcHandTotal(computerHand);
  //computer draws a card if less than 17 points
  while (computerTotal < 17) {
    computerHand.push(shuffledDeck.pop());
    //MIGHT NOT NEED UPDATECOMPUTERTOTAL
    updateComputerTotal();
    computerTotal = calcHandTotal(computerHand);
  }
  console.log("computer total after computer turn ends");
  console.log(computerTotal);
};

//function to compare user's and computer's cards to determine winner
var determineWinner = function () {
  if (userTotal > computerTotal && userTotal < 22) {
    userData[0].score = userData[0].score + userData[0].bet;
    winnerMessage = "User wins!";
  } else if (userTotal < computerTotal && computerTotal < 22) {
    userData[0].score = userData[0].score - userData[0].bet;
    winnerMessage = "Computer wins!";
  } else if (userTotal == computerTotal) {
    winnerMessage = "It is a tie.";
  }
  return winnerMessage;
};

//function to adjust score if user blackjack
var scoreBlackjack = function () {
  if (isBlackjack()) {
    userData[0].score = userData[0].score + 1.5 * userData[0].bet;
    var scoreBlackjackMessage = 1.5 * userData[0].bet;
  }
  return scoreBlackjackMessage;
};

////////////////////////////////////////////////MAIN////////////////////////////////////////////////////////////////////

var main = function (input) {
  if (programStage == STAGE_GAME_OVER) {
    return "The game is over, refresh the page to play again";
  }

  if (programStage == STAGE_USERNAME) {
    userData[0].name = input;
    programStage = STAGE_USER_BET;
    return (
      "Hello " +
      userData[0].name +
      "! Welcome to Blackjack! Your starting score is 100. Place your bet by keying in 1 to 100 to start the round.<br><br>Odds:<br>Blackjack 3:2<br>Regular win 1:1"
    );
  }

  if (programStage == STAGE_USER_BET) {
    if (input == NaN) {
      return "Key in a number between 1 to 100 only.";
    }
    computerHand = [];
    userData[0].hand = [];
    userData[0].bet = Number(input);
    console.log("userdata[0].bet");
    console.log(userData[0].bet);
    programStage = STAGE_DEAL_CARDS;
    return (
      "Your have placed a bet of " +
      userData[0].bet +
      "<br>Click submit to deal cards."
    );
  }

  if (programStage == STAGE_DEAL_CARDS) {
    //Initial turn - cards are shuffled and dealt. Check for user's Blackjack - if yes, game ends.
    dealStartingCards(shuffledDeck);

    if (isBlackjack()) {
      scoreBlackjackMessage = scoreBlackjack();
      programStage = STAGE_GAME_OVER;
      return (
        "Blackjack! User wins. User's hand is:" +
        outputCards(userData.hand) +
        " You added " +
        scoreBlackjackMessage +
        " to your score. Your new score is " +
        userData[0].score +
        "<br><br>Key in your new bet and click submit to play again."
      );
    }
    programStage = STAGE_HIT_STAND;
    // //if not Blackjack, display user's hand and computer's 1st card. Then continue to user's turn to hit or stand.
    userTotal = calcHandTotal(userData[0].hand);
    var myOutputValue =
      userData[0].name +
      "'s hand is: <br>" +
      outputCards(userData[0].hand) +
      "<br>" +
      userData[0].name +
      "'s total points is " +
      userTotal +
      "<br><br>Computer's open card is: <br>" +
      outputComputerCard1() +
      "<br>" +
      userData[0].name +
      "'s turn. Select one of the following options: <br> 1 - hit <br> 2 - stand";
    return myOutputValue;
  }

  if (programStage == STAGE_HIT_STAND) {
    if (input == "1") {
      console.log("input is 1");
      userData[0].hand.push(shuffledDeck.pop());
      //MIGHT NOT NEED THIS FUNCTION IF THERE IS CALCHANDTOTAL TO UPDATE USERTOTAL BELOW
      updateUserTotal();
      if (checkForBust(userData[0].hand)) {
        userTotal = calcHandTotal(userData[0].hand);
        userData[0].score = userData[0].score - userData[0].bet;
        programStage = STAGE_USER_BET;
        return (
          "User chose to hit, user has bust. Computer wins.<br><br> User's hand is: <br>" +
          outputCards(userData[0].hand) +
          "<br>User's total points is " +
          userTotal +
          "<br><br> Computer's hand is <br>" +
          outputCards(computerHand) +
          "You lost your bet of " +
          userData[0].bet +
          "<br>Your new score is " +
          userData[0].score +
          "<br><br>Key in your new bet and click submit to play again."
        );
      }
      userTotal = calcHandTotal(userData[0].hand);
      return (
        "User chose to hit. User's hand is: <br>" +
        outputCards(userData[0].hand) +
        "<br>User's total points is " +
        userTotal +
        "<br><br>Computer's open card is: <br>" +
        outputComputerCard1() +
        "<br>User's turn. Select one of the following options: <br> 1 - hit <br> 2 - stand"
      );
    }
    if (input == "2") {
      programStage = STAGE_COMPUTER_TURN;

      return (
        "User chose to stand. User's hand is: <br>" +
        outputCards(userData[0].hand) +
        "<br>User's total points is " +
        userTotal +
        "<br><br> Computer's hand is<br>" +
        outputCards(computerHand) +
        "<br>Click Submit to see Computer's final hand."
      );
    }
  }

  if (programStage == STAGE_COMPUTER_TURN) {
    console.log("entered stage_computer_turn");
    startComputerTurn();

    if (checkForBust(computerHand)) {
      programStage = STAGE_USER_BET;
      userData[0].score = userData[0].score + userData[0].bet;
      console.log("computer busted");
      return (
        "Computer has bust. User wins!<br><br>Computer's cards are: <br>" +
        outputCards(computerHand) +
        "<br>You added " +
        userData[0].bet +
        " to your score. Your new score is " +
        userData[0].score +
        "<br>Key in your new bet and click submit to play again"
      );
    }
    var winnerMessage = determineWinner();
    programStage = STAGE_USER_BET;
    return (
      winnerMessage +
      "<Br><br>User's cards: <br>" +
      outputCards(userData[0].hand) +
      "<br>User's total:" +
      userTotal +
      "<br><br>Computer's cards:<br>" +
      outputCards(computerHand) +
      "<br>Computer's total:<br>" +
      computerTotal +
      "<br><br> Your new score is " +
      userData[0].score +
      "<br><br> Key in your new bet and click submit to play again"
    );
  }
};
