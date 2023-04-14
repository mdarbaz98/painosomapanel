import axios from 'axios';

export class apiService {
    getCategory() {
      return  axios.get('http://localhost:5000/api/category').then((res) =>   res.data);
    }

    getParentCategory() {
      return  axios.get('http://localhost:5000/api/category/parentcategory').then((res) =>   res.data);
    }

    getSubCategory() {
      return  axios.get('http://localhost:5000/api/category/subcategory').then((res) =>   res.data);
    }
    getBlog() {
      return  axios.get('http://localhost:5000/api/blog').then((res) =>   res.data);
    }
    getAuthor() {
      return  axios.get('http://localhost:5000/api/author').then((res) =>   res.data);
    }
    getImages() {
        return axios.get("http://localhost:5000/api/image").then((res) => res.data);
      }
      getProducts() {
        return axios.get("http://localhost:5000/api/products").then((res) => res.data);
      }
}

