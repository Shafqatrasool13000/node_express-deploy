require('dotenv').config();
require('express-async-errors');
const path = require('path');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Swagger
// const swaggerUI = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
// routers
const authRouter = require('./routes/authRoutes');
const tourGuideRouter = require('./routes/tourGuideRoutes');
const jobsRouter = require('./routes/jobs');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const storyRouter = require('./routes/storyRoutes');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const auth = require('./middleware/authentication');

// app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
// Define the path to your images directory
const imagesDirectory = path.join(__dirname, 'images');
const videosDirectory = path.join(__dirname, 'videos');

// Serve the images directory as a static folder
app.use('/images', express.static(imagesDirectory));
app.use('/videos', express.static(imagesDirectory));
app.use(helmet());
app.use(cors());
app.use(xss());

app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
app.use('/api/v1/getTourGuide', auth, tourGuideRouter);
app.use('/api/v1/admin', auth, adminRouter);
app.use('/api/v1/user', auth, userRouter);
app.use('/api/v1/story', auth, storyRouter);
app.use('/api/v1/post', auth, postRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
