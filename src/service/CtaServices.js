import Axios from "axios";

export class CtaServices {
  getCta() {
    return Axios.get("http://localhost:5000/api/cta").then((res) => res.data);
  }
}