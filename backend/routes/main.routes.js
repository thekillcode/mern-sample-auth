import express from 'express';
import { ReasonPhrases, StatusCodes } from '../errors/ApiError.js';
import { roleSeeder, userSeeder } from '../database/seeders/seeder.js';

const mainRouter = new express.Router();
// Add routes
mainRouter.get('/', async (req, res) => {
  return res.json({
    message: 'Welcome to Api Server ',
  });
});

mainRouter.get('/seeder', async (req, res) => {
  const { password } = req.body;
  if (password === 'lord123!@#') {
    const roleData = await roleSeeder(['Admin', 'User', 'Manager']);
    const UserData = await userSeeder([
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin123!@#',
        role: 'admin',
      },
      {
        username: 'user',
        email: 'user@example.com',
        password: 'user123!@#',
        role: 'user',
      },
    ]);
    return res.status(StatusCodes.CREATED).json({ roleData, UserData });
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: ReasonPhrases.UNAUTHORIZED,
    });
  }
});

// routerName.post('/', SessionController.store);
// routerName.put('/', SessionController.store);
// routerName.delete('/', SessionController.store);

export default mainRouter;
