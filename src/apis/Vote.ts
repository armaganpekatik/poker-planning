import { firebaseDB } from '../helpers/Firebase';
import { getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { IVote } from '../interfaces/IVote';
//To mock local functions
import * as thisModule from './Vote'

const docRef = doc(firebaseDB, 'Votes', '1');

export const getVotes = async (): Promise<IVote[]> => {
    try {
        const votes = await getDoc(docRef);
        const data = votes.data()?.votes as IVote[];
        return data;
    }
    catch (e) {
        console.log(e);
    }

    return [];
}

export const resetVotes = async (numberOfVoters: number): Promise<boolean> => {
    try {
        await deleteDoc(docRef);
        let votes: IVote[] = [];
        for (let i = 0; i < numberOfVoters; i++) {
            votes.push({
                vote: 'Not Voted',
                voter: i
            });
        }
        await setDoc(docRef, { votes: votes });
    }
    catch (e) {
        console.log(e);
        return false;
    }
    return true;
}

export const addVote = async (vote: IVote): Promise<boolean> => {
    try {
        var votes = await thisModule.getVotes();
        const record = votes.find(x => x.voter === vote.voter) as IVote;
        record.vote = vote.vote;
        await setDoc(docRef, { votes: votes });
    }
    catch (e) {
        console.log(e);
        return false;
    }
    return true;
}