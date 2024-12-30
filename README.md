npm init -y
npm install --save-dev typescript
nano tsconfig.json

<!--  -->

<!--  -->

npm install --save express@4.17.1
npm install -save-dev @types/express@4.17.1

<!-- index.js -->

import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
res.send('Hello World!');
});

app.listen(port, () => {
return console.log(`Express is listening at http://localhost:${port}`);
});

<!--  -->

npx tsc

node dist/index.js

"start": "tsc && node dist/index.js",
"dev": "nodemon --exec ts-node index.ts",
