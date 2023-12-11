/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import { NextFunction, Request, Response } from 'express';
import { Repository } from '../repos/repo';

export abstract class Controller<T extends { id: unknown }> {
  constructor(protected repo: Repository<T>) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.create(req.body);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.repo.update) {
        const result = await this.repo.update(req.params.id, req.body);
        res.json(result);
      } else {
        throw new Error('Update method is not defined');
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.repo.delete) {
        await this.repo.delete(req.params.id);
        res.status(204);
        res.statusMessage = 'No content';
        res.json({});
      } else {
        throw new Error('Delete method is not defined');
      }
    } catch (error) {
      next(error);
    }
  }
}
