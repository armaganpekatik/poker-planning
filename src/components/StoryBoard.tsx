import { ISession } from "../interfaces/ISession";

interface DataProps {
    data: ISession
}

const StoryBoard = ({ data }: DataProps) => {

    return (
        <div className='story-list'>
            <div className='row'>
                <div className='column title'> Story </div>
                <div className='column title'> Story Point </div>
                <div className='column title' style={{ border: 'none' }}> Status </div>
            </div>
            {
                data.planningList.map((item, index) => {
                    return (
                        <div className='row' key={index}>
                            <div className='column'> {item.name} </div>
                            <div className='column'> {item.storyPoint} </div>
                            <div className='column' style={{ border: 'none' }}> {item.status}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default StoryBoard;