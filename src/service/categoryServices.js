import axios from 'axios';

export class CategoryService {
    getCategory() {
      return  axios.get('http://localhost:5000/api/category').then((res) =>   res.data);
    }

    getParentCategory() {
      return  axios.get('http://localhost:5000/api/category/parentcategory').then((res) =>   res.data);
    }
}

