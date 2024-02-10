import { storyPoints } from "../helpers/Varaibles"

interface DataProps {
    activeStoryName: string,
    vote: string,
    onVoteItem: (item: string) => void
}

const StoryPointsBoard = ({ activeStoryName, vote, onVoteItem }: DataProps) => {

    return (
        <div className='story-points'>
            <p>{activeStoryName} - {vote === '0' ? 'Please Vote!!' : `${vote} voted`}</p>
            {
                storyPoints.map(item => {
                    return (
                        <div className={vote === item ? 'active' : ''} key={item} onClick={() => onVoteItem(item)}>{item}</div>
                    )
                })
            }
        </div>
    )
}

export default StoryPointsBoard;