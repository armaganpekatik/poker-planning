// home.tsx

import { Link } from "react-router-dom";

function Home() {

  return (
    <div style={{textAlign:"center"}}>
      <h2>Welcom to "SCRUM POKER" Application.</h2>
      <p>To start please click <Link to='/story-list'>Start Session</Link>.</p>
    </div>
  );
};

export default Home;
