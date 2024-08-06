import { createDB, createTable } from "blinkdb";
import { type Game, type playerData, type Title } from '../src/lib/types';

export const db = createDB();

export const usersTable = createTable<playerData>(db, "users")({
    primary: "id"
});

export const gameTable = createTable<Game>(db, "game")({
    primary: "id"
})

export const titlesTable = createTable<Title>(db, "titles")({
    primary: "id"
})