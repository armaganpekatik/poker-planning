import React, { useEffect, useState } from 'react';
import '../css/ViewPlanSM.scss'
import { ISession } from '../interfaces/ISession'
import { IStory } from '../interfaces/IStory';
import { getSession } from '../apis/Session';
import { alertMessage } from '../components/Alert';
import { addVote, getVote, getVotes } from '../apis/Vote';
import { IVote } from '../interfaces/IVote';

const ViewPlan = () => {

  const storyPoints = ['1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '144', '?'];
  const voterId = 0; //TODO: Change this to dynamic
  const notVotedValue = 'Not Voted';

  const [data, setData] = useState<ISession>();
  const [vote, setVote] = useState('0');
  const [isVoted, setIsVoted] = useState(false);
  const [activeStory, setActiveStory] = useState<IStory>();
  const [votes, setVotes] = useState<IVote[]>();
  const [voteEnd, setVoteEnd] = useState(false);

  useEffect(() => {
    getSessionData();
    getVotesData();
    getCurrentVote();
  }, []);

  useEffect(() => {
    if (data) {
      setActiveStory(data.planningList.filter(x => x.status === 'Active')[0]);
    }
  }, [data]);

  const getSessionData = async () => {
    const sessionData = await getSession();
    if (!sessionData) {
      alertMessage('Error while reading data from DB. More detail can be found in console logs.');
    }
    setData(sessionData as ISession);
  }

  const getVotesData = async () => {
    const votesData = await getVotes();
    console.log(votesData);
    setVotes(votesData as IVote[]);
  }

  const getCurrentVote = async () => {
    const currentVote = await getVote(voterId);
    if (currentVote && currentVote.vote != notVotedValue) {
      let voteStr = currentVote.vote;
      setVote(voteStr);
      setIsVoted(true);
    }
  }

  const voteItem = (item: string) => {
    if (!isVoted) {
      setVote(item);
      addVote({
        vote: item,
        voter: voterId
      })
    }
    setIsVoted(true);
  }

  const calculateVoted = (item: string): string => {
    if (voteEnd) {
      return item;
    }
    if (item !== notVotedValue) {
      return 'Voted';
    }
    return item;
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
        <p>{activeStory?.name} - {vote === '0' ? 'Please Vote!!' : `${vote} voted`}</p>
        {
          storyPoints.map(item => {
            return (
              <div className={vote === item ? 'active' : ''} key={item} onClick={() => voteItem(item)}>{item}</div>
            )
          })
        }
      </div>
      <div className='story-panel'>
        <p>{activeStory?.name} is active</p>
        {
          votes?.map((item, index) => {
            return (
              <div key={index}>
                {item.voter === 0 ? 'Scrum Master' : `Voter ${item.voter}`}
                : {calculateVoted(item.vote)}
              </div>
            )
          })
        }
        <button className='button'>End Voting</button>
      </div>
    </div>

  );
};

export default ViewPlan;
