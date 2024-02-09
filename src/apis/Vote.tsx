import { firebaseDB } from '../helpers/Firebase';
import { getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore'; 
import { IVote } from '../interfaces/IVote';

const docRef = doc(firebaseDB, 'Votes', '1');

export const getVotes = async () : Promise<IVote[]> => {    
    const votes = await getDoc(docRef);
    try {
        const data = votes.data()?.votes as IVote[];
        return data;
    } 
    catch(e)
    {
        console.log(e);        
    }

    return [];
}

export const cleanVotes = async () : Promise<boolean> => {    
    try {
        await deleteDoc(docRef); 
    } 
    catch(e)
    {
        console.log(e);
        return false;
    }
    return true;
}

export const addVote = async (vote: IVote) : Promise<boolean> => {

    try {
        await setDoc(docRef, {votes: [vote]}, { merge: true });
    } 
    catch(e)
    {
        console.log(e);
        return false;
    }    
    return true;
}