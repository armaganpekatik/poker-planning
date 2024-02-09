import React, { useEffect, useState } from 'react';
import '../css/ViewPlanSM.scss'
import { ISession } from '../interfaces/ISession'
import { IStory } from '../interfaces/IStory';
import { getSession } from '../apis/Session';
import { alertMessage } from '../components/Alert';
import { addVote } from '../apis/Vote';

const ViewPlanSM = () => {

  const storyPoints = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '134', '?'];

  const [data, setData] = useState<ISession>();
  const [vote, setVote] = useState('0');
  const [isVoted, setIsVoted] = useState(false);
  const [activeStory, setActiveStory] = useState<IStory>();

  useEffect(() => {
    getSessionData();
  }, []);

  useEffect(() => {
    if (data) {
      setActiveStory(data.planningList.filter(x => x.status === 'Active')[0]);
    }
  }, [data]);

  const getSessionData = async () => {
    var sessionData = await getSession();
    if (!sessionData) {
      alertMessage('Error while reading data from DB. More detail can be found in console logs.');
    }
    console.log(sessionData);
    setData(sessionData as ISession);
  }

  const voteItem = (item: string) => {
    if (!isVoted) {
      setVote(item);
      addVote({
        vote: item === '?' ? 0 : parseInt(vote),
        voter: 0 //TODO: Change this to dynamic
      })
    }
    setIsVoted(true);
  }


  if (!data) {
    return (<div>Loading</div>)
  }

  return (
    <div className='form-wp'>
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
      <div className='story-points'>
        {activeStory?.name} - {vote === '0' ? 'Please Vote!!' : `${vote} voted`}
        <br />
        {
          storyPoints.map(item => {
            return (
              <div className={vote === item ? 'active' : ''} key={item} onClick={() => voteItem(item)}>{item}</div>
            )
          })
        }
      </div>
      <div className='story-panel'>
        {activeStory?.name} is active
        <br />
        {
          Array(data.numberOfVoters).fill(null).map((item, index) => {
            return (
              <div key={index}>Voter {index + 1} : 'Not Voted'</div>
            )
          })
        }
      </div>
    </div>

  );
};

export default ViewPlanSM;
