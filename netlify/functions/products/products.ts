import { Handler } from '@netlify/functions';
import products from '../../models/products';


const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
};
export const handler: Handler = async (event) => {
  console.log(event.path)
  if (event.path === '/.netlify/functions/products/' || event.path === '/.netlify/functions/products') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    }
  }
  let fullPathArray = event.path.split('/');
  let id = fullPathArray[fullPathArray.length - 1];
  const [filteredproducts] = products.filter((product) => product.id === Number(id))
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(filteredproducts),
  }
}
