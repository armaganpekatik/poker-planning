export interface IStory {
    id: number,
    name: string;
    status: 'Active' | 'Not Voted' | 'Voted';
    storyPoint: number;
}