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
     const [isLoading, setIsLoading ] = useState(false);
     //error
     const [error,setError] = useState({show:false,msg:""});

     const searchGithubUser = async(user)=>{
          toggolError()
         setIsLoading(true)
         const response = await axios(`${rootUrl}/users/${user}`).
         catch(err => console.log(err))
         console.log(response);
         if(response){ 
             setGithubuser(response.data);
             // repos
             const {login,followers_url} = response.data;
             await Promise.allSettled([axios(`${rootUrl}/users/${login}/repos?per_page=100`),axios(`${followers_url}?per_page=100`)])
             .then((result)=>{
                 const [repos,followers] = result;
                 const status = 'fulfilled';
                 if(repos.status === status){
                     setRepos(repos.value.data);
                 }
                 if(followers.status === status){
                     setFollowers(followers.value.data);
                 }
             }).catch(err=>console.log(err));
         }
         else{
             toggolError(true,'there is not user with that user name')
         }
         checkRequests();
         setIsLoading(false);
     }
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
         error,
         searchGithubUser,
         isLoading,
         }}>{children}
     </GithubContext.Provider>
 }

 export {GithubProvider, GithubContext};