import  * as testFunc  from '../apis/Vote'; // Change to the correct path of your file
import { IVote } from '../interfaces/IVote';
import { firebaseDB } from '../helpers/Firebase';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
    deleteDoc: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn()
}));

jest.mock('../helpers/Firebase', () => ({
    firebaseDB: jest.fn()
}));

const firebaseDbMockName = undefined;

describe('getVotes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return an array of IVote objects', async () => {
        const mockData = {
            data: jest.fn(() => ({ votes: [{ vote: '3', voter: 1 }, { vote: '2', voter: 2 }] }))
        };
        (getDoc as jest.Mock).mockResolvedValue(mockData);
        const result = await testFunc.getVotes();

        expect(result).toEqual([{ vote: '3', voter: 1 }, { vote: '2', voter: 2 }] );
        expect(getDoc).toBeCalledTimes(1);
    });

    it('should handle error and return empty array', async () => {
        (getDoc as jest.Mock).mockRejectedValueOnce(new Error('Firestore error Jest'));

        const result = await testFunc.getVotes();

        expect(result).toEqual([]);
        expect(getDoc).toBeCalledTimes(1);
    });
});

describe('resetVotes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should reset votes and return true', async () => {
        const numberOfVoters = 4;

        const result = await testFunc.resetVotes(numberOfVoters);

        expect(result).toBe(true);
        expect(deleteDoc).toBeCalledTimes(1);
        expect(setDoc).toHaveBeenCalledWith(firebaseDbMockName, { votes: [{vote: "Not Voted", voter: 0}, {vote: "Not Voted", voter: 1}, {vote: "Not Voted", voter: 2}, {vote: "Not Voted", voter: 3}]});
    });

    it('should handle error and return false', async () => {
        (deleteDoc as jest.Mock).mockRejectedValueOnce(new Error('Firestore error'));

        const result = await testFunc.resetVotes(5);

        expect(result).toBe(false);
        expect(deleteDoc).toBeCalledTimes(1);
        expect(setDoc).not.toHaveBeenCalled();
    });
});

describe('addVote', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add vote and return true', async () => {  
        
        const mockVotes: IVote[] = [{ vote: '3', voter: 1 }, { vote: '5', voter: 2 }];
        jest.spyOn(testFunc, 'getVotes').mockResolvedValue(mockVotes);

        const newVote: IVote = { vote: '3', voter: 1 };
        const result = await testFunc.addVote(newVote);

        expect(result).toBe(true);
        expect(setDoc).toHaveBeenCalledWith(firebaseDbMockName, { votes: expect.any(Array) });
    });

    it('should handle error and return false', async () => {
        const mockGetVotes = jest.spyOn(testFunc, 'getVotes');
        mockGetVotes.mockRejectedValueOnce(new Error('Firestore error'));
        const result = await testFunc.addVote({ vote: 'Option C', voter: 1 });

        expect(result).toBe(false);
        expect(setDoc).not.toHaveBeenCalled();
    });
});
