import store from "@/store";
import axios from "axios";

store.subscribe((mutation) => {
//   switch (mutation.type){
//     case "setAuthenticated":
//       if(mutation.payload){
//         axios.defaults.headers.common["x-access-token"] = localStorage.getItem("accessToken");
//       }
//       else{
//         axios.defaults.headers.common["x-access-token"] = null;
//       }
//   }  
})