import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function Square(props) {
  const { value, onClick, isLighted } = props;
  const className = `square ${isLighted ? 'square--lighted' : ''}`;

  return (
    <button
      className={className}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const isLighted = i === this.props.squareToLight;

    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isLighted={isLighted}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        squareNum: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      squareToLight: null,
      lightedMove: null,
    };
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0,
      squareToLight: this.state.history[move].squareNum,
      lightedMove: move,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : '0';
    this.setState({
      history: history.concat([{
        squares: squares,
        squareNum: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      squareToLight: null,
      lightedMove: null,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;

    const moves = history.map((step, move) => {
      let columns = {
        1: [0, 3, 6],
        2: [1, 4, 7],
        3: [2, 5, 8]
      };
      let columnI;

      for(let column in columns) {
        if(columns[column].includes(step.squareNum)) {
          columnI = column;
        }
      }

      let rowI;

      if(step.squareNum < 3) {
        rowI = 1;
      } else if (step.squareNum < 6) {
        rowI = 2;
      } else {
        rowI = 3;
      }

      const desc = move
        ? 'Перейти к ходу #' + move + ` (${columnI}, ${rowI})`
        : 'К началу игры';

      return (
        <li key={move}>
          <button
            className={`${this.state.lightedMove === move ? 'move--lighted' : ''}`}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    if(history.length === 9) {
      status = 'НИЧЬЯ!';
    }

    if (winner) {
      status = 'Выиграл ' + winner;
    } else if (!current.squares.includes(null) && !winner) {
      status = 'НИЧЬЯ!';
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            squareToLight={this.state.squareToLight}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
