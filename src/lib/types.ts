export interface playerData {
    id: string,
    code: string,
    username: string,
    title?: boolean,
    role: "player" | "host"
}

export interface Game {
    id: string,
    host: string
}

export interface Title {
    id: string,
    code: string,
    title: string
}