import axios from 'axios';

export class imageService {
    //get all image
    getImage() {
        return  axios.get('http://localhost:5000/api/image').then((res) =>   res.data);
      }
}