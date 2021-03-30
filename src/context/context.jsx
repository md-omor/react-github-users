import axios from "axios";
import { createContext, useEffect, useState } from "react";
import MockFollowers from "./mockData.js/MockFollowers";
import MockRepos from "./mockData.js/MockRepos";
import MockUsers from "./mockData.js/MockUsers";

const rootUrl = "https://api.github.com";

const GithubContext = createContext();

// Provider, Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
  const [githubUser, setgithubUser] = useState(MockUsers);
  const [repos, setrepos] = useState(MockRepos);
  const [followers, setfollowers] = useState(MockFollowers);
  // request loading

  const [requests, setrequests] = useState(0);
  const [isloading, setisloading] = useState(false);
  // error

  const [error, seterror] = useState({ show: false, msg: "" });

  const toggleError = (show = false, msg = "") => {
    seterror({ show, msg });
  };

  const searchGithubUser = async (user) => {
    toggleError();
    setisloading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    console.log(response);
    if (response) {
      setgithubUser(response.data);

      const { login, followers_url } = response.data;

      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";
          if (repos.status === status) {
            setrepos(repos.value.data);
          }
          if (followers.status === status) {
            setfollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "there is no user with that username");
    }
    checkRequests();
    setisloading(false);
  };

  // check rate

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setrequests(remaining);
        if (remaining === 0) {
          // throw an error
          toggleError(true, "sorry, you have exceeded your hourly rate limit!");
        }
      })
      .catch((err) => console.log(err));
  };

  // error

  useEffect(checkRequests, []);
  // console.log("hey app loaded");;

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isloading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
