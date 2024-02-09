import { firebaseDB } from '../helpers/Firebase';
import { getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { IVote } from '../interfaces/IVote';

const docRef = doc(firebaseDB, 'Votes', '1');

export const getVotes = async (): Promise<IVote[]> => {
    const votes = await getDoc(docRef);
    try {
        const data = votes.data()?.votes as IVote[];
        return data;
    }
    catch (e) {
        console.log(e);
    }

    return [];
}

export const getVote = async (voter: number): Promise<IVote|null> => {
    try {
        var votes = await getVotes();
        return votes.filter(x => x.voter === voter)[0];
    }
    catch (e) {
        console.log(e);
    }
    return null;
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
        var votes = await getVotes();
        const index = votes.findIndex(x => x.voter === vote.voter);
        votes[index] = vote;
        await setDoc(docRef, { votes: votes });
    }
    catch (e) {
        console.log(e);
        return false;
    }
    return true;
}