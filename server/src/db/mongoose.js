// Load mongoose module
const mongoose = require('mongoose');

const connectionURL = `mongodb+srv://mongodblesson:hLheELK9WCYjBN1L@cluster0.y07mk.mongodb.net/node-auth?retryWrites=true&w=majority`;

mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => app.listen(3000))
  .catch((error) => {
    console.log(error);
  });
