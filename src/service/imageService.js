import axios from 'axios';

export class imageService {
    //get all image
    getImage() {
        return  axios.get('http://192.168.0.143:5000/api/image').then((res) =>   res.data);
      }
}