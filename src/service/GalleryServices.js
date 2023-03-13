import Axios from "axios";

export class ImagesServices {
  getImages() {
    return Axios.get("http://localhost:5000/api/image").then((res) => res.data);
  }
}