#!/usr/bin/env node

const yargs = require("yargs");
const axios = require("axios");

const options = yargs
.usage("Usage: -l <list>")
.options("l",{
    alias: "list",
    describe: "No. of github repos to be printed",
    type: "number",
  }).argv;

async function fetchData(url){
    try{
        
        const response = await axios.get(url);
        if(response.status===200){
            const result = response.data.items;
            const topRepositories = result.map((repo) => ({
                name: repo.name,
                stars: repo.stargazers_count,
              }));
        
              return topRepositories;
        }else{
            throw new Error(`Failed to fetch Data. Status code: ${response.status}`);
        }
    }catch(err){
        console.error(`Error fetching Data: ${err.message}`);
        return null;
    }
}

let url = `https://api.github.com/search/repositories?q=stars:>10&sort=stars&order=desc&per_page=10&page=1`;

//if list argument is passed
if(options.list){
        url = `https://api.github.com/search/repositories?q=stars:>10&sort=stars&order=desc&per_page=${options.list}&page=1`;
}

fetchData(url)
.then((topRepositories)=>{
    if(topRepositories){
        console.log(topRepositories);
    }else{
        console.log("Data not available");
    }
})
.catch((error)=>{
    console.error('An error occurred:', error);
});