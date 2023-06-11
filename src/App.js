import React from "react";
import { useState } from 'react';

// Game handles keeping track of game history and current state of the board
export default function Game()
{
  // Set states for history, current move, and move sort order
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [curMove, setCurMove] = useState(0);
  const [rev, setRev] = useState(false);

  // Use the history to figure out current board state
  const currSquares = history[curMove];
  const xIsNext = curMove % 2 === 0;

  // Set the history based on plays taken
  function handlePlay(nextSquares)
  {
    const nextHistory = [...history.slice(0, curMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurMove(nextHistory.length - 1);
  }

  // Jump to the specified move, used for time travel
  function jumpTo(nextMove)
  {
    setCurMove(nextMove);
  }

  // Switch the turn order sort
  function reverseList()
  {
    setRev(!rev);
  }

  // Create the list of moves from the history and create the button that will allow time travel
  const moves = history.map((squares, move) =>
  {
    let description;
    if(move > 0)
    {
      description = "Go to move #" + move;
    }
    else
    {
      description = "Go to start";
    }
    return (
      <div>
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      </div>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={reverseList}>Sort Turns Asc/Desc</button>
        <ol>{rev ? moves.reverse() : moves}</ol> 
        <ol>You are on move #{curMove + 1}</ol>
      </div>
    </div>
  )
}

// Board handles the construction of the board and determines winner
function Board({ xIsNext, squares, onPlay})
{
  // Handles moves
  function handleClick(i)
  {
    const nextSquares = squares.slice();
    if(squares[i] || calcWinner(squares))
    {
      return;
    }
    if(xIsNext){
      nextSquares[i] = "X";
    }
    else
    {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  // Determine the winner and color the winning squares green or the whole board yellow if tied.
  const winner = calcWinner(squares);
  let status;
  let buttonClass = [];
  if(winner)
  {
    status = "Winner: " + winner[0];
    for(let i = 0; i < 9; i++)
    {
      if(winner[1].includes(i))
      {
        buttonClass.push("winning-square");
      }
      else
      {
        buttonClass.push("square");
      }
    }
  }
  else if(checkForTie(squares))
  {
    status = "Tie Game!"
    buttonClass = Array(9).fill("tie-square");
  }
  else
  {
    status = "Next: " + (xIsNext ? "X" : "O");
    buttonClass = Array(9).fill("square");
  }

  // Create the board
  const rows = 3;
  const cols = 3;
  const boardRows = []
  boardRows.push(<div className="status">{status}</div>);

  for(let i = 0; i < rows; i++)
  {
    const curRow = []
    for(let j = 0; j < cols; j++)
    {
      curRow.push( <Square value = {squares[i * 3 + j]} onSquareClick = {() => handleClick(i * 3 + j)} buttonClass = {buttonClass[i * 3 + j]}/>);
    }
    boardRows.push(<div className="board-row">{curRow}</div>);
  }

  return(
    <div>
      {boardRows}
    </div>
  );
}

// Each square on the board
function Square({value, onSquareClick, buttonClass})
{
  return <button className={buttonClass}
          onClick={onSquareClick}>
            {value}
         </button>;
}

// Return symbol of the winner if they've got all spots on a winning line
function calcWinner(squares)
{
  // All combinations that win
  const lines =
  [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for(let i = 0; i < lines.length; i++)
  {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
    {
      return [squares[a], lines[i]];
    }
  }

  return null;
}

// If the whole board is full (and a winner hasn't been decided), it's a tie
function checkForTie(squares)
{
  for(let i = 0; i < squares.length; i++)
  {
    if(!squares[i])
    {
      return false;
    }
  }

  return true;
}
