
export enum GameState {
    GS_MENU,
    GS_INTRO,
    GS_PLAYING,
    GS_DEATH,
}

export enum PhysicsGroups {
    PLAYER = (1 << 1),
    GROUND = (1 << 2),
    PLATFORM = (1 << 3),
    DEATH_GROUND = ( 1 << 6),
    OBSTACLE = (1 << 7)
}