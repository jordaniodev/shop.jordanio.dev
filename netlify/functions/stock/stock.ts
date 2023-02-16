import { Handler } from '@netlify/functions';
import stock from '../../models/stock';


const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};
export const handler: Handler = async (event) => {
  console.log(event.path)
  if (event.path === '/.netlify/functions/stock/' || event.path === '/.netlify/functions/stock') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(stock),
    }
  }
  let fullPathArray = event.path.split('/');
  let id = fullPathArray[fullPathArray.length - 1];
  const [filteredstock] = stock.filter((_stock) => _stock.id === Number(id))
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(filteredstock),
  }
}
