import { render, renderHook } from "@testing-library/react"
import { SocketContext } from "../context/SocketContext"
import { AppContext } from "../context/AppContext"
import { GameContext } from "../context/GameContext"
import { WelcomeContext } from "../context/WelcomeContext"

export const mockSocketValues = {
    game: { id: 'game123', winner: null, state: JSON.stringify(Array(9).fill(null)), is_tie: false, status: "in_progress", x_player: "player1", o_player: "player2", x_score: 0, o_score: 0 },
    setGame: jest.fn(),
    resetGame: jest.fn(),
    endGame: jest.fn(),
    makeMove: jest.fn(),
    socket: { on: jest.fn() },
    setSocket: jest.fn(),
    resettingGame: false,
    joinGame: jest.fn(),
}

export const mockAppValues = {
    playerName: 'player1',
    messageApi: { open: jest.fn() }
}

export const mockGameValues = {
    board: Array(9).fill(null),
    setBoard: jest.fn(),
    handleEndGame: jest.fn(),
    handleResetGame: jest.fn(),
    handleMakeMove: jest.fn(),
    handleGoToHomePage: jest.fn(),
}

export const mockWelcomeValues = {
    selectedGame: 'game123',
    setSelectedGame: jest.fn(),
    games: [
        { id: 'game123', game_name: 'game123', winner: null, state: JSON.stringify(Array(9).fill(null)), is_tie: false, status: "in_progress", x_player: "player1", o_player: "player2", x_score: 0, o_score: 0 },
        { id: 'game456', game_name: 'game456', winner: null, state: JSON.stringify(Array(9).fill(null)), is_tie: false, status: "in_progress", x_player: "player3", o_player: "player4", x_score: 0, o_score: 0 },
    ],
    setGames: jest.fn(),
    showGameNameInput: false,
    setShowGameNameInput: jest.fn(),
    handleCreateGameClick: jest.fn(),
    handleRankingGameClick: jest.fn(),
    handleSelectedGame: jest.fn(),
}

export const MockSocketProvider = ({ values, children }) => (
    <SocketContext.Provider value={{ ...values }}>
        {children}
    </SocketContext.Provider>
)

export const MockAppProvider = ({ values, children }) => (
    <AppContext.Provider value={{ ...values }}>
        {children}
    </AppContext.Provider>
)

export const MockGameProvider = ({ values, children }) => (
    <GameContext.Provider value={{ ...values }}>
        {children}
    </GameContext.Provider>
)

export const MockWelcomeProvider = ({ values, children }) => (
    <WelcomeContext.Provider value={{ ...values }}>
        {children}
    </WelcomeContext.Provider>
)

export const renderWithGameContext = (appValues, socketValues, gameValues, ui) => {
    return render(
        <MockAppProvider values={appValues}>
            <MockSocketProvider values={socketValues}>
                <MockGameProvider values={gameValues}>
                    {ui}
                </MockGameProvider>
            </MockSocketProvider>
        </MockAppProvider>
    )
}

export const renderWithWelcomeContext = (appValues, socketValues, welcomeValues, ui) => {
    return render(
        <MockAppProvider values={appValues}>
            <MockSocketProvider values={socketValues}>
                <MockWelcomeProvider values={welcomeValues}>
                    {ui}
                </MockWelcomeProvider>
            </MockSocketProvider>
        </MockAppProvider>
    )
}