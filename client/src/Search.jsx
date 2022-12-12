import React, { useState } from 'react';
import { Searcher } from './modules/searcher.js';
import { Settings } from './Settings.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const searcher = new Searcher('languagelearning');

export function Search({ site, seSite, sortby }) {
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  let site = props.site;
  let sort = props.sort;

  const updateResults = async () => {
    if (!question) {
      return <div>No question given.</div>;
    } //'how to --good learn chinese !-happy --expensive';
    let sq = searcher.toSearchQuery(question);
    switch (site) {
      case 'stackexchange':
        props.setRawArticles(
          await searcher.searchStackExchange('languagelearning', sq, sort)
        );
        break;
      case 'google':
        props.setRawArticles(await searcher.searchGoogle(sq, sort));
        break;
      default:
        props.setRawArticles([
          { title: 'dummytitle', link: 'dummylink', id: 'dummyid' },
        ]);
    }
    // console.table(rawArticles);
  };

  const handleSiteChange = (newSite) => {
    props.setSite(newSite);
    site = newSite;
    console.log(seSite);
    await updateResults();
    updateSearchParams();
  };

  const handleSortChange = async (newSort) => {
    props.setSort(newSort);
    sort = newSort;
    console.log(newSort);
    await updateResults();
    updateSearchParams();
  };

  const submitReq = async () => {
    await updateResults();
    updateSearchParams();
  };

  const updateSearchParams = () => {
    let tempParams = {};
    if (question) tempParams.q = question;
    if (site) tempParams.site = site;
    if (seSite) tempParams.sesite = seSite;
    if (sort) tempParams.sortby = sort;
    console.log(tempParams);
    navigate('/results');
    setSearchParams(tempParams);
  };

  useEffect(() => {
    updateSearchParams();
    handleSortChange(sort);
    handleSiteChange(site);
    submitReq();
  }, []);

  return (
    <>
      <Settings
        site={site}
        setSite={handleSiteChange}
        setSort={handleSortChange}
      />
      <form
        className="search-bar"
        onSubmit={(event) => {
          event.preventDefault();
          submitReq();
        }}
      >
        <label>
          <input
            className="search-bar-input"
            type="text"
            value={question}
            placeholder="Enter a question or search terms..."
            onChange={(event) => {
              setQuestion(event.target.value);
            }}
          />
        </label>
        <input className="search-bar-submit" type="submit" value="Search" />
      </form>
    </>
  );
}
