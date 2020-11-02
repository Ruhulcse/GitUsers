import React from 'react';
import { Info, Repos, User, Search, Navbar } from '../components';
import loadingImage from '../images/preloader.gif';
import { GithubContext } from '../context/context';
const Dashboard = () => {
  const {isLoading} = React.useContext(GithubContext);
  if(isLoading){
    return(
      <main>
        <Navbar></Navbar>
        <Search></Search>
        <img src={loadingImage} className ="loading-img" alt="loding"/>
      </main>
    );
  }
  return (
    <main>
     <Navbar></Navbar>
     <Search></Search>
     <Info></Info>
     <User></User>
     <Repos></Repos>
    </main>
  );
};

export default Dashboard;
