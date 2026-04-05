import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

const url = process.env.SUPABASE_URL;
if (!url) throw new Error("expected env var SUPABASE_API_URL");
const key = process.env.SUPABASE_KEY;
if (!key) throw new Error("expected env var SUPABASE_API_KEY");
export const supabase = createClient(url, key);
