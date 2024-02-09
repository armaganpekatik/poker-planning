import { firebaseDB } from '../helpers/Firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore'; 
import { ISession } from '../interfaces/ISession';
import { resetVotes } from './Vote';

const docRef = doc(firebaseDB, 'Sessions', '1');

export const getSession = async () : Promise<ISession|null> => {
    const session = await getDoc(docRef);
    try {
        const data = session.data() as ISession;
        return data;
    } 
    catch(e)
    {
        console.log(e);        
    }

    return null;
}

export const setSession = async (session: ISession) : Promise<boolean> =>  { 
    try {
        await setDoc(docRef, session);
        var voteResult = await resetVotes(session.numberOfVoters + 1);
        if (!voteResult)
        {
            return false;
        }
    } 
    catch(e)
    {
        console.log(e);
        return false;
    }
    
    return true;
}