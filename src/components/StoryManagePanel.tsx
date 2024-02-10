import { IVote } from "../interfaces/IVote";
import { storyPoints } from "../helpers/Varaibles"

interface DataProps {
    activeStoryName: string,
    votes: IVote[] | undefined,
    isVotingEnd: boolean,
    onSubmitVoting: () => void,
    onSetFinalNumber: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const StoryManagePanel = ({ activeStoryName, votes, isVotingEnd, onSubmitVoting, onSetFinalNumber }: DataProps) => {
    const showVotes = (item: string): string => {
        if (isVotingEnd) {
            return item;
        }
        if (item !== 'Not Voted') {
            return 'Voted';
        }
        return item;
    }

    const createOption = function (item: string) {
        return <option key={item} value={item}>{item}</option>;
    };

    return (
        <div className='story-panel'>
            <p>{activeStoryName} is active</p>
            <div className="inner">
                {
                    votes?.map((item, index) => {
                        return (
                            <div className="divitem" key={index}>
                                <div>{item.voter === 0 ? 'Scrum Master' : `Voter ${item.voter}`}</div>
                                <div className="vote">: {showVotes(item.vote)}</div>
                                <div>{item.voter === 0 ? ('') : (<a href={`/view-plan?voter=${index}`} target='_blank' rel="noreferrer">Link</a>)}</div>
                            </div>
                        )
                    })
                }
            </div>
            {
                isVotingEnd ? (
                    <>
                        <label htmlFor='storyPoint'>Final Number: </label>
                        <select
                            id='storyPoint'                            
                            onChange={onSetFinalNumber}
                            required>
                            {storyPoints.map(createOption)}
                        </select>
                        <div className="buttondiv">
                            <button className='button' onClick={onSubmitVoting}>End Voting</button>
                        </div>
                    </>
                ) : (
                    <p className="note">You can not end voting till all teammates voted</p>
                )
            }
        </div>
    )
}

export default StoryManagePanel;