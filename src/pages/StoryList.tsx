// StoryListPage.tsx
import React, { useState } from 'react';
import '../css/StoryList.scss'
import { ISession } from '../interfaces/ISession'
import { IStory } from '../interfaces/IStory';
import { useNavigate } from "react-router-dom";
import { setSession } from '../apis/Session';
import { alertMessage } from '../components/Alert';

interface Planning {
  planningName: string;
  numberOfVoters: number;
  planningList: string[];
}

const StoryList = () => {
  const [planning, setPlanning] = useState<Planning>({
    planningName: '',
    numberOfVoters: 0,
    planningList: []
  });

  const navigate = useNavigate();

  const handlePlanningNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {        
    setPlanning({ ...planning, planningName: event.target.value });
  };

  const handleNumberOfVotersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let voters =  0;
    const votersStr = event.target.value;

    if(votersStr)
    {
      voters = parseInt(votersStr);
      if(voters < 0)
      {
        voters = 0;
      }   
    }
    setPlanning({ ...planning, numberOfVoters: voters });
  };

  const handlePlanningListChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines =  event.target.value.split('\n');
    setPlanning({ ...planning, planningList: lines });
  };

  const handleStartSession = async () => {

    if(planning.planningName.length > 200 || planning.planningName.length < 1)
    {
      alertMessage('Name can not be empty and must be shorter than 200');
      return;
    }

    if(planning.planningList.length < 1 || planning.planningList.includes(''))
    {
      alertMessage('Story item can not be empty');
      return;
    }

    const session : ISession = {
      numberOfVoters: planning.numberOfVoters + 1, // add the Scrum Master
      planningName: planning.planningName,
      planningList: planning.planningList.map((item, index) => {
        return {
          id: index,
          name: item,
          status: index === 0 ? 'Active' : 'Not Voted',
          storyPoint: '0'
        } as IStory
      })
    }
    
    var result = await setSession(session);
    if(result)
    {
      navigate('/view-plan');
      return true;
    }

    alertMessage('Error while recording to DB. Please see console log for more details.');
    return false;
  };

  return (
    <div className='form'>
      <div className='half-page'>
        <label htmlFor='planningName'>Planning Name: </label>
        <input
          type='text'
          id='planningName'
          value={planning.planningName}
          onChange={handlePlanningNameChange}
          maxLength={200}
          required
        />
      </div>
      <div className='half-page'>
        <label htmlFor='numberOfVoters'>Number of Voters: </label>
        <input
          type='number'
          id='numberOfVoters'
          value={planning.numberOfVoters}
          onChange={handleNumberOfVotersChange}
          required
        />
      </div>
      <div className='full-page'>
        <label htmlFor='planningList'>Paste your story List (Each line will be converted as a story)</label>
        <br />
        <textarea
          id='planningList'
          className='planning-list'
          value={planning.planningList.join('\n')}
          onChange={handlePlanningListChange}
        />
      </div>
      <div className='full-page align-right'>
        <button className='button' onClick={handleStartSession}>Start Session</button>
      </div>
    </div>
  );
};

export default StoryList;
