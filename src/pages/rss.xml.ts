import type { APIRoute } from "astro";
import { feed } from "../lib/feed";

export const GET: APIRoute = (context) => feed(context, "pt-BR");
