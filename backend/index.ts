import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { StableBTreeMap, Server } from 'azle';
import express, { Request, Response } from 'express';

type GeneratedContext = {
  id: string;
  text: string;
  userId: string;
  imageUrl: string;
};

type GeneratedContextPayload = Omit<GeneratedContext, 'id'>;

const db = StableBTreeMap<string, GeneratedContext[]>(0);

export default Server(() => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  /**
   *
   * @description Add a context
   *
   */
  app.post('/contexts', (req: Request, res: Response) => {
    const payload = req.body as GeneratedContextPayload;

    if (!(payload.imageUrl && payload.text && payload.userId)) {
      res.status(400).send({ msg: 'Bad payload: all fields are required!' });
      return;
    }

    const id = uuidv4();
    const context = { ...payload, id };

    const userContextsOpt = db.get(payload.userId);

    if ('None' in userContextsOpt) {
      db.insert(payload.userId, [context]);

      res.status(201).send({ msg: 'context added successfully', context });
      return;
    }

    const contexts = userContextsOpt.Some;
    const newContexts = [...contexts, context];

    db.insert(payload.userId, newContexts);
    res.status(201).send({ msg: 'context added successfully', context });
  });

  /**
   *
   * @description Get all contexts not created by the requesting user
   *
   */
  app.get('/contexts', (req: Request, res: Response) => {
    const userId = req.query.userId as string;

    if (!userId) {
      res.status(400).send({ msg: 'userId query param is required' });
      return;
    }

    const arrayOfContexts = db.values();

    if (arrayOfContexts.length < 1) {
      res.status(404).send({ msg: 'no contexts added yet' });
      return;
    }

    const contexts = arrayOfContexts.flat(1);
    const nonUserContexts = contexts.filter(
      (context) => context.userId !== userId
    );

    res.status(200).send({
      msg: 'successfully get others contexts',
      contexts: nonUserContexts,
    });
  });

  /**
   *
   * @description Get all contexts created by the requesting user
   *
   */
  app.get('/contexts/:userId', (req: Request, res: Response) => {
    const userId = req.params.userId as string;

    if (!userId) {
      res.status(400).send({ msg: 'userId param is required' });
    }

    const userContexts = db.get(userId);

    if ('None' in userContexts) {
      res.status(404).send({ msg: 'no contexts for associated userId' });
      return;
    }

    res.status(200).send({
      msg: 'successfully get contexts for ' + userId,
      contexts: userContexts.Some,
    });
  });

  /**
   *
   * @description Delete a context created by the requesting user
   *
   */
  app.delete('/contexts', (req: Request, res: Response) => {
    const contextId = req.body.contextId as string;
    const userId = req.body.userId as string;

    if (!(contextId && userId)) {
      res.status(400).send({ msg: 'both contextId and userId are required' });
      return;
    }

    const contextsOpt = db.get(userId);

    if ('None' in contextsOpt) {
      res
        .status(400)
        .send({
          msg: 'cannot delete: no context objects exists for associated userId',
        });
      return;
    }

    const contexts = contextsOpt.Some;
    const context = contexts.find((ctx) => ctx.id === contextId);

    if (!context) {
      res.status(400).send({
        msg:
          'cannot delete: no context found for provided contextId: ' +
          contextId,
      });
      return;
    }

    const newContexts = contexts.filter((context) => context.id !== contextId);
    db.insert(userId, newContexts);

    res.status(200).send({
      msg: 'successfully delete a context with ID ' + contextId,
      contexts: newContexts,
    });
  });

  return app.listen();
});
