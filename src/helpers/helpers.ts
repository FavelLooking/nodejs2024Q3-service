import { Response } from 'express';
import { validate as uuidValidate } from 'uuid';
export function validateUUID(id: string, res: Response): boolean {
  if (!uuidValidate(id)) {
    res.status(400).json({ message: 'User ID is invalid' });
    return false;
  }
  return true;
}
