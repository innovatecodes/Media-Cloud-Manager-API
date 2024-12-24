
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const generateRandomId = () => {
    // Gera um número aleatório entre 0 e 1 bilhão (1E9) e arredonda para o inteiro mais próximo.
    return `${uuidv4()}-${new Date().getTime()}-${Math.round(Math.random() * 1E9)}`;
  }
  
  const getFileExtension = (fileOriginalName: string) => {
    return path.extname(fileOriginalName);
  }
  
  export const generateRandomFileName = (fileFieldName: string, fileOriginalName: string) => {
    return `${fileFieldName.replace(/_/g, '-')}-${generateRandomId()}${getFileExtension(fileOriginalName)}`;
  }