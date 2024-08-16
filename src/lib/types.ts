export interface playerData {
    id: string,
    code: string,
    username: string,
    title?: boolean,
    played?: boolean,
    presented?: boolean,
    role: "player" | "host"
}

export interface Game {
    id: string,
    host: string,
    presenter?: string,
    assistant?: string,
    view?: string
}

export interface Title {
    id: string,
    code: string,
    speech: string
}