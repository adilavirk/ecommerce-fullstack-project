import CommonProductsListing from "../../../components/CommonProductsListing";
import { getAllProducts } from "../../../services/product";

const AdminAllProducts = async () => {
  const allAdminProducts = await getAllProducts();

  return (
    <CommonProductsListing data={allAdminProducts && allAdminProducts.data} />
  );
};

export default AdminAllProducts;
