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
        const voteResult = await resetVotes(session.numberOfVoters);
        if (!voteResult)
        {
            return false;
        }
        return true;
    } 
    catch(e)
    {
        console.log(e);
    }
    return false;
}

export const saveAndIterateToNextSessionStory = async (storyId: number, storyPoint: string) : Promise<boolean> => {
    const session = await getSession();
    const nextStoryId = storyId + 1;

    if(!session)
    {
        return false;
    }

    var nextStory = session.planningList.find(x => x.id === nextStoryId);
    if(nextStory)
    {
        nextStory.status = 'Active';
    }

    var currentStory = session.planningList.find(x => x.id === storyId);
    if(currentStory)
    {
        currentStory.status = 'Voted';
        currentStory.storyPoint = storyPoint;
    }
    
    try {
        await setDoc(docRef, session);
        await resetVotes(session.numberOfVoters);
        return true;
    } 
    catch(e)
    {
        console.log(e);        
    }

    return false;
}