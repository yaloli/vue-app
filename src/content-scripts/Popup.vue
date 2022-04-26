<script>
import { defineComponent, ref, onMounted, reactive, toRefs } from "vue";
import { useMutation } from "@vue/apollo-composable";
import Classify from "./components/Classify.vue"
import Footer from "./components/Footer.vue"
import gql from "graphql-tag";

export default defineComponent({
  name: 'Popup',
  components: {
    Classify, Footer
  },
  setup() {
    const now = ref("saving");
    const title = ref("위시템을 저장 중입니다");
    const footerVisibility = ref(false);
    const bodyVisibility = ref(false)
    const thumb = ref(
      "chrome-extension://ghlehbaadkhaeglpngmpecnmphoilibf/loader.gif"
    );
    const button = ref("저장");
    const baseUrl = ref("chrome-extension://ghlehbaadkhaeglpngmpecnmphoilibf/");
    const containerVisibility = ref(false);
    const seen = ref(true);
    const visible = ref(true);
    var token = "";
    const state = reactive({
      currentTab: null,
    });
    getToken();
    onMounted(() => {
      chrome.runtime.sendMessage({ type: "POPUP_INIT" }, async (tab) => {
        state.currentTab = await tab;
      });
    });
    const MUTATION_ZIM = gql`
        mutation{
          zimItem(input:{url:"${location.href}",tags:[]}){
            message
          }
        }
      `;
    const MUTATION_TOKEN = gql`
      mutation {
        authenticate(input: { accessToken: "${token}", identityProvider: GUEST }) {
          message
          token
        }
      }
    `;
    const {
      mutate: zimItem,
      onDone: ZimComplete,
      onError: ZimError,
    } = useMutation(MUTATION_ZIM);
    ZimComplete((result) => {
      console.log(result);
      setState("savecomplete");
    });
    ZimError((err) => {
      console.log(err);
      refreshToken();
    });

    const {
      mutate: refreshToken,
      onDone: refreshComplete,
      onError: refreshError,
    } = useMutation(MUTATION_TOKEN);
    refreshComplete((result) => {
      chrome.storage.local.set({ token: result.data.authenticate.token })
      chrome.runtime.sendMessage({
            type: "reToken",
            token: result.data.authenticate.token,
          })
    });
    refreshError((err) => {
      console.log(err);
    });

    function getToken() {
      chrome.storage.local.get(["token"], (a) => {
        token = a.token;
      });
    }

    function setState(state) {
      if (state === "savecomplete") {
        now.value = state;
        button.value = "삭제";
        thumb.value = baseUrl.value + "check.png";
        title.value = "저장 완료!";
        bodyVisibility.value = true
        footerVisibility.value = true
      } else if (state === "deleting") {
        now.value = state;
        button.value = "저장";
        thumb.value = baseUrl.value + "loader.gif";
        title.value = "위시템을 삭제 중입니다";
      } else if (state === "deletecomplete") {
        now.value = state;
        button.value = "저장";
        thumb.value = baseUrl.value + "check.png";
        title.value = "삭제 완료!";
      } else if (state === "saving") {
        now.value = state;
        button.value = "삭제";
        thumb.value = baseUrl.value + "loader.gif";
        title.value = "위시템을 저장 중입니다";
      }
    }

    function buttonclick() {
      if (button.value === "저장"&&now.value==="saving") {
        containerVisibility.value = true
        zimItem();
      }

      // chrome.storage.local.get(["token"], function (result) {
      //   console.log("Value currently is " + result.token);
      // });
    }

    return {
      now,
      title,
      thumb,
      button,
      visible,
      containerVisibility,
      footerVisibility,
      bodyVisibility,
      ...toRefs(state),
      buttonclick,
    };
  },

});
</script> 


<template>
  <div
    id="wishbucket-container"
    v-show="containerVisibility"
    v-click-outside="
      () => {
        containerVisibility = false;
      }
    "
  >
    <div class="saving">
      <div>
        <div class="loading top">
          <div class="imgwrap"><img :src="thumb" alt /></div>
        </div>
        <div id="saving" class="top">{{ title }}</div>
        <div class="wishbucket-button">
          <button @click="buttonclick" disabled id="wishButton">
            <p>{{ button }}</p>
          </button>
        </div>
      </div>
      <Classify v-show="bodyVisibility"/>
      <Footer v-show="footerVisibility"/>
    </div>
  </div>
</template>


<style>
#wishbucket-root {
  all: unset;
  background-color: none !important;
  padding: 0 !important;
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 9223372036854775807;
  color: black;
  font-family: "Noto Sans KR";
}
#wishbucket-root #wishbucket-container {
  background: rgb(255, 255, 255) !important;
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.15) !important;
  border: 1px !important;
  border-color: gray !important;
  width: 328px !important;
  border-radius: 36px !important;
  /* border-top-right-radius: 33px;
  border-top-left-radius: 33px; */
  margin-right: 10px;
  margin-top: 10px;
  text-align: center;
  float: right;
  height: auto;
  /* display: none; */
}
#wishbucket-root .saving {
  height: auto;
  width: 328px;
}
#wishbucket-root .saving > div:nth-child(1) {
  width: 328px;
  height: 85px;
}
#wishbucket-root #saving {
  vertical-align: auto !important;
  font-family: "Noto Sans KR" !important;
  font-weight: 400 !important;
  font-style: normal !important;
  font-weight: 700 !important;
  font-size: 16px !important;
}
#wishbucket-root .complete {
  height: 85px;
  margin: 0;
}
#wishbucket-root #complete {
  vertical-align: auto;
  font-size: 15px;
  font-family: "Noto Sans KR";
  font-weight: 400;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
}
#wishbucket-root .top {
  float: left;
  line-height: 75px;
  margin: 5px;
}
#wishbucket-root .wishbucket-button {
  float: right !important;
  height: 75px !important;
  margin: 5px !important;
  margin-right: 25px !important;
}
#wishbucket-root .loading {
  margin-left: 20px;
}
#wishbucket-root div.top img {
  width: 30px;
  height: 30px;
}
#wishbucket-root .imgwrap {
  line-height: 0px;
  margin-top: 22.5px;
  margin-bottom: 22.5px;
}


#wishbucket-root button {
  font-family: "Noto Sans KR" !important;
  background-color: none !important;
  padding: 0 !important;
  vertical-align: middle;
  margin: 15px 0px 0px 0px !important;
  width: 54px !important;
  height: 40px !important;
  border-radius: 15px !important;
  border: none !important;
  font-family: "Noto Sans KR" !important;
  font-style: normal !important;
  font-weight: 700 !important;
  font-size: 12px !important;
  background: #e6e6e6 !important;
  color: black !important;
}
#wishbucket-root button > p {
  line-height: 40px;
  margin: 0px;
  padding: 0px;
}
#wishbucket-root .text_area {
  vertical-align: auto;
  text-align: left;
  font-size: 14px;
  font-family: "Noto Sans KR";
  font-weight: 400;
  font-style: normal;
  font-weight: 700;
  width: 254px;
  float: left;
}



</style>
