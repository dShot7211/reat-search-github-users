import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  // ye function hamara root component ko wrap karta hai
  const [githubUser, setGithubUser] = useState(mockUser); // used in card.js
  const [repos, setRepos] = useState(mockRepos); // used in repos.js
  const [followers, setFollowers] = useState(mockFollowers); // used in followers.js
  const [requests, setRequest] = useState(0); // used in search
  const [loading, setIsLoading] = useState(false); // used in dashbord.js, and in search.js
  // error
  const [error, setError] = useState({ show: false, msg: "" });

  // ====================================
  // check rate
  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        // data ke andar ek prop hai rate us me se used, remaining nikal lo
        let {
          rate: { remaining, used },
        } = data;

        setRequest(used);
        if (remaining === 0) {
          toggleError(true, "sorry, you have exceeded your hourly rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };

  // ================================
  // error check

  function toggleError(show = false, msg = "") {
    setError({ show, msg }); // new ES6 func where the key is the same as the value name
  }
  // this setup will not give the dependency error which we fix with useCallback
  useEffect(
    checkRequest,

    []
  );
  // ============================
  // search githubUser,  get repos data and followers data , this func is used in search.js
  // hame esi func se repos data, followes data, user data mile ga ,3 req hai es func me
  const searchGithubUser = async (passedUser) => {
    toggleError();
    setIsLoading(true);
    const resp = await axios(`${rootUrl}/users/${passedUser}`).catch((err) =>
      console.log(err)
    );
    if (resp) {
      setGithubUser(resp.data);
      const { login, followers_url } = resp.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          // result array me 2 values thi ha ne un ko destructre kiya, ham ne 1st valu ko repos name diya 2nd ko followers
          const [repos, followers] = results;
          const status = "fulfilled";
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "there is no user with that username");
    }
    checkRequest();
    setIsLoading(false);
  };
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider> // if the prop name is same as value name we can just use the property name only ie; GithubUser: GithubUser
  );
};

export { GithubContext, GithubProvider };
