import { checkEnvironment } from "./utils.js";
import OpenAI from "openai";

checkEnvironment();

const openai = OpenAI({});
