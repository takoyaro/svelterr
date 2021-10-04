#!/usr/bin/env node
import {readFileSync,readdirSync,mkdirSync,copyFileSync} from 'fs';
import path from 'path';
import {execSync} from 'child_process';

let packageJSONPath = `${path.resolve()}/package.json`;
try{
    let _rootdir = readFileSync(packageJSONPath).toString();
    let f = JSON.parse(_rootdir);
    if(f.hasOwnProperty('devDependencies')){
        if(f.devDependencies.hasOwnProperty('@sveltejs/kit')){
            install();
        }
        else{
            console.log("SvelteKit not present");
        }
    }
    else{
        console.log("No dev dependencies?");
    }
}
catch(e){
    console.log("Can't find your project. Are you in your SvelteKit project root directory?")
}

process.exit(0);// 0 means there were no errors
function install(){
    createRoute();
    copyEndpoint();
    installCore();
}
function createRoute(){
    let src = readdirSync('src');
    if(src.includes('routes')){
        let routes = readdirSync('src/routes');
        if(routes.includes('SveltErr')){
            console.log("Folder already exists. Is this a clean install?")
        }
        else{
            console.log("Got routes, creating SveltErr");
            mkdirSync('./src/routes/SveltErr/',{recursive:true})
        }
    }
    else{
        mkdirSync('routes/SveltErr',{recursive:true});
    }
}
function copyEndpoint(){
    try{
        copyFileSync(process.argv[1].replace('index.js','[slug].json.ts'),'src/routes/SveltErr/[slug].json.ts');
    }
    catch(e){
        console.error("Couldn't copy the file")
    }
}
function installCore(){
    execSync("npm i --save-dev svelterr-core retrace")
}