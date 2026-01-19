import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const envPath = join(__dirname, '.env')
config({ path: envPath })
