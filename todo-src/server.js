// import 'dotenv/config'
import './src/utils/db.js'

import app from './app.js'

import { infoLog, ulLog } from './src/utils/constants.js'

const port = process.env.PORT

app.listen(port, () => {
	infoLog('Listening on port ' + ulLog(port))
})
