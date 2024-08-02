import * as fs from "fs";

export const loadEnvironment = () => {
    const files = fs.readdirSync('../' + __dirname);

    if (files.includes('.production')) return '.production.env';
    
    return '.development.env';
}