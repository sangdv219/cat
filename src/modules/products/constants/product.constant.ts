export const PRODUCT_ENTITY = {
  NAME: 'Product',
  TABLE_NAME: 'products',
};
export const PRODUCT_SERVICE = 'product_service';
export enum ProductMsg {
  CREATE = 'create_product',
  FIND_ALL = 'find_all_products',
  FIND_ONE = 'find_one_product',
  UPDATE = 'update_product',
  DELETE = 'delete_product',
}