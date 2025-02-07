
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

export const inMemoryDataPath = path.join(
    __dirname,
    "../repositories",
    "data.json"

    /*
        __dirname,
        "..",
        "..",
        "..",
        "data.json"
    */
);