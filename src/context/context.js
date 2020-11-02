import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

 const GithubContext = React.createContext();

 //provider and consuer form githubcontext.provider

 const GithubProvider = ({children}) =>{
     const [githubUser, setGithubuser] = useState(mockUser);
     const [repos, setRepos] = useState(mockRepos);
     const [followers, setFollowers] = useState(mockFollowers);

     //request loading
     const [requests, setRequests ] = useState(0);
     const [loading, setLoading ] = useState(false);
     //error
     const [error,setError] = useState({show:false,msg:""});

   
     //check lmit late
     const checkRequests = () =>{
         axios(`${rootUrl}/rate_limit`)
         .then(({data})=>{
             let {
                 rate: { remaining },
             } = data;
             setRequests(remaining);
             if(remaining===0){
                 toggolError(true,'sorry,you have exceeded your hourly limit!');
             }
             console.log(data)
         })
         .catch((err)=>{
             console.log(err);
         })
     };
     function toggolError(show =false, msg= '' ){
         setError({show,msg});
     }
     //error
     useEffect(checkRequests,[]);

     return <GithubContext.Provider value={{
         githubUser,
         repos,
         followers,
         requests,
         error,}}>{children}
     </GithubContext.Provider>
 }

 export {GithubProvider, GithubContext};