import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() =>{
  const storagedCart = localStorage.getItem('@RocketShoes:cart')
  if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });
  
  const addProduct = async (productId: number) => {
    try {
      const updatedCard = [...cart];
      const productExist = findProduct(updatedCard,productId)
      const stock = await api.get(`/stock/${productId}`)
      const stockAmount = stock.data.amount
      const currentAmount = productExist ? productExist.amount : 0;
      const amount = currentAmount + 1;
      
      if(amount > stockAmount){
        
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if(productExist){
        productExist.amount = amount
      }else{
        const product = await api.get('/products/' + productId)

        const newProduct = {
          ...product.data,
          amount: 1
        }
        updatedCard.push(newProduct)
      }

      updateStorageCart(updatedCard)
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const findProduct = (storageItems: Product[], productId: number) => {
    return storageItems.find((storageItem) => storageItem.id === productId)
  }

  const updateStorageCart = (storageCart: Product[]) => {
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(storageCart))
    setCart(storageCart)
  }

  const removeProduct = (productId: number) => {
    try {
      const storageItems = [...cart]
      const productExist = storageItems.findIndex(product => product.id === productId)
      
      if(productExist === -1){
        toast.error('Erro na remoção do produto');
        return;
      }
      storageItems.splice(productExist, 1)
      updateStorageCart(storageItems)
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {

      if(amount <= 0)
        return;

      const storageCarts = [...cart];
      const productExist = findProduct(storageCarts,productId);
      const amountData = await api.get(`/stock/${productId}`)
      
      if(amountData.data.amount < amount){
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }
      
      if(productExist){
        productExist['amount'] = amount;
      }
      updateStorageCart(storageCarts)
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);
  return context;
}
