import Axios from "axios";

export class ImagesServices {
  getImages() {
    return Axios.get("http://192.168.0.143:5000/api/image").then((res) => res.data);
  }
}