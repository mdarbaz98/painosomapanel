import axios from 'axios';


export class ProductService {

    getProductsSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }

    getProducts() {
        return axios.get('assets/demo/data/products.json').then(res => res.data.data);
    }

    getProductsWithOrdersSmall() {
        return axios.get('assets/demo/data/products-orders-small.json').then(res => res.data.data);
    }

    getCategory() {
      return  axios.get('http://192.168.0.143:5000/api/category').then((res) =>   res.data);
    }

    getSubCategory() {
      return  axios.get('http://192.168.0.143:5000/api/category/subcategory').then((res) =>   res.data);
    }

    getParentCategory() {
      return  axios.get('http://192.168.0.143:5000/api/parentcategory').then((res) =>   res.data);
    }

    getBlog() {
      return  axios.get('http://192.168.0.143:5000/api/blog').then((res) =>   res.data);
    }

  //   getTreeNodes() {
  //     return fetch('assets/demo/data/treenodes.json').then(res => res.json())
  //             .then(d => d.root);
  // }
}