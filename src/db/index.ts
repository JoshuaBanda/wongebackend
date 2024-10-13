import {config} from 'dotenv';
import {drizzle} from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';

import 'dotenv/config'

config({path:'.env'});


const client = postgres(process.env.DATABASE_URL!);
export const db=drizzle(client);