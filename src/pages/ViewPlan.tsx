import React, { useEffect, useState } from 'react';
import '../css/ViewPlan.scss'
import { ISession } from '../interfaces/ISession'
import { IStory } from '../interfaces/IStory';
import { getSession, saveAndIterateToNextSessionStory } from '../apis/Session';
import { alertMessage } from '../components/Alert';
import { addVote, getVotes } from '../apis/Vote';
import { IVote } from '../interfaces/IVote';
import { useSearchParams, useNavigate } from 'react-router-dom'
import StoryBoard from '../components/StoryBoard';
import StoryPointsBoard from '../components/StoryPointsBoard';
import StoryManagePanel from '../components/StoryManagePanel';
import Loader from '../components/Loader';

const ViewPlan = () => {

  const notVotedValue = 'Not Voted';
  const navigate = useNavigate();

  const [searchParams] = useSearchParams()
  const [voterId, setVoterId] = useState(0);
  const [data, setData] = useState<ISession>();
  const [vote, setVote] = useState('0');
  const [isVoted, setIsVoted] = useState(false);
  const [votes, setVotes] = useState<IVote[]>();
  const [voteEnd, setVoteEnd] = useState(false);
  const [storyPoint, setStoryPoint] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStory, setActiveStory] = useState<IStory>({
    id: 0,
    name: '',
    status: notVotedValue,
    storyPoint: '0'
  });

  useEffect(() => {
    getSessionData();
    getVotesData();

    const interval = setInterval(() => {
      refresh();
    }, 5000);
    return () => clearInterval(interval);

    // I want this to run only run once
    // eslint-disable-next-line
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
    const voterIdStr = searchParams.get('voter');
    const voterIdValue = voterIdStr ? parseInt(voterIdStr) : 0;
    setVoterId(voterIdValue);

    const votesData = await getVotes();
    setVotes(votesData as IVote[]);
    if (votesData && votesData.filter(x => x.vote === notVotedValue).length === 0) {
      setVoteEnd(true);
    }
    else {
      setVoteEnd(false);
      setVote('0');
      setIsVoted(false);
    }

    const currentVote = votesData.filter(x => x.voter === voterIdValue)[0];
    if (currentVote && currentVote.vote !== notVotedValue) {
      let voteStr = currentVote.vote;
      setVote(voteStr);
      setIsVoted(true);
    }

    if (!currentVote) {
      alertMessage('Voter is not found. Redirect to Scrum Master page.');
      navigate('/view-plan');
    }
  }

  const voteItem = async (item: string) => {
    setIsLoading(true);
    if (!isVoted) {
      setVote(item);
      await addVote({
        vote: item,
        voter: voterId
      });
      getVotesData();
    }
    setIsVoted(true);
    setIsLoading(false);
  }

  const submitVoting = async () => {
    if (!storyPoint) {
      alertMessage('Please set the final number');
    }
    setIsLoading(true);
    await saveAndIterateToNextSessionStory(activeStory.id, storyPoint);
    await refresh();
    setIsLoading(false);
  }

  const setFinalNumber = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStoryPoint(event.target.value);
  };

  const refresh = async () => {
    getVotesData();
    getSessionData();
  }

  if (!data || isLoading) {
    return (<Loader />);
  }

  if(!activeStory)
  {
    return (<div><h2>Result:</h2><StoryBoard data={data} /></div>);
  }

  return (
    <div>
      <div className='form-wp'>
        <StoryBoard data={data} />

        <StoryPointsBoard
          activeStoryName={activeStory.name}
          vote={vote}
          onVoteItem={voteItem} />

        {
          voterId === 0 ? (
            <StoryManagePanel
              activeStoryName={activeStory.name}
              votes={votes}
              isVotingEnd={voteEnd}
              onSubmitVoting={submitVoting}
              onSetFinalNumber={setFinalNumber} />
          ) : (<></>)
        }
      </div>
      <div style={{ textAlign: 'center' }}>
        <button className='button' onClick={refresh}>Refresh</button>
        <p>If you don't refresh, it refreshes in every 5 seconds.</p>
      </div>
    </div>
  );
};

export default ViewPlan;
