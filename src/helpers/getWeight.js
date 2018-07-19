import { comma } from './comma';

export const getWeight = (product, quantity, decimal = 2) => {
  const { product_thick, product_length, product_width } = product;
  const weight =
    Number(product_thick) *
    (Number(product_length) + 5) *
    (Number(product_width) / 100) *
    0.0184 *
    Number(quantity);

  return comma(weight.toFixed(decimal));
};
