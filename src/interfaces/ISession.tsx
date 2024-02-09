import { IStory } from "./IStory";

export interface ISession {
    planningName: string;
    numberOfVoters: number;
    planningList: IStory[];
}