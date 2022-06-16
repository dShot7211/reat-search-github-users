import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  let languages = repos.reduce((total, eachLangauge) => {
    const { language, stargazers_count } = eachLangauge;
    if (!language) return total;
    if (!total[language]) {
      // if total.language nahi hai then ek prop language ki bana do
      // aur key-value pair hamre , jo bhi language ki value upar se mile gi vo ek key ban jae gi
      // ie: total[lang] = 1 , lang: CSS,HTML,JS ie: css=1,html=1,js=1

      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    // languages is a obj obj objects
    // languages={CSS: {label: 'CSS', value: 38, stars: 412},
    //HTML: {label: 'HTML', value: 14, stars: 34},
    //JavaScript: {label: 'JavaScript', value: 45, stars: 376}}

    return total;
  }, {});

  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  // most stars per language
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars; // this just returns the top value and then sec top and 3 top
    })
    .map((item) => {
      return { ...item, value: item.stars };
    });

  // stars, forks
  // returning obj with stars and forks properties which are obj in themselves
  // see the vid 292 Q&A where the decending order of arrangement of values is explaine
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;

      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );
  // console.log(stars);

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D dataprop={mostUsed} />
        <Column3D dataprop={stars} />
        <Doughnut2D dataprop={mostPopular} />
        {/* <ExampleChart data={chartData} />; */}
        <Bar3D dataprop={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
