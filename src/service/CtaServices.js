import Axios from "axios";

export class CtaServices {
  getCta() {
    return Axios.get("http://192.168.0.143:5000/api/cta").then((res) => res.data);
  }
}