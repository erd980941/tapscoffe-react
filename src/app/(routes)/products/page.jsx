import { getProducts } from '../../../services/productService';
import ProductClient from './ProductClient';

const ProductsPage = async () => {
  const products = await getProducts(); 

  return (
    <div>
      <ProductClient products={products} />
    </div>
  );
};

export default ProductsPage;
