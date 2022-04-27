import { createApp, provide, h } from "vue";
import Popup from "./Popup.vue";
import "@/styles/main.css";
import { ApolloClient, createHttpLink, InMemoryCache, } from "@apollo/client/core";
import { setContext } from 'apollo-link-context';
import clickOutside from "./click-outside.js";
import { DefaultApolloClient } from "@vue/apollo-composable";
import VueformToggle from '@vueform/toggle';

//글씨체 추가
let linkTag = document.createElement("link");
linkTag.setAttribute("href","https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,500,700&amp;display=swap&amp;subset=korean");
linkTag.setAttribute("rel","stylesheet");
document.head.appendChild(linkTag);


// const vm = createApp(Popup).use(clickOutside).mount(mountEl);
const MOUNT_EL_ID = "wishbucket-root";
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: "https://whipped-api.phloxcorp.io:446/",
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

let mountEl = document.createElement("div");
mountEl.setAttribute("id", MOUNT_EL_ID);
document.body.appendChild(mountEl);

createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(Popup)
}).use(clickOutside).component('Toggle', VueformToggle).mount(mountEl);


//클릭이벤트 발생시 background.js 로 부터 토큰값이 옴.
chrome.runtime.onMessage.addListener(message => {
  if (message.token) {
    //header에 token을 넣음
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: message.token ? `Bearer ${message.token}` : "",
        }
      }
    });
    apolloClient.setLink(authLink.concat(httpLink))
    document.getElementById('wishButton').click()
  } else if (message.order) { //백그라운드에서 DOM을 제어할 때 사용할 부분
    switch (message.state) {
      case "save":
        console.log("change state message recieved")
        document.getElementById('wishButton').disabled = false;
        document.getElementById('wishButton').click()
      default:
        break;
    }
  }
});

