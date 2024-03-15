import { useState } from "react"
import "./App.css"

type Square = string | null
type Player = "X" | "O"
type Action = () => void
type Consumer<T> = (arg: T) => void

function calculateWinner(squares: Square[]) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a]
		}
	}
	return null
}

function Square({
	value,
	onSquareClick,
}: {
	value: Square
	onSquareClick: Action
}) {
	return (
		<button className="square" onClick={onSquareClick}>
			{value}
		</button>
	)
}

export function Board({
	nextPlayer,
	squares,
	onPlay,
}: {
	nextPlayer: Player
	squares: Square[]
	onPlay: Consumer<Square[]>
}) {
	function getstatus() {
		const winner = calculateWinner(squares)
		if (winner) {
			return winner + " a gagné"
		}
		return `Prochain tour : ${nextPlayer}`
	}

	function handleClick(i: number) {
		if (squares[i] || calculateWinner(squares)) {
			return
		}
		const nextSquares = squares.slice()
		nextSquares[i] = nextPlayer

		onPlay(nextSquares)
	}

	return (
		<>
			<div className="status">{getstatus()}</div>
			<div className="board-row">
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
			</div>
			<div className="board-row">
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
			</div>
			<div className="board-row">
				<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
			</div>
		</>
	)
}

function Game() {
	const [history, setHistory] = useState<Square[][]>([Array(9).fill(null)])
	const [currentMove, setCurrentMove] = useState<number>(0)
	const currentSquares = history[currentMove]
	const nextPlayer = currentMove % 2 === 0 ? "X" : "O"

	function handlePlay(nextSquares: Square[]) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length - 1)
	}

	function jumpTo(nextMove: number) {
		setCurrentMove(nextMove)
	}

	const moves = history.map((squares, move) => {
		let description
		if (move > 0) {
			description = "Aller au coup #" + move
		} else {
			description = "Revenir au début"
		}
		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		)
	})

	return (
		<div className="game">
			<div className="game-board">
				<Board
					nextPlayer={nextPlayer}
					squares={currentSquares}
					onPlay={handlePlay}
				/>
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	)
}

function App() {
	return <Game />
}

export default App
