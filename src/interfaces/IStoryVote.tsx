import { IVote } from "./IVote";

export interface IStoryVote {
    storyId: number;
    votes: IVote[];
}