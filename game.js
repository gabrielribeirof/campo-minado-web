const BOMB_INDICATOR = -1;

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function createGame() {
	const state = {
		squares: [],
		bombsAmount: 0,
		bombsMaxAmount: 10,
		squaresMaxAmount: 80,
		squaresPerLine: 10,
		status: 'playing'
	}

	function start() {
		state.squares = Array(state.squaresMaxAmount).fill(0)

		while (state.bombsAmount <= state.bombsMaxAmount) {
			let index = randomIntFromInterval(0, state.squaresMaxAmount)

			while (
				index <= -1 ||
				index >= state.squaresMaxAmount ||
				state.squares[index] === BOMB_INDICATOR
			) {
				index = randomIntFromInterval(0, state.squaresMaxAmount)
			}

			if (state.squares[index] === BOMB_INDICATOR) return

			state.squares[index] = BOMB_INDICATOR
			state.bombsAmount++
		}

		for (let i=0; i<state.squaresMaxAmount; i++) {
			if (state.squares[i] !== BOMB_INDICATOR) continue

			for (let j=0; j<9; j++) {
				let targetIndex = i-state.squaresPerLine-1

				if (j === 0) targetIndex = i-state.squaresPerLine-1
				if (j === 1) targetIndex = i-state.squaresPerLine
				if (j === 2) targetIndex = i-state.squaresPerLine+1
				if (j === 3) targetIndex = i-1
				if (j === 4) targetIndex = i
				if (j === 5) targetIndex = i+1
				if (j === 6) targetIndex = i+state.squaresPerLine-1
				if (j === 7) targetIndex = i+state.squaresPerLine
				if (j === 8) targetIndex = i+state.squaresPerLine+1

				if (targetIndex < 0) continue

				if (state.squares[targetIndex] === BOMB_INDICATOR) continue

				state.squares[targetIndex]++
			}
		}
	}

	const observers = []

	function subscribe(observerFunction) {
		observers.push(observerFunction)
	}

	function notifyAll(command) {
		for (const observerFunction of observers) {
			observerFunction(command)
		}
	}

	function revelSquare(index) {
		switch (state.squares[index]) {
			case BOMB_INDICATOR:
				state.status = 'over'
				break;
			default:
				break;
		}
	}

	function printSquare() {
		let output = ''

		for (let i=0; i<state.squaresMaxAmount; i++) {
			output = `${output}${state.squares[i]} `

			if ((i+1) % 10 === 0) {
				output = `${output}\n`
			} 
		}

		console.log(output)
	}

	return {
		start,
		subscribe,
		notifyAll,
		revelSquare,
		printSquare,
		state
	}
}
