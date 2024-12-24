// import 'dotenv/config';
import * as dotenv from "dotenv";

export const loadNodeEnvironment = (): dotenv.DotenvConfigOutput =>
    dotenv.config({
      path: `${__dirname}/../../../${process.env.NODE_ENV === "development" ? ".env" : ".env.prod"}`
    });
  
  